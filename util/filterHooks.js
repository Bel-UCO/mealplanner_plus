// util/filterHooks.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import api, { API_BASE_URL } from "./api";

const RECIPE_KEY = "filter_recipe";

const DEFAULT_FILTER = {
  difficulties: [], // number[] (ids)
  ingredients: [], // number[] (ids) - your backend normalizes ids
  ingredient_categories: [], // number[] (ids)
  utensils: [], // number[] (ids)
  diet: "", // "vegan" | "vegetarian" | ""
  time: 30,
  search_by: "explore",
};

const FilterRecipeContext = createContext(null);

function safeParse(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    if (!obj || typeof obj !== "object") return null;
    return obj;
  } catch {
    return null;
  }
}

function normalizeFromBackend(pref) {
  if (!pref) return null;

  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v.trim() !== "")
      return v
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    return [];
  };

  const difficulties = toArray(pref.difficulty)
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n));
  const ingredient_categories = toArray(pref.category)
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n));
  const ingredients = toArray(pref.ingredient)
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n));
  const utensils = toArray(pref.utensil)
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n));

  return {
    ...DEFAULT_FILTER,
    search_by: pref.search_by ?? DEFAULT_FILTER.search_by,
    time:
      typeof pref.time === "number"
        ? pref.time
        : Number(pref.time ?? DEFAULT_FILTER.time),
    diet: pref.diet ?? "",
    difficulties,
    ingredient_categories,
    ingredients,
    utensils,
  };
}

export function FilterRecipeProvider({ children }) {
  const [filterRecipe, setFilterRecipe] = useState(
    JSON.stringify(DEFAULT_FILTER)
  );
  const [triggerFilterRecipeChange, setTriggerFilterRecipeChange] =
    useState(false);

  // avoid double-sync loops
  const didInitRef = useRef(false);

  const fetchUserPreference = useCallback(async () => {
    try {
      const res = await api.get(`${API_BASE_URL}/preferences`);
      const pref = res?.data?.preferences ?? res?.data?.data ?? res?.data;

      return pref ?? null;
    } catch (e) {
      console.log("Failed to fetch preferences:", e?.response?.data || e);
      return null;
    }
  }, []);

  const saveUserPreference = useCallback(async (filterObj) => {
    try {
      const payload = {
        search_by: filterObj.search_by || "explore",
        time: filterObj.time ?? 30,
        diet: filterObj.diet || null,

        difficulty: filterObj.difficulties ?? [],
        category: filterObj.ingredient_categories ?? [],
        ingredient: filterObj.ingredients ?? [],
        utensil: filterObj.utensils ?? [],
      };

      await api.post(`${API_BASE_URL}/preferences`, payload);
    } catch (e) {
      console.log("Failed to save preferences:", e?.response?.data || e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (didInitRef.current) return;
      didInitRef.current = true;

      const backendPref = await fetchUserPreference();
      const normalized = normalizeFromBackend(backendPref);

      if (normalized) {
        const asString = JSON.stringify(normalized);
        setFilterRecipe(asString);
        await SecureStore.setItemAsync(RECIPE_KEY, asString);
        return;
      }

      try {
        const stored = await SecureStore.getItemAsync(RECIPE_KEY);
        const parsed = stored ? safeParse(stored) : null;

        if (parsed) {
          // merge with defaults so missing keys don’t crash UI
          const merged = { ...DEFAULT_FILTER, ...parsed };
          const asString = JSON.stringify(merged);
          setFilterRecipe(asString);
        } else {
          setFilterRecipe(JSON.stringify(DEFAULT_FILTER));
        }
      } catch (e) {
        console.log("Failed to load filter recipe:", e);
        setFilterRecipe(JSON.stringify(DEFAULT_FILTER));
      }
    })();
  }, [fetchUserPreference]);

  const saveFilterRecipe = useCallback(
    async (newFilterRecipe) => {
      if (!newFilterRecipe) return;

      const merged = { ...DEFAULT_FILTER, ...newFilterRecipe };
      const asString = JSON.stringify(merged);

      await SecureStore.setItemAsync(RECIPE_KEY, asString);
      setFilterRecipe(asString);
      setTriggerFilterRecipeChange(true);

      // ALSO save to backend each time
      await saveUserPreference(merged);
    },
    [saveUserPreference]
  );

  const value = { filterRecipe, saveFilterRecipe, triggerFilterRecipeChange };

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
