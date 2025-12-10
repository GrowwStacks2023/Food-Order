import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Category, MenuItem, Recommendation } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { 
    addItem, 
    items,
    setRecommendations, 
    setIsRecommendationsOpen, 
    setIsLoadingRecommendations,
    setLastAddedItem,
  } = useCart();
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading: menuItemsLoading, error: menuItemsError, refetch: refetchMenuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items", selectedCategory],
    enabled: !!selectedCategory,
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToMenu = () => {
    setSelectedCategory(null);
  };

  const fetchRecommendations = async (item: MenuItem) => {
    setIsLoadingRecommendations(true);
    setIsRecommendationsOpen(true);
    setLastAddedItem(item);
    
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_item_id: item.id,
          item_name: item.name,
          item_price: item.price,
          category: item.categoryId,
          current_cart_items: items.map((cartItem) => ({
            id: cartItem.menuItem.id,
            name: cartItem.menuItem.name,
            price: cartItem.menuItem.price,
          })),
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const data: Recommendation[] = await response.json();
        setRecommendations(data);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
    fetchRecommendations(item);
  };

  const category = selectedCategory 
    ? categories.find((cat) => cat.id === selectedCategory) 
    : null;

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="text-destructive text-lg">Failed to load menu</p>
          <p className="text-muted-foreground">Please try again</p>
          <Button onClick={() => refetchCategories()} data-testid="button-retry-categories">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {selectedCategory && category ? (
          <>
            <div className="mb-6 sm:mb-8">
              <Button
                variant="ghost"
                onClick={handleBackToMenu}
                className="mb-4"
                data-testid="button-back-to-menu"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <div className="flex items-end gap-4">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  {category.name}
                </h2>
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {category.description}
              </p>
            </div>

            {menuItemsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : menuItemsError ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <p className="text-destructive">Failed to load items</p>
                <Button onClick={() => refetchMenuItems()} data-testid="button-retry-items">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Our Menu
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Discover our carefully curated selection of dishes, crafted with the finest ingredients
                and prepared with passion by our world-class culinary team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category.id)}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
