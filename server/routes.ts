import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "@shared/schema";

const WEBHOOK_URL = "https://n8nadmin.1automation.us/webhook/1eb14931-a1ae-4a8b-bbff-0b8df36e18d9";

// Menu items database for image lookup
const menuItems = [
  // Starters
  { id: "starter-1", name: "Bruschetta Trio", price: 14.99, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop&q=80", categoryId: "starters" },
  { id: "starter-2", name: "Crispy Calamari", price: 16.99, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80", categoryId: "starters" },
  { id: "starter-3", name: "Burrata & Prosciutto", price: 18.99, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=80", categoryId: "starters" },
  { id: "starter-4", name: "Tuna Tartare", price: 19.99, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80", categoryId: "starters" },
  { id: "starter-5", name: "French Onion Soup", price: 12.99, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80", categoryId: "starters" },
  
  // Main Course
  { id: "main-1", name: "Grilled Atlantic Salmon", price: 32.99, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  { id: "main-2", name: "Prime Ribeye Steak", price: 48.99, image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  { id: "main-3", name: "Wild Mushroom Risotto", price: 26.99, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  { id: "main-4", name: "Lobster Thermidor", price: 58.99, image: "https://images.unsplash.com/photo-1553247407-23251ce81f59?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  { id: "main-5", name: "Herb-Crusted Rack of Lamb", price: 44.99, image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  { id: "main-6", name: "Pan-Roasted Duck Breast", price: 38.99, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&auto=format&fit=crop&q=80", categoryId: "main-course" },
  
  // Desserts
  { id: "dessert-1", name: "Chocolate Lava Cake", price: 12.99, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80", categoryId: "desserts" },
  { id: "dessert-2", name: "Crème Brûlée", price: 10.99, image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&auto=format&fit=crop&q=80", categoryId: "desserts" },
  { id: "dessert-3", name: "Tiramisu", price: 11.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80", categoryId: "desserts" },
  { id: "dessert-4", name: "New York Cheesecake", price: 11.99, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80", categoryId: "desserts" },
  { id: "dessert-5", name: "Affogato", price: 8.99, image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80", categoryId: "desserts" },
  
  // Drinks
  { id: "drink-1", name: "Classic Negroni", price: 14.99, image: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=800&auto=format&fit=crop&q=80", categoryId: "drinks" },
  { id: "drink-2", name: "Signature Old Fashioned", price: 15.99, image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80", categoryId: "drinks" },
  { id: "drink-3", name: "Reserve Red Wine", price: 18.99, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80", categoryId: "drinks" },
  { id: "drink-4", name: "Champagne Flute", price: 22.99, image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&auto=format&fit=crop&q=80", categoryId: "drinks" },
  { id: "drink-5", name: "Craft Espresso Martini", price: 15.99, image: "https://images.unsplash.com/photo-1545438102-799c3991ffb2?w=800&auto=format&fit=crop&q=80", categoryId: "drinks" },
  
  // Chef's Special
  { id: "special-1", name: "Wagyu Beef Tataki", price: 68.99, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80", categoryId: "chefs-special" },
  { id: "special-2", name: "Truffle Tasting Experience", price: 89.99, image: "https://images.unsplash.com/photo-1518740144021-a0f0c1f0f4ff?w=800&auto=format&fit=crop&q=80", categoryId: "chefs-special" },
  { id: "special-3", name: "Omakase Sashimi Platter", price: 75.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80", categoryId: "chefs-special" },
  { id: "special-4", name: "Tasting Menu for Two", price: 195.99, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80", categoryId: "chefs-special" },
  
  // Sides
  { id: "side-1", name: "Truffle Parmesan Fries", price: 9.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80", categoryId: "sides" },
  { id: "side-2", name: "Roasted Garlic Mashed Potatoes", price: 8.99, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&auto=format&fit=crop&q=80", categoryId: "sides" },
  { id: "side-3", name: "Grilled Asparagus", price: 9.99, image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=800&auto=format&fit=crop&q=80", categoryId: "sides" },
  { id: "side-4", name: "Sautéed Wild Mushrooms", price: 10.99, image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&auto=format&fit=crop&q=80", categoryId: "sides" },
  { id: "side-5", name: "Caesar Salad", price: 10.99, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80", categoryId: "sides" },
];

// Helper function to find menu item by name with fuzzy matching
function findMenuItemByName(name: string) {
  if (!name) return null;
  
  const normalizedName = name.toLowerCase().trim();
  
  // 1. Exact match
  let match = menuItems.find(item => item.name.toLowerCase() === normalizedName);
  if (match) {
    console.log(`✅ Exact match found: "${name}" → "${match.name}"`);
    return match;
  }
  
  // 2. Contains match (either direction)
  match = menuItems.find(item => {
    const menuName = item.name.toLowerCase();
    return menuName.includes(normalizedName) || normalizedName.includes(menuName);
  });
  if (match) {
    console.log(`✅ Partial match found: "${name}" → "${match.name}"`);
    return match;
  }
  
  // 3. Word-by-word match (find key words)
  const words = normalizedName.split(' ').filter(w => w.length > 3);
  for (const word of words) {
    match = menuItems.find(item => item.name.toLowerCase().includes(word));
    if (match) {
      console.log(`✅ Word match found: "${name}" (word: "${word}") → "${match.name}"`);
      return match;
    }
  }
  
  console.log(`❌ No match found for: "${name}"`);
  return null;
}

function parseHtmlRecommendations(html: string, itemName: string): any[] {
  const recommendations: any[] = [];
  
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
      const priceRegex = /\$?\s*(\d+(?:\.\d{1,2})?)/;
      const priceMatch = line.match(priceRegex);
      const price = priceMatch ? parseFloat(priceMatch[1]) : Math.floor(Math.random() * 15) + 5;

      const cleanName = line.replace(/\$?\s*\d+(?:\.\d{1,2})?/, '').trim();

      if (cleanName.length > 2 && !recommendations.some(r => r.name.toLowerCase() === cleanName.toLowerCase())) {
        const menuItem = findMenuItemByName(cleanName);
        
        recommendations.push({
          id: menuItem?.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          description: `Recommended to pair with ${itemName}`,
          price: menuItem?.price || price,
          image: menuItem?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",        
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
          console.log("📥 Webhook response (raw):", responseText.substring(0, 500));
          console.log("📋 Content-Type:", contentType);

          let items: any[] = [];

          if (contentType.includes("application/json") || responseText.trim().startsWith("[") || responseText.trim().startsWith("{")) {
            try {
              const webhookData = JSON.parse(responseText);
              console.log("✅ Parsed as JSON:", JSON.stringify(webhookData, null, 2));

              if (Array.isArray(webhookData) && webhookData.length > 0) {
                items = webhookData;
              } else if (webhookData && typeof webhookData === "object" && Array.isArray(webhookData.recommendations) && webhookData.recommendations.length > 0) {
                items = webhookData.recommendations;
              } else if (webhookData && typeof webhookData === "object" && !Array.isArray(webhookData) && !webhookData.message) {
                items = [webhookData];
              }
            } catch (jsonError) {
              console.log("⚠️ Not valid JSON, trying HTML parse");
              items = parseHtmlRecommendations(responseText, item_name);
            }
          } else if (contentType.includes("text/html") || responseText.trim().startsWith("<")) {
            console.log("🔄 Parsing HTML response");
            items = parseHtmlRecommendations(responseText, item_name);
          }

          if (items.length > 0) {
            console.log("\n🔍 Starting image mapping for recommendations...\n");
            
            const recommendations = items.map((item: any, index: number) => {
              // Get the item name from webhook (try multiple possible fields)
              const webhookName = item.name || item.product_name || item.item_name || "";
              
              console.log(`\n--- Recommendation ${index + 1} ---`);
              console.log(`Webhook item name: "${webhookName}"`);
              
              // Find matching menu item to get the image
              const menuItem = findMenuItemByName(webhookName);
              
              const recommendation = {
                id: menuItem?.id || item.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: webhookName || "Recommended Item",
                description: item.description || item.product_description || `Perfect pairing with ${item_name}`,
                price: parseFloat(item.price) || parseFloat(item.product_price) || menuItem?.price || 10.99,
                image: menuItem?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
                reason: item.reason || item.pairing_reason || "Perfect pairing",
              };
              
              console.log(`Final image URL: ${recommendation.image}`);
              console.log(`Using ${menuItem ? 'MENU ITEM' : 'FALLBACK'} image\n`);
              
              return recommendation;
            });
            
            console.log("\n✅ Final recommendations with images:", JSON.stringify(recommendations, null, 2));
            webhookSuccess = true;
            return res.json(recommendations);
          }
        } else {
          console.error("❌ Webhook returned non-OK status:", webhookResponse.status);
        }
      } catch (webhookError) {
        console.error("❌ Webhook request failed:", webhookError);
      }

      if (webhookSuccess) return;

      // Fallback to storage recommendations
      console.log("⚠️ Using fallback storage recommendations");
      const recommendations = await storage.getRecommendations(food_item_id, category);
      const filteredRecommendations = recommendations.filter(
        (rec) => !current_cart_items.some((ci) => ci.id === rec.id)
      );

      res.json(filteredRecommendations);
    } catch (error) {
      console.error("💥 Recommendations error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  return httpServer;
}