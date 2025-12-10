import type { Category, MenuItem } from "@shared/schema";

export const categories: Category[] = [
  {
    id: "starters",
    name: "Starters",
    description: "Begin your culinary journey with our exquisite appetizers",
    image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "main-course",
    name: "Main Course",
    description: "Expertly crafted entrees to satisfy every palate",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet finales that leave a lasting impression",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Curated beverages to complement your meal",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "chefs-special",
    name: "Chef's Special",
    description: "Signature creations from our culinary maestro",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "sides",
    name: "Sides",
    description: "Perfect accompaniments to enhance your experience",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&auto=format&fit=crop&q=80",
  },
];

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: "starter-1",
    categoryId: "starters",
    name: "Bruschetta Trio",
    description: "Three varieties of our signature bruschetta: classic tomato basil, wild mushroom truffle, and whipped ricotta with honey drizzle",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "starter-2",
    categoryId: "starters",
    name: "Crispy Calamari",
    description: "Tender calamari rings lightly fried to golden perfection, served with zesty lemon aioli and house marinara",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "starter-3",
    categoryId: "starters",
    name: "Burrata & Prosciutto",
    description: "Creamy burrata cheese with aged prosciutto di Parma, arugula, and balsamic reduction",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "starter-4",
    categoryId: "starters",
    name: "Tuna Tartare",
    description: "Fresh ahi tuna with avocado mousse, sesame ginger dressing, and crispy wonton chips",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "starter-5",
    categoryId: "starters",
    name: "French Onion Soup",
    description: "Classic caramelized onion soup with gruyère crouton, gratinéed to perfection",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },

  // Main Course
  {
    id: "main-1",
    categoryId: "main-course",
    name: "Grilled Atlantic Salmon",
    description: "Pan-seared salmon fillet with herb butter, grilled asparagus, and lemon risotto",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    dietary: ["gluten-free"],
  },
  {
    id: "main-2",
    categoryId: "main-course",
    name: "Prime Ribeye Steak",
    description: "28-day aged 16oz ribeye with roasted garlic compound butter, truffle fries, and seasonal vegetables",
    price: 48.99,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80",
    dietary: ["gluten-free"],
  },
  {
    id: "main-3",
    categoryId: "main-course",
    name: "Wild Mushroom Risotto",
    description: "Creamy arborio rice with porcini, chanterelle, and shiitake mushrooms, finished with aged parmesan",
    price: 26.99,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "main-4",
    categoryId: "main-course",
    name: "Lobster Thermidor",
    description: "Whole Maine lobster in cognac cream sauce with gruyère, served with buttered asparagus",
    price: 58.99,
    image: "https://images.unsplash.com/photo-1553247407-23251ce81f59?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "main-5",
    categoryId: "main-course",
    name: "Herb-Crusted Rack of Lamb",
    description: "New Zealand lamb with rosemary-dijon crust, mint pesto, and potato gratin",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "main-6",
    categoryId: "main-course",
    name: "Pan-Roasted Duck Breast",
    description: "Crispy skin duck with cherry gastrique, sweet potato purée, and baby kale",
    price: 38.99,
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&auto=format&fit=crop&q=80",
    dietary: ["gluten-free"],
  },

  // Desserts
  {
    id: "dessert-1",
    categoryId: "desserts",
    name: "Chocolate Lava Cake",
    description: "Warm dark chocolate cake with molten center, vanilla bean ice cream, and raspberry coulis",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "dessert-2",
    categoryId: "desserts",
    name: "Crème Brûlée",
    description: "Classic vanilla custard with caramelized sugar crust and fresh berries",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "dessert-3",
    categoryId: "desserts",
    name: "Tiramisu",
    description: "Layers of espresso-soaked ladyfingers with mascarpone cream and cocoa dusting",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "dessert-4",
    categoryId: "desserts",
    name: "New York Cheesecake",
    description: "Dense, creamy cheesecake with graham cracker crust and seasonal fruit compote",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "dessert-5",
    categoryId: "desserts",
    name: "Affogato",
    description: "Double espresso poured over house-made vanilla gelato with amaretti biscotti",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },

  // Drinks
  {
    id: "drink-1",
    categoryId: "drinks",
    name: "Classic Negroni",
    description: "Gin, Campari, and sweet vermouth stirred to perfection with an orange twist",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegan"],
  },
  {
    id: "drink-2",
    categoryId: "drinks",
    name: "Signature Old Fashioned",
    description: "Premium bourbon with house-made orange bitters, demerara sugar, and cherry",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegan"],
  },
  {
    id: "drink-3",
    categoryId: "drinks",
    name: "Reserve Red Wine",
    description: "Chef's selection of premium Cabernet Sauvignon from Napa Valley",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegan"],
  },
  {
    id: "drink-4",
    categoryId: "drinks",
    name: "Champagne Flute",
    description: "Veuve Clicquot Yellow Label - perfect for celebrations",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegan"],
  },
  {
    id: "drink-5",
    categoryId: "drinks",
    name: "Craft Espresso Martini",
    description: "Fresh espresso, vodka, Kahlúa, and vanilla bean simple syrup",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1545438102-799c3991ffb2?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegan"],
  },

  // Chef's Special
  {
    id: "special-1",
    categoryId: "chefs-special",
    name: "Wagyu Beef Tataki",
    description: "A5 Japanese Wagyu lightly seared, with truffle ponzu, microgreens, and gold leaf",
    price: 68.99,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80",
    dietary: ["gluten-free"],
  },
  {
    id: "special-2",
    categoryId: "chefs-special",
    name: "Truffle Tasting Experience",
    description: "Five-course truffle journey featuring black and white truffles from Alba, Italy",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1518740144021-a0f0c1f0f4ff?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "special-3",
    categoryId: "chefs-special",
    name: "Omakase Sashimi Platter",
    description: "Chef's selection of the finest seasonal fish, flown in daily from Tsukiji Market",
    price: 75.99,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    dietary: ["gluten-free"],
  },
  {
    id: "special-4",
    categoryId: "chefs-special",
    name: "Tasting Menu for Two",
    description: "Seven-course seasonal tasting menu with wine pairings - a complete culinary journey",
    price: 195.99,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
  },

  // Sides
  {
    id: "side-1",
    categoryId: "sides",
    name: "Truffle Parmesan Fries",
    description: "Hand-cut fries with truffle oil, aged parmesan, and fresh herbs",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
  {
    id: "side-2",
    categoryId: "sides",
    name: "Roasted Garlic Mashed Potatoes",
    description: "Creamy Yukon gold potatoes with roasted garlic and chive butter",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "side-3",
    categoryId: "sides",
    name: "Grilled Asparagus",
    description: "Tender asparagus with lemon zest, olive oil, and shaved parmesan",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "side-4",
    categoryId: "sides",
    name: "Sautéed Wild Mushrooms",
    description: "Forest mushrooms with garlic, thyme, and a splash of white wine",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian", "vegan", "gluten-free"],
  },
  {
    id: "side-5",
    categoryId: "sides",
    name: "Caesar Salad",
    description: "Crisp romaine with house-made Caesar dressing, croutons, and parmesan shavings",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80",
    dietary: ["vegetarian"],
  },
];

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.categoryId === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

export function getMenuItemById(itemId: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === itemId);
}
