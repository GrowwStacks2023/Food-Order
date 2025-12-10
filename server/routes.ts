import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "@shared/schema";

const WEBHOOK_URL = "https://n8nadmin.1automation.us/webhook/1eb14931-a1ae-4a8b-bbff-0b8df36e18d9";

function parseHtmlRecommendations(html: string, itemName: string): any[] {
  const recommendations: any[] = [];
  
  const itemRegex = /<div[^>]*class="[^"]*recommendation[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  const nameRegex = /<(?:h[1-6]|span|p)[^>]*class="[^"]*(?:name|title|product)[^"]*"[^>]*>([^<]+)<\/(?:h[1-6]|span|p)>/gi;
  const priceRegex = /\$?\s*(\d+(?:\.\d{1,2})?)/;
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/i;
  
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const lines = textContent.split(/[,.\n]/).map(l => l.trim()).filter(l => l.length > 3 && l.length < 100);
  
  const foodKeywords = ['pizza', 'burger', 'drink', 'cola', 'coffee', 'wine', 'beer', 'salad', 
    'pasta', 'steak', 'chicken', 'fish', 'soup', 'dessert', 'cake', 'ice cream', 'fries',
    'sandwich', 'bread', 'juice', 'water', 'soda', 'tea', 'cocktail', 'appetizer'];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasFood = foodKeywords.some(keyword => lowerLine.includes(keyword));
    
    if (hasFood || (line.length > 5 && line.length < 60)) {
      const priceMatch = line.match(priceRegex);
      const price = priceMatch ? parseFloat(priceMatch[1]) : Math.floor(Math.random() * 15) + 5;
      
      const cleanName = line.replace(/\$?\s*\d+(?:\.\d{1,2})?/, '').trim();
      
      if (cleanName.length > 2 && !recommendations.some(r => r.name.toLowerCase() === cleanName.toLowerCase())) {
        recommendations.push({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          description: `Recommended to pair with ${itemName}`,
          price: price,
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
          reason: "Perfect pairing",
        });
      }
      
      if (recommendations.length >= 3) break;
    }
  }
  
  return recommendations;
}

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
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
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
          const contentType = webhookResponse.headers.get("content-type") || "";
          const responseText = await webhookResponse.text();
          console.log("Webhook response (raw):", responseText.substring(0, 500));
          console.log("Content-Type:", contentType);
          
          let items: any[] = [];
          
          if (contentType.includes("application/json") || responseText.trim().startsWith("[") || responseText.trim().startsWith("{")) {
            try {
              const webhookData = JSON.parse(responseText);
              console.log("Parsed as JSON:", JSON.stringify(webhookData, null, 2));
              
              if (Array.isArray(webhookData) && webhookData.length > 0) {
                items = webhookData;
              } else if (webhookData && typeof webhookData === "object" && Array.isArray(webhookData.recommendations) && webhookData.recommendations.length > 0) {
                items = webhookData.recommendations;
              } else if (webhookData && typeof webhookData === "object" && !Array.isArray(webhookData) && !webhookData.message) {
                items = [webhookData];
              }
            } catch (jsonError) {
              console.log("Not valid JSON, trying HTML parse");
              items = parseHtmlRecommendations(responseText, item_name);
            }
          } else if (contentType.includes("text/html") || responseText.trim().startsWith("<")) {
            console.log("Parsing HTML response");
            items = parseHtmlRecommendations(responseText, item_name);
          }
          
          if (items.length > 0) {
            const recommendations = items.map((item: any) => ({
              id: item.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: item.name || item.product_name || item.item_name || "Recommended Item",
              description: item.description || item.product_description || `Perfect pairing with ${item_name}`,
              price: parseFloat(item.price) || parseFloat(item.product_price) || 0,
              image: item.image || item.product_image || item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
              reason: item.reason || item.pairing_reason || "Perfect pairing",
            }));
            console.log("Final recommendations:", JSON.stringify(recommendations, null, 2));
            webhookSuccess = true;
            return res.json(recommendations);
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
