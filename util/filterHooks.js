import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import api, { API_BASE_URL } from "./api";

const RECIPE_KEY = "filter_recipe";

const FilterRecipeContext = createContext(null);

export function FilterRecipeProvider({ children }) {
  const [filterRecipe, setFilterRecipe] = useState(
    JSON.stringify({
      difficulties: [], // number[]
      ingredients: [], // object[]
      ingredient_categories: [], // string[]
      utensils: [], // number[]
      diet: "", // "vegan" | "vegetarian" | ""
      time: 30, // minutes
      search_by: "explore",
    })
  );

  const [triggerFilterRecipeChange, setTriggerFilterRecipeChange] = useState(
    new Boolean(false)
  );

  const fetchUserPreference = async () => {
    try {
      const res = await api.get(`${API_BASE_URL}/preferences`);
      const pref = res?.data;

      if (!pref) return;

      const parseCsv = (val, mapFn = (x) => x) => {
        if (!val || typeof val !== "string") return [];
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map(mapFn);
      };

      // ingredient stored as JSON string -> parse to array of objects
      let ingredients = [];
      if (typeof pref.ingredient === "string" && pref.ingredient.trim() !== "") {
        try {
          const parsed = JSON.parse(pref.ingredient);
          ingredients = Array.isArray(parsed) ? parsed : [];
        } catch {
          ingredients = [];
        }
      }

      const converted = {
        difficulties: parseCsv(pref.difficulty, (x) => Number(x)).filter(
          (n) => !Number.isNaN(n)
        ),

        // keep ingredient objects exactly as backend
        ingredients,

        ingredient_categories: parseCsv(pref.category, (x) => x),

        // ✅ utensils should be number[]
        utensils: parseCsv(pref.utensil, (x) => Number(x)).filter(
          (n) => !Number.isNaN(n)
        ),

        diet: pref.diet ?? "",
        time: typeof pref.time === "number" ? pref.time : 30,
        search_by: pref.search_by ?? "explore",
      };

      const asString = JSON.stringify(converted);
      await SecureStore.setItemAsync(RECIPE_KEY, asString);
      setFilterRecipe(asString);

      console.log("Fetched & saved user preference:", converted);
    } catch (e) {
      console.log("Failed to fetch user preference:", e);
    }
  };

  const saveUserPreference = async (newFilterRecipe) => {
    await api.post(`${API_BASE_URL}/preferences`, newFilterRecipe);
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(RECIPE_KEY);
        fetchUserPreference();
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
    saveUserPreference(newFilterRecipe);
    setFilterRecipe(asString);
    setTriggerFilterRecipeChange(new Boolean(true));
  }, []);

  const value = { filterRecipe, saveFilterRecipe, triggerFilterRecipeChange,setTriggerFilterRecipeChange };

  return (
    <FilterRecipeContext.Provider value={value}>
      {children}
    </FilterRecipeContext.Provider>
  );
}

export default function useFilterRecipe() {
  const ctx = useContext(FilterRecipeContext);
  if (!ctx) {
    throw new Error(
      "useFilterRecipe must be used inside a <FilterRecipeProvider />"
    );
  }
  return ctx;
}
