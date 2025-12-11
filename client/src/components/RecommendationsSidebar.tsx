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

  const handleAddRecommendation = (rec: (typeof recommendations)[0]) => {
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
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={() => setIsRecommendationsOpen(false)}
        data-testid="overlay-recommendations"
      />
      
      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50 animate-slide-in-right flex flex-col shadow-2xl"
        data-testid="sidebar-recommendations"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">For You</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRecommendationsOpen(false)}
            className="rounded-full"
            data-testid="button-close-recommendations"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        {isLoadingRecommendations ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              Finding perfect pairings for{" "}
              <span className="font-medium text-foreground">{lastAddedItem?.name}</span>
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Add items to your cart to get personalized suggestions
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Context Banner */}
              {lastAddedItem && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Perfect pairings for{" "}
                    <span className="font-semibold text-foreground">
                      {lastAddedItem.name}
                    </span>
                  </p>
                </div>
              )}

              {/* Recommendations List */}
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Card
                    key={rec.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                    data-testid={`card-recommendation-${rec.id}`}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={rec.image}
                          alt={rec.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-1 right-1 text-xs px-2 py-0.5">
                          {rec.reason}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                            {rec.name}
                          </h4>
                          <span className="font-bold text-sm text-primary whitespace-nowrap">
                            ${rec.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {rec.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleAddRecommendation(rec)}
                            data-testid={`button-add-recommendation-${rec.id}`}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={() => setIsRecommendationsOpen(false)}
                            data-testid={`button-dismiss-${rec.id}`}
                          >
                            Later
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
}