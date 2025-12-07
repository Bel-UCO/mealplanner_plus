// src/hooks/useToken.js
import { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const RECIPE_KEY = "filter_recipe";

export default function useFilterRecipe() {
  const [filterRecipe, setFilterRecipe] = useState(JSON.stringify({
    difficulties: [], // number[]
    ingredients: [], // string[]
    ingredient_categories: [], // string[]
    utensils: [], // string[]
    diet: "", // "vegan" | "vegetarian" | ""
    time: 30, // minutes
    type: "Breakfast"
  }));

  // Load token on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(RECIPE_KEY);
        if (stored) {
          setFilterRecipe(stored);
        }
      } finally {

      }
    })();
  }, []);

  // Save token
  const saveFilterRecipe = useCallback(async (newFilterRecipe) => {
    if (!newFilterRecipe) return;
    await SecureStore.setItemAsync(RECIPE_KEY, newFilterRecipe);
    setFilterRecipe(newFilterRecipe);
  }, []);

  return { filterRecipe, saveFilterRecipe };
}
