import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </CartProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
