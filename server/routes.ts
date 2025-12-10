import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "@shared/schema";

const WEBHOOK_URL = "https://n8nadmin.1automation.us/webhook/1eb14931-a1ae-4a8b-bbff-0b8df36e18d9";

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

      const { food_item_id, item_name, item_price, category, current_cart_items, timestamp } = parsed.data;

      let webhookSuccess = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            food_item_id,
            item_name,
            item_price,
            category,
            current_cart_items,
            timestamp,
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (webhookResponse.ok) {
          try {
            const webhookData = await webhookResponse.json();
            
            let items: any[] = [];
            if (Array.isArray(webhookData) && webhookData.length > 0) {
              items = webhookData;
            } else if (webhookData && typeof webhookData === "object" && Array.isArray(webhookData.recommendations) && webhookData.recommendations.length > 0) {
              items = webhookData.recommendations;
            }
            
            if (items.length > 0) {
              const recommendations = items.map((item: any) => ({
                id: item.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: item.name || "Recommended Item",
                description: item.description || "",
                price: item.price || 0,
                image: item.image || "",
                reason: item.reason || "Recommended for you",
              }));
              webhookSuccess = true;
              return res.json(recommendations);
            }
          } catch (parseError) {
            console.error("Failed to parse webhook response:", parseError);
          }
        } else {
          console.error("Webhook returned non-OK status:", webhookResponse.status);
        }
      } catch (webhookError) {
        console.error("Webhook request failed:", webhookError);
      }
      
      if (webhookSuccess) return;

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
