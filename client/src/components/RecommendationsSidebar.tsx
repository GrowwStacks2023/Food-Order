import { X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";
import { getMenuItemById } from "@/lib/menu-data";

export function RecommendationsSidebar() {
  const {
    recommendations,
    isRecommendationsOpen,
    setIsRecommendationsOpen,
    isLoadingRecommendations,
    addItem,
    lastAddedItem,
  } = useCart();
  const { toast } = useToast();

  const handleAddRecommendation = (rec: typeof recommendations[0]) => {
    const menuItem = getMenuItemById(rec.id);
    if (menuItem) {
      addItem(menuItem);
      toast({
        title: "Added to cart",
        description: `${rec.name} has been added to your cart.`,
      });
    } else {
      const newItem: MenuItem = {
        id: rec.id,
        categoryId: "recommendation",
        name: rec.name,
        description: rec.description,
        price: rec.price,
        image: rec.image,
      };
      addItem(newItem);
      toast({
        title: "Added to cart",
        description: `${rec.name} has been added to your cart.`,
      });
    }
  };

  if (!isRecommendationsOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={() => setIsRecommendationsOpen(false)}
        data-testid="overlay-recommendations"
      />
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background border-l border-border z-50 animate-slide-in-right flex flex-col"
        data-testid="sidebar-recommendations"
      >
        <div className="flex items-center justify-between gap-4 p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold">For You</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRecommendationsOpen(false)}
            data-testid="button-close-recommendations"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isLoadingRecommendations ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-center">
              Finding perfect pairings for {lastAddedItem?.name}...
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">No recommendations yet</h3>
            <p className="text-muted-foreground text-sm">
              Add items to your cart to get personalized suggestions
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-4 sm:p-6">
            <div className="space-y-4">
              {lastAddedItem && (
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your selection of <span className="font-medium text-foreground">{lastAddedItem.name}</span>
                </p>
              )}
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="overflow-visible"
                  data-testid={`card-recommendation-${rec.id}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-md">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className="absolute top-3 left-3 bg-accent text-accent-foreground"
                    >
                      {rec.reason}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-serif text-lg font-semibold">
                        {rec.name}
                      </h4>
                      <span className="font-semibold text-lg whitespace-nowrap">
                        ${rec.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddRecommendation(rec)}
                        data-testid={`button-add-recommendation-${rec.id}`}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRecommendationsOpen(false);
                        }}
                        data-testid={`button-dismiss-${rec.id}`}
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
