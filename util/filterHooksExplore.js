// util/filterHooks.js
import { createContext, useCallback, useContext, useState } from "react";

const FilterExploreRecipeContext = createContext(null);

// Component for filter explore recipe storage and retrieval
export function FilterRecipeExploreProvider({ children }) {
  const [filterRecipeExplore, setFilterRecipeExplore] = useState({
    difficulties: [], // number[]
    ingredients: [], // string[]
    ingredient_categories: [], // string[]
    utensils: [], // string[]
    diet: "", // "vegan" | "vegetarian" | ""
    time: 30, // minutes
    type: [],
  });

  const saveFilterRecipeExplore = useCallback(
    (newFilterRecipeExplore) => {
      if (!newFilterRecipeExplore) return;
      setFilterRecipeExplore(newFilterRecipeExplore); // updates everyone using the context
    },
    []
  );

  const value = { filterRecipeExplore, saveFilterRecipeExplore };

  return (
    <FilterExploreRecipeContext.Provider value={value}>
      {children}
    </FilterExploreRecipeContext.Provider>
  );
}

// default export component for filter explore recipe
export default function useFilterRecipeExplore() {
  const ctx = useContext(FilterExploreRecipeContext);
  if (!ctx) {
    throw new Error(
      "useFilterRecipeExplore must be used inside a <FilterRecipeExploreProvider />"
    );
  }
  return ctx;
}
