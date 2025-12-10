import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/menu-items", async (_req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.get("/api/menu-items/:categoryId", async (req, res) => {
    const items = await storage.getMenuItemsByCategory(req.params.categoryId);
    res.json(items);
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const parsed = webhookRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const { food_item_id, item_name, item_price, category, current_cart_items } = parsed.data;

      if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
        try {
          const prompt = `You are a fine dining restaurant sommelier and food pairing expert. A customer just added "${item_name}" ($${item_price}) from the "${category}" category to their cart.

Current cart items: ${current_cart_items.length > 0 ? current_cart_items.map(i => i.name).join(", ") : "None yet"}

Based on culinary pairing principles, suggest 2-3 complementary menu items. For each suggestion provide:
1. A menu item that pairs well (from a different category if possible)
2. A brief pairing reason (2-4 words like "Perfect pairing", "Rich finish", "Luxury combination")

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "category": "main-course|starters|desserts|drinks|chefs-special|sides",
      "reason": "Perfect pairing"
    }
  ]
}

Consider:
- Starters pair with main courses and drinks
- Main courses pair with sides, desserts, and wines
- Desserts pair with dessert wines and coffee drinks
- Chef's specials pair with premium drinks`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_tokens: 500,
          });

          const content = response.choices?.[0]?.message?.content;
          if (content) {
            let aiRecommendations: Array<{ category: string; reason: string }> = [];
            try {
              const parsedContent = JSON.parse(content);
              if (Array.isArray(parsedContent?.recommendations)) {
                aiRecommendations = parsedContent.recommendations;
              }
            } catch (parseError) {
              console.error("Failed to parse AI response:", parseError);
            }
            
            if (aiRecommendations.length > 0) {
              const recommendations = [];
              for (const rec of aiRecommendations) {
                if (!rec.category) continue;
                
                const items = await storage.getMenuItemsByCategory(rec.category);
                const availableItems = items.filter(
                  (item) => 
                    item.id !== food_item_id && 
                    !current_cart_items.some((ci) => ci.id === item.id)
                );
                
                if (availableItems.length > 0) {
                  const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
                  recommendations.push({
                    id: randomItem.id,
                    name: randomItem.name,
                    description: randomItem.description,
                    price: randomItem.price,
                    image: randomItem.image,
                    reason: rec.reason || "Recommended",
                  });
                }
                
                if (recommendations.length >= 3) break;
              }
              
              if (recommendations.length > 0) {
                return res.json(recommendations);
              }
            }
          }
        } catch (aiError) {
          console.error("AI recommendation error:", aiError);
        }
      }

      const recommendations = await storage.getRecommendations(food_item_id, category);
      const filteredRecommendations = recommendations.filter(
        (rec) => !current_cart_items.some((ci) => ci.id === rec.id)
      );
      
      res.json(filteredRecommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  return httpServer;
}
