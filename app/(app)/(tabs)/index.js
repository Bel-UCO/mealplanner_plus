import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useRef, useState } from "react";
import api, { API_BASE_URL } from "../../../util/api";
import Menu from "../../../component/menu";
import {
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import useFilterRecipe from "../../../util/filterHooks";
import * as SecureStore from "expo-secure-store";

const RECIPE_KEY = "LOCKED_RECIPES";

// Cache the last fetched (daily) recipes so we reuse them within the same day
const CACHED_RECIPES_KEY = "CACHED_DAILY_RECIPES";
const CACHED_DATE_KEY = "CACHED_DAILY_RECIPES_DATE";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Drink"];

// current date to check cache validity
const getTodayKey = () => {
  // Local date as YYYY-MM-DD
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// randomizer home screen
export default function Home() {
  const [data, setData] = useState([]);
  const {
    triggerFilterRecipeChange,
    filterRecipe,
    setTriggerFilterRecipeChange,
  } = useFilterRecipe();
  const router = useRouter();

  const didBootstrap = useRef(false);

  // if new day auto refresh. if same day use cached recipes.
  useEffect(() => {
    const bootstrap = async () => {
      const today = getTodayKey();
      const savedDate = await SecureStore.getItemAsync(CACHED_DATE_KEY);

      // New day (or never saved) = trigger auto refresh
      if (!savedDate || savedDate !== today) {
        didBootstrap.current = true;
        setTriggerFilterRecipeChange(new Boolean(true));
        return;
      }

      // Same day = try use cached recipes
      const cached = await SecureStore.getItemAsync(CACHED_RECIPES_KEY);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);

          // Ensure lock state is correct based on LOCKED_RECIPES store
          const storedLocked = await SecureStore.getItemAsync(RECIPE_KEY);
          const lockedRecipes = storedLocked ? JSON.parse(storedLocked) : {};

          const merged = cachedData.map((item) => {
            const lockedForType = lockedRecipes?.[item.type];
            const isLocked = lockedForType?.id === item.id;
            return { ...item, locked: !!isLocked };
          });

          setData(merged);
          didBootstrap.current = true;
          return;
        } catch (e) {}
      }

      // No cache / bad cache => fetch
      didBootstrap.current = true;
      setTriggerFilterRecipeChange(new Boolean(true));
    };

    bootstrap();
  }, [setTriggerFilterRecipeChange]);

  // Whenever trigger changes (auto new day, or other trigger usage) → fetch
  useEffect(() => {
    if (!didBootstrap.current) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFilterRecipeChange]);

  // Fetch by meal type:
  // - If locked for that type: return it (never change)
  // - Else: call API to randomize
  const fetchDataByType = async (type) => {
    const storedLocked = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = storedLocked ? JSON.parse(storedLocked) : {};

    // LOCKED => never fetch new recipe
    if (lockedRecipes[type]) {
      return { ...lockedRecipes[type], type, locked: true };
    }

    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = (filterParam.ingredients ?? []).map((x) => x.id);

    let res;
    try {
      res = await api.get(`${API_BASE_URL}/randomize`, {
        params: { ...filterParam, type },
      });
    } catch (e) {
      console.log("ERROR FETCHING RANDOMIZED RECIPE:", e);
    }

    if (!res?.data?.length) {
      res = await api.get(`${API_BASE_URL}/randomize`, {
        params: {
          difficulties: [],
          ingredients: [],
          ingredient_categories: [],
          utensils: [],
          diet: filterParam?.diet,
          time: 30,
          search_by: "explore",
          type,
        },
      });
    }

    const recipe = res?.data?.[0]?.belongs_to_recipe ?? res?.data?.[0];
    return recipe ? { ...recipe, type, locked: false } : null;
  };

  // Fetch all meal types, keep locked ones, randomize unlocked ones, then cache for today
  const fetchData = async () => {
    const results = await Promise.all(
      MEAL_TYPES.map((type) => fetchDataByType(type))
    );
    const cleaned = results.filter(Boolean);

    setData(cleaned);

    // cache results for today
    const today = getTodayKey();
    await SecureStore.setItemAsync(CACHED_DATE_KEY, today);
    await SecureStore.setItemAsync(CACHED_RECIPES_KEY, JSON.stringify(cleaned));
  };

  const manualRefresh = async () => {
    await fetchData();
  };

  const lockRecipe = async (recipe) => {
    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : {};
    const type = recipe.type;

    if (lockedRecipes[type]?.id === recipe.id) delete lockedRecipes[type];
    else lockedRecipes[type] = { ...recipe, type, locked: true };

    await SecureStore.setItemAsync(RECIPE_KEY, JSON.stringify(lockedRecipes));

    setData((prev) =>
      prev.map((item) => {
        if (item.type !== type) return item;

        const isNowLocked =
          !!lockedRecipes[type] && lockedRecipes[type].id === item.id;
        return { ...item, locked: isNowLocked };
      })
    );

    const cached = await SecureStore.getItemAsync(CACHED_RECIPES_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        const updated = cachedData.map((item) => {
          if (item.type !== type) return item;
          const isNowLocked =
            !!lockedRecipes[type] && lockedRecipes[type].id === item.id;
          return { ...item, locked: isNowLocked };
        });
        await SecureStore.setItemAsync(
          CACHED_RECIPES_KEY,
          JSON.stringify(updated)
        );
      } catch (e) {}
    }
  };

  return (
    <AuthenticatedLayout>
      <FlatList
        style={{ flex: 1, width: "96%" }}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Menu
            title={item.name}
            image={item.image}
            recipe_category={item.belongs_to_recipe_category?.name}
            locked={item.locked}
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: item.id },
              })
            }
            onLockPress={() => lockRecipe(item)}
          />
        )}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={manualRefresh}
        >
          <Image
            source={require("../../../resource/search-button.png")}
            style={styles.fabIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: {
    width: 24,
    height: 24,
  },
});
