import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuItem } from "@shared/schema";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  index: number;
}

export function ProductCard({ item, onAddToCart, index }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { items } = useCart();
  const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`;
  
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Card
      className={`overflow-visible opacity-0 animate-fade-in-up ${staggerClass}`}
      data-testid={`card-product-${item.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-md">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-6 h-6 flex items-center justify-center px-2">
            {quantityInCart}
          </div>
        )}
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground leading-tight">
            {item.name}
          </h3>
          <span className="font-semibold text-lg text-foreground whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        {item.dietary && item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietary.map((diet) => (
              <Badge
                key={diet}
                variant="secondary"
                className="text-xs capitalize"
              >
                {diet}
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={isAdded}
          data-testid={`button-add-to-cart-${item.id}`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
