import { ShoppingBag, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useTheme } from "@/context/theme-context";

export function Header() {
  const { getItemCount, setIsCartOpen, cartBounce } = useCart();
  const { theme, toggleTheme } = useTheme();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          <div className="flex flex-col">
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              La Maison Dorée
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Fine Dining Experience
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 ${
                    cartBounce ? "animate-bounce-once" : ""
                  }`}
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
