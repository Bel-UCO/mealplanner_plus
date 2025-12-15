// util/filterHooks.js
import { createContext, useCallback, useContext, useState } from "react";

const FilterSavedRecipeContext = createContext(null);

export function FilterRecipeSavedProvider({ children }) {
  const [filterRecipeSaved, setFilterRecipeSaved] = useState({
    difficulties: [], // number[]
    ingredients: [], // string[]
    ingredient_categories: [], // string[]
    utensils: [], // string[]
    diet: "", // "vegan" | "vegetarian" | ""
    time: 30, // minutes
    type: "Breakfast",
  });

  const saveFilterRecipeSaved = useCallback((newFilterRecipeSaved) => {
    if (!newFilterRecipeSaved) return;
    setFilterRecipeSaved(newFilterRecipeSaved); // updates everyone using the context
  }, []);

  const value = { filterRecipeSaved, saveFilterRecipeSaved };

  return (
    <FilterSavedRecipeContext.Provider value={value}>
      {children}
    </FilterSavedRecipeContext.Provider>
  );
}

// 🔹 default export = hook (so your old imports still work)
export default function useFilterRecipeSaved() {
  const ctx = useContext(FilterSavedRecipeContext);
  if (!ctx) {
    throw new Error(
      "useFilterRecipeSaved must be used inside a <FilterRecipeSavedProvider />"
    );
  }
  return ctx;
}
