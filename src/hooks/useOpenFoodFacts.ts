import { useQuery } from "@tanstack/react-query";

export interface OpenFoodFactsProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  nutritionGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  barcode: string;
  ingredients?: string[];
  dietaryLabels: string[];
  nutritionalValues: {
    // Energy
    calories: number;
    energyKj: number;
    // Macronutrients
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    protein: number;
    fiber: number;
    // Micronutrients
    salt: number;
    sodium: number;
    // Vitamins
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    // Minerals
    calcium: number;
    iron: number;
    magnesium: number;
    phosphorus: number;
    potassium: number;
    zinc: number;
  };
}

interface RawOpenFoodFactsProduct {
  _id: string;
  product_name: string;
  image_front_url?: string;
  categories_tags?: string[];
  nutrition_grades?: string;
  code: string;
  ingredients?: Array<{ text: string }>;
  labels_tags?: string[];
  ingredients_analysis_tags?: string[];
  nutriments?: {
    // Energy
    "energy-kcal_100g"?: number | string;
    "energy-kj_100g"?: number | string;
    // Macronutrients
    "fat_100g"?: number | string;
    "saturated-fat_100g"?: number | string;
    "carbohydrates_100g"?: number | string;
    "sugars_100g"?: number | string;
    "proteins_100g"?: number | string;
    "fiber_100g"?: number | string;
    // Micronutrients
    "salt_100g"?: number | string;
    "sodium_100g"?: number | string;
    // Vitamins
    "vitamin-a_100g"?: number | string;
    "vitamin-c_100g"?: number | string;
    "vitamin-d_100g"?: number | string;
    "vitamin-e_100g"?: number | string;
    "vitamin-k_100g"?: number | string;
    // Minerals
    "calcium_100g"?: number | string;
    "iron_100g"?: number | string;
    "magnesium_100g"?: number | string;
    "phosphorus_100g"?: number | string;
    "potassium_100g"?: number | string;
    "zinc_100g"?: number | string;
  };
}

// Direct API URL since we're using a proxy
const OFF_BASE_URL = "https://world.openfoodfacts.org";
const OFF_SEARCH_URL = `${OFF_BASE_URL}/cgi/search.pl`;

const safeNumber = (value: number | string | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const parseProduct = (p: RawOpenFoodFactsProduct): OpenFoodFactsProduct | null => {
  try {
    if (!p.product_name || !p._id || !p.code) {
      console.warn("Missing required fields in product data:", { id: p._id, name: p.product_name });
      return null;
    }

    return {
      id: p._id,
      name: p.product_name,
      image: p.image_front_url || "/placeholder.svg",
      category: p.categories_tags && p.categories_tags.length
        ? p.categories_tags[0].replace("en:", "").replace(/-/g, " ")
        : "Unknown",
      nutritionGrade: ((p.nutrition_grades || "e").toUpperCase() as OpenFoodFactsProduct["nutritionGrade"]),
      barcode: p.code,
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.map(i => i.text).filter(Boolean) : [],
      dietaryLabels: [
        ...(p.labels_tags || []).map(t => t.replace("en:", "")),
        ...(p.ingredients_analysis_tags || []).map(t => t.replace("en:", "")),
      ]
        .filter((l): l is string => Boolean(l))
        .filter((l, i, arr) => arr.indexOf(l) === i)
        .slice(0, 4),
      nutritionalValues: {
        // Energy
        calories: safeNumber(p.nutriments?.["energy-kcal_100g"]),
        energyKj: safeNumber(p.nutriments?.["energy-kj_100g"]),
        // Macronutrients
        fat: safeNumber(p.nutriments?.fat_100g),
        saturatedFat: safeNumber(p.nutriments?.["saturated-fat_100g"]),
        carbs: safeNumber(p.nutriments?.carbohydrates_100g),
        sugars: safeNumber(p.nutriments?.sugars_100g),
        protein: safeNumber(p.nutriments?.proteins_100g),
        fiber: safeNumber(p.nutriments?.fiber_100g),
        // Micronutrients
        salt: safeNumber(p.nutriments?.salt_100g),
        sodium: safeNumber(p.nutriments?.sodium_100g),
        // Vitamins
        vitaminA: safeNumber(p.nutriments?.["vitamin-a_100g"]),
        vitaminC: safeNumber(p.nutriments?.["vitamin-c_100g"]),
        vitaminD: safeNumber(p.nutriments?.["vitamin-d_100g"]),
        vitaminE: safeNumber(p.nutriments?.["vitamin-e_100g"]),
        vitaminK: safeNumber(p.nutriments?.["vitamin-k_100g"]),
        // Minerals
        calcium: safeNumber(p.nutriments?.calcium_100g),
        iron: safeNumber(p.nutriments?.iron_100g),
        magnesium: safeNumber(p.nutriments?.magnesium_100g),
        phosphorus: safeNumber(p.nutriments?.phosphorus_100g),
        potassium: safeNumber(p.nutriments?.potassium_100g),
        zinc: safeNumber(p.nutriments?.zinc_100g),
      }
    };
  } catch (error) {
    console.error("Error parsing product data:", error, p);
    return null;
  }
};

export const useOpenFoodFactsProducts = (params: {
  searchQuery?: string;
  category?: string;
}) => {
  const { searchQuery = "", category = "" } = params;

  return useQuery({
    queryKey: ["openfoodfacts-products", searchQuery, category],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams({
          action: 'process',
          json: '1',
          page_size: '24',
          search_simple: '1',
          search_terms: searchQuery,
          ...(category && category !== "All Categories" ? {
            tagtype_0: 'categories',
            tag_contains_0: 'contains',
            tag_0: category,
          } : {})
        });

        const url = `${OFF_SEARCH_URL}?${searchParams.toString()}`;
        console.log("Fetching from URL:", url);
        
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'FoodVista - React App - Version 1.0 - For Educational Purposes'
          }
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch products: HTTP ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (!data.products || !Array.isArray(data.products)) {
          throw new Error("Invalid API response: missing or invalid products array");
        }
        
        const parsedProducts = (data.products as RawOpenFoodFactsProduct[])
          .map(product => parseProduct(product))
          .filter((product): product is OpenFoodFactsProduct => product !== null);
        
        return parsedProducts;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

export const fetchOpenFoodFactsByBarcode = async (barcode: string): Promise<OpenFoodFactsProduct | null> => {
  try {
    const url = `${OFF_BASE_URL}/api/v2/product/${barcode}.json`;
    console.log("Fetching barcode data from:", url);
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FoodVista - React App - Version 1.0 - For Educational Purposes'
      }
    });
    
    if (!res.ok) {
      console.warn(`Barcode fetch failed with status: ${res.status}`);
      return null;
    }
    
    const result = await res.json();
    
    if (!result.product) {
      console.warn("No product in barcode API response");
      return null;
    }
    
    return parseProduct(result.product);
  } catch (error) {
    console.error("Error in barcode fetch:", error);
    return null;
  }
};
