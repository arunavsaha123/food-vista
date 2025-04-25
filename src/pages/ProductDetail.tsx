import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NutritionBadge from '@/components/NutritionBadge';
import NutritionalInfoCard from '@/components/NutritionalInfoCard';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { OpenFoodFactsProduct, fetchOpenFoodFactsByBarcode } from '@/hooks/useOpenFoodFacts';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const productData = await fetchOpenFoodFactsByBarcode(id);
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product);
    toast.success('Product added to cart!', {
      description: `${product.name} has been added to your cart.`,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-12 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Product not found'}</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
          </Button>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 md:h-96 object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-500 mb-4">{product.category}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="font-medium">Nutrition Grade:</div>
                    <NutritionBadge grade={product.nutritionGrade} size="lg" />
                  </div>
                  
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-2">Ingredients</h3>
                      <p className="text-sm">{product.ingredients.join(', ')}</p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Barcode</h3>
                    <p className="text-sm font-mono">{product.barcode}</p>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <NutritionalInfoCard product={product} />
              
              {product.dietaryLabels.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">Dietary Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.dietaryLabels.map((label, index) => (
                        <div 
                          key={index} 
                          className="bg-secondary px-3 py-1 rounded-full text-sm"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Button 
        className="fixed bottom-6 right-6 rounded-full shadow-lg" 
        size="icon"
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductDetail;
