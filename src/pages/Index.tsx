import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import Header from '@/components/Header';
import { toast } from '@/components/ui/use-toast';
import { useOpenFoodFactsProducts, fetchOpenFoodFactsByBarcode, OpenFoodFactsProduct } from '@/hooks/useOpenFoodFacts';

const CATEGORIES = [
  "All Categories",
  "Snacks",
  "Beverages",
  "Dairy",
  "Cereals",
  "Fruits",
  "Vegetables",
  "Meat",
  "Fish",
  "Bread",
  "Desserts"
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'nutrition-asc', label: 'Nutrition Grade (Best First)' },
  { value: 'nutrition-desc', label: 'Nutrition Grade (Worst First)' }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortOption, setSortOption] = useState('name-asc');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState<OpenFoodFactsProduct[] | null>(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useOpenFoodFactsProducts({
    searchQuery: debouncedSearch,
    category
  });

  const sortProducts = (products: OpenFoodFactsProduct[], sort: string) => {
    return [...products].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'nutrition-asc':
          return a.nutritionGrade.localeCompare(b.nutritionGrade);
        case 'nutrition-desc':
          return b.nutritionGrade.localeCompare(a.nutritionGrade);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    if (!loadingBarcode && Array.isArray(data)) {
      const sortedProducts = sortProducts(data, sortOption);
      setProducts(sortedProducts);
      
      if (sortedProducts.length === 0 && !isLoading && debouncedSearch) {
        toast({
          title: "No products found",
          description: "Try adjusting your search or filters",
        });
      }
    }
  }, [data, sortOption, loadingBarcode, debouncedSearch, isLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBarcodeSearch = async (barcode: string) => {
    setLoadingBarcode(true);
    try {
      const product = await fetchOpenFoodFactsByBarcode(barcode);
      if (product) {
        setSearchQuery('');
        setCategory('All Categories');
        setProducts([product]);
        toast({
          title: "Product found",
          description: `Found: ${product.name}`,
        });
      } else {
        toast({
          title: "Product not found",
          description: `No product found with barcode: ${barcode}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Barcode search error:", error);
      toast({
        title: "Search error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingBarcode(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      <main className="flex-1">
        <div className="container py-8 px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center font-heading bg-gradient-primary bg-clip-text text-transparent animate-gradient">
            Food Product Explorer
          </h1>
          
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              onBarcodeSearch={handleBarcodeSearch} 
              initialValue={searchQuery}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <FiltersSidebar 
              categories={CATEGORIES}
              sortOptions={SORT_OPTIONS}
              onCategoryChange={setCategory} 
              onSortChange={setSortOption}
              selectedCategory={category}
              selectedSort={sortOption}
            />

            <div className="flex-1">
              {(isLoading || loadingBarcode) && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-b-4"></div>
                  <span className="mt-4 text-muted-foreground font-mono">Loading products...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="text-destructive mb-4 font-heading">Failed to load products</div>
                  <div className="text-sm text-muted-foreground font-mono">{error instanceof Error ? error.message : 'Unknown error'}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !loadingBarcode && !error && products && products.length === 0 && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium mb-2 font-heading">No products found</h2>
                  <p className="text-muted-foreground font-mono">Try adjusting your search or filters</p>
                </div>
              )}

              {products && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
