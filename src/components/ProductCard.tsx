
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OpenFoodFactsProduct } from '@/hooks/useOpenFoodFacts';
import NutritionBadge from './NutritionBadge';

interface ProductCardProps {
  product: OpenFoodFactsProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden h-full card-hover animate-fade-in">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-2 right-2">
            <NutritionBadge grade={product.nutritionGrade} />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          
          {product.ingredients && product.ingredients.length > 0 && (
            <p className="text-xs text-gray-600 line-clamp-2">
              <span className="font-medium">Ingredients: </span>
              {product.ingredients.slice(0, 3).join(', ')}
              {product.ingredients.length > 3 && '...'}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between">
          <div className="flex gap-1">
            {product.dietaryLabels.slice(0, 2).map((label, index) => (
              <span key={index} className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                {label}
              </span>
            ))}
            {product.dietaryLabels.length > 2 && (
              <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                +{product.dietaryLabels.length - 2}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
