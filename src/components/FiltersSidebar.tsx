import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FiltersProps {
  categories: string[];
  sortOptions: Array<{ value: string; label: string }>;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  selectedSort: string;
}

const FiltersSidebar = ({
  categories,
  sortOptions,
  onCategoryChange,
  onSortChange,
  selectedCategory,
  selectedSort
}: FiltersProps) => {
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempSort, setTempSort] = useState(selectedSort);
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onCategoryChange(tempCategory);
    onSortChange(tempSort);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Categories</h3>
                <RadioGroup value={tempCategory} onValueChange={setTempCategory}>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={`category-${category}`} />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sort By</h3>
                <Select value={tempSort} onValueChange={setTempSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <SheetFooter className="pt-4">
              <Button onClick={handleApplyFilters} className="w-full">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r pr-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Categories</h3>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange} className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2 group">
                <RadioGroupItem 
                  value={category} 
                  id={category}
                  className="border-muted-foreground/20 group-hover:border-primary transition-colors duration-300"
                />
                <Label 
                  htmlFor={category}
                  className="text-muted-foreground group-hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Sort By</h3>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary transition-all duration-300">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-sm border-muted-foreground/20">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="focus:bg-primary/10 focus:text-primary transition-colors duration-300"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default FiltersSidebar;
