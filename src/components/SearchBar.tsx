import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onBarcodeSearch: (barcode: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, onBarcodeSearch, initialValue = '' }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleBarcodeClick = () => {
    setIsOpen(true);
  };

  const handleBarcodeSearch = () => {
    if (barcodeInput) {
      onBarcodeSearch(barcodeInput);
      setBarcodeInput('');
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 py-6 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary transition-all duration-300 hover:border-primary/50"
          />
        </div>
        <Button 
          type="submit" 
          className="px-6 bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Search
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="px-3 bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              aria-label="Search by barcode"
            >
              <Barcode className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-sm border-muted-foreground/20">
            <DialogHeader>
              <DialogTitle className="font-heading">Search by Barcode</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <Input
                type="text"
                placeholder="Enter barcode number..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="mb-4 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary transition-all duration-300"
              />
              <Button 
                onClick={handleBarcodeSearch} 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Search
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default SearchBar;
