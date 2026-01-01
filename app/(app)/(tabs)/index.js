import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useState } from "react";
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
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Drink"];

export default function Home() {
  const [data, setData] = useState([]);
  const { triggerFilterRecipeChange, filterRecipe } = useFilterRecipe();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [triggerFilterRecipeChange]);

  const fetchDataByType = async (type) => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : {};

    if (lockedRecipes[type]) return lockedRecipes[type];

    let res = await api.get(`${API_BASE_URL}/randomize`, {
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

    if (!res?.data?.length) {
      res = await api.get(`${API_BASE_URL}/randomize`, {
        params: { ...filterParam, type },
      });
    }

    const recipe = res?.data[0]?.belongs_to_recipe ?? res?.data[0];
    return recipe ? { ...recipe, type, locked: false } : null;
  };

  const fetchData = async () => {
    const results = await Promise.all(
      MEAL_TYPES.map((type) => fetchDataByType(type))
    );
    setData(results.filter(Boolean));
  };

  const lockRecipe = async (recipe) => {
    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : {};
    const type = recipe.type;

    if (lockedRecipes[type]?.id === recipe.id) delete lockedRecipes[type];
    else lockedRecipes[type] = { ...recipe, locked: true };

    await SecureStore.setItemAsync(RECIPE_KEY, JSON.stringify(lockedRecipes));

    setData((prev) =>
      prev.map((item) =>
        item.id === recipe.id ? { ...item, locked: !item.locked } : item
      )
    );
  };

  return (
    <AuthenticatedLayout>
      {/* Keep your original FlatList exactly the same */}
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
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }} // only to avoid FAB covering last card
        showsVerticalScrollIndicator={false}
      />

      {/* Overlay layer that DOES NOT block scroll except on the button itself */}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push("/search")}
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
    bottom: 20, // above your bottom navbar; adjust slightly if needed
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
    // no tintColor (prevents icon turning into a dot)
  },
});
