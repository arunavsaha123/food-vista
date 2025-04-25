import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          FoodVista
        </Link>
        
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
