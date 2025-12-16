import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../../util/api";
import Menu from "../../../component/menu";
import { FlatList } from "react-native";
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

    if (lockedRecipes[type]) {
      return lockedRecipes[type];
    }

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

    const recipe =
      res?.data[0]?.belongs_to_recipe ?? res?.data[0];

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

    if (lockedRecipes[type]?.id === recipe.id) {
      delete lockedRecipes[type];
    } else {
      lockedRecipes[type] = { ...recipe, locked: true };
    }

    await SecureStore.setItemAsync(
      RECIPE_KEY,
      JSON.stringify(lockedRecipes)
    );

    setData((prev) =>
      prev.map((item) =>
        item.id === recipe.id
          ? { ...item, locked: !item.locked }
          : item
      )
    );
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
        contentContainerStyle={{ padding: 10 }}
      />
    </AuthenticatedLayout>
  );
}
