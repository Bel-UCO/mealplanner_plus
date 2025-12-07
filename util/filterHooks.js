// util/filterHooks.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

const RECIPE_KEY = "filter_recipe";

const FilterRecipeContext = createContext(null);

export function FilterRecipeProvider({ children }) {
  const [filterRecipe, setFilterRecipe] = useState(
    JSON.stringify({
      difficulties: [], // number[]
      ingredients: [], // string[]
      ingredient_categories: [], // string[]
      utensils: [], // string[]
      diet: "", // "vegan" | "vegetarian" | ""
      time: 30, // minutes
      type: "Breakfast",
    })
  );

  // load from SecureStore once
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(RECIPE_KEY);
        if (stored) {
          setFilterRecipe(stored); // stored is already a JSON string
        }
      } catch (e) {
        console.log("Failed to load filter recipe:", e);
      }
    })();
  }, []);

  const saveFilterRecipe = useCallback(async (newFilterRecipe) => {
    if (!newFilterRecipe) return;
    const asString = JSON.stringify(newFilterRecipe);
    await SecureStore.setItemAsync(RECIPE_KEY, asString);
    setFilterRecipe(asString); // updates everyone using the context
  }, []);

  const value = { filterRecipe, saveFilterRecipe };

  return (
    <FilterRecipeContext.Provider value={value}>
      {children}
    </FilterRecipeContext.Provider>
  );
}

// 🔹 default export = hook (so your old imports still work)
export default function useFilterRecipe() {
  const ctx = useContext(FilterRecipeContext);
  if (!ctx) {
    throw new Error(
      "useFilterRecipe must be used inside a <FilterRecipeProvider />"
    );
  }
  return ctx;
}
