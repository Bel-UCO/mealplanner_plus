// util/filterHooks.js
import { createContext, useCallback, useContext, useState } from "react";

const FilterSavedRecipeContext = createContext(null);

// Component for filter saved recipe storage and retrieval
export function FilterRecipeSavedProvider({ children }) {
  const [filterRecipeSaved, setFilterRecipeSaved] = useState({
    difficulties: [], // number[]
    ingredients: [], // number[]
    ingredient_categories: [], // number[]
    utensils: [], // number[]
    diet: "", // "vegan" | "vegetarian" | ""
    time: 30, // minutes
    type: [],
  });

  const saveFilterRecipeSaved = useCallback((newFilterRecipeSaved) => {
    if (!newFilterRecipeSaved) return;

    const normalized = {
      ...newFilterRecipeSaved,
      ingredient_categories: Array.isArray(newFilterRecipeSaved.ingredient_categories)
        ? newFilterRecipeSaved.ingredient_categories
            .map((x) => Number(x))
            .filter((n) => !Number.isNaN(n))
        : [],
    };

    setFilterRecipeSaved(normalized); // updates everyone using the context
  }, []);

  const value = { filterRecipeSaved, saveFilterRecipeSaved };

  return (
    <FilterSavedRecipeContext.Provider value={value}>
      {children}
    </FilterSavedRecipeContext.Provider>
  );
}

// default export component for filter saved recipe
export default function useFilterRecipeSaved() {
  const ctx = useContext(FilterSavedRecipeContext);
  if (!ctx) {
    throw new Error(
      "useFilterRecipeSaved must be used inside a <FilterRecipeSavedProvider />"
    );
  }
  return ctx;
}
