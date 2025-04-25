import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OpenFoodFactsProduct } from '@/hooks/useOpenFoodFacts';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NutritionalInfoCardProps {
  product: OpenFoodFactsProduct;
}

const NutritionalInfoCard = ({ product }: NutritionalInfoCardProps) => {
  const { nutritionalValues } = product;
  
  // Daily reference intake values (in grams)
  const dailyReference = {
    // Energy
    calories: 2000,
    energyKj: 8400,
    // Macronutrients
    fat: 70,
    saturatedFat: 20,
    carbs: 260,
    sugars: 90,
    protein: 50,
    fiber: 30,
    // Micronutrients
    salt: 6,
    sodium: 2.4,
    // Vitamins
    vitaminA: 0.9,
    vitaminC: 90,
    vitaminD: 0.015,
    vitaminE: 15,
    vitaminK: 0.12,
    // Minerals
    calcium: 1000,
    iron: 14,
    magnesium: 400,
    phosphorus: 700,
    potassium: 3500,
    zinc: 11,
  };
  
  // Calculate percentage of daily value
  const calculatePercentage = (value: number, nutrient: string) => {
    const refValue = dailyReference[nutrient as keyof typeof dailyReference] || 0;
    if (!refValue) return 0;
    return Math.min(100, Math.round((value / refValue) * 100));
  };
  
  // Format values with appropriate units
  const formatValue = (value: number, nutrient: string) => {
    if (nutrient === 'calories') return `${value} kcal`;
    if (nutrient === 'energyKj') return `${value} kJ`;
    if (nutrient === 'sodium') return `${value}g`;
    if (nutrient === 'vitaminA' || nutrient === 'vitaminD' || nutrient === 'vitaminK') return `${value}mg`;
    if (nutrient === 'vitaminC' || nutrient === 'vitaminE') return `${value}mg`;
    if (nutrient === 'calcium' || nutrient === 'iron' || nutrient === 'magnesium' || 
        nutrient === 'phosphorus' || nutrient === 'potassium' || nutrient === 'zinc') return `${value}mg`;
    return `${value}g`;
  };
  
  // Get color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const renderNutritionalSection = (section: {
    title: string;
    nutrients: Array<{ key: keyof typeof nutritionalValues; label: string }>;
  }) => (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{section.title}</h3>
      {section.nutrients.map(({ key, label }) => {
        const value = nutritionalValues[key];
        const percentage = calculatePercentage(value, key);
        
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{label}</span>
              <span>{formatValue(value, key)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress 
                value={percentage} 
                className={`h-2 ${getProgressColor(percentage)}`}
              />
              <span className="text-xs text-muted-foreground">{percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Nutritional Information
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="macronutrients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="macronutrients">Macronutrients</TabsTrigger>
            <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
            <TabsTrigger value="minerals">Minerals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="macronutrients" className="space-y-6">
            {renderNutritionalSection({
              title: "Energy",
              nutrients: [
                { key: "calories", label: "Calories" },
                { key: "energyKj", label: "Energy (kJ)" }
              ]
            })}
            {renderNutritionalSection({
              title: "Macronutrients",
              nutrients: [
                { key: "fat", label: "Total Fat" },
                { key: "saturatedFat", label: "Saturated Fat" },
                { key: "carbs", label: "Carbohydrates" },
                { key: "sugars", label: "Sugars" },
                { key: "protein", label: "Protein" },
                { key: "fiber", label: "Dietary Fiber" }
              ]
            })}
          </TabsContent>
          
          <TabsContent value="vitamins" className="space-y-6">
            {renderNutritionalSection({
              title: "Vitamins",
              nutrients: [
                { key: "vitaminA", label: "Vitamin A" },
                { key: "vitaminC", label: "Vitamin C" },
                { key: "vitaminD", label: "Vitamin D" },
                { key: "vitaminE", label: "Vitamin E" },
                { key: "vitaminK", label: "Vitamin K" }
              ]
            })}
          </TabsContent>
          
          <TabsContent value="minerals" className="space-y-6">
            {renderNutritionalSection({
              title: "Minerals",
              nutrients: [
                { key: "calcium", label: "Calcium" },
                { key: "iron", label: "Iron" },
                { key: "magnesium", label: "Magnesium" },
                { key: "phosphorus", label: "Phosphorus" },
                { key: "potassium", label: "Potassium" },
                { key: "zinc", label: "Zinc" }
              ]
            })}
            {renderNutritionalSection({
              title: "Sodium",
              nutrients: [
                { key: "salt", label: "Salt" },
                { key: "sodium", label: "Sodium" }
              ]
            })}
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p>Percent Daily Values are based on a 2,000 calorie diet.</p>
          <p>Your daily values may be higher or lower depending on your calorie needs.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionalInfoCard;
