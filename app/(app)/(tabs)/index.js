import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../../util/api";
import Menu from "../../../component/menu";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import useFilterRecipe from "../../../util/filterHooks";
import * as SecureStore from "expo-secure-store";

const RECIPE_KEY = "LOCKED_RECIPES";

export default function Home() {
  const [data, setData] = useState([]);
  const { triggerFilterRecipeChange, filterRecipe } = useFilterRecipe();
  const router = useRouter();

  useEffect(() => {    
    console.log("fetch random");
    fetchData();
  }, [triggerFilterRecipeChange]);

  const fetchDataBreakfast = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: { ...filterParam, type: "Breakfast" },
    });

    return lockedRecipes[0]
      ? lockedRecipes[0]
      : res?.data[0]?.belongs_to_recipe
      ? res.data[0].belongs_to_recipe
      : res?.data[0];
  };

  const fetchDataLunch = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: { ...filterParam, type: "Lunch" },
    });

    return lockedRecipes[1] ? lockedRecipes[1] : res?.data[0];
  };

  const fetchDataDinner = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: { ...filterParam, type: "Dinner" },
    });

    return lockedRecipes[2]
      ? lockedRecipes[2]
      : res?.data[0]?.belongs_to_recipe
      ? res.data[0].belongs_to_recipe
      : res?.data[0];
  };

  const fetchDataDessert = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: { ...filterParam, type: "Dessert" },
    });

    return lockedRecipes[3]
      ? lockedRecipes[3]
      : res?.data[0]?.belongs_to_recipe
      ? res.data[0].belongs_to_recipe
      : res?.data[0];
  };

  const fetchDataDrink = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: { ...filterParam, type: "Drink" },
    });

    return lockedRecipes[4]
      ? lockedRecipes[4]
      : res?.data[0]?.belongs_to_recipe
      ? res.data[0].belongs_to_recipe
      : res?.data[0];
  };

  const fetchData = async () => {
    const [resBreakfast, resLunch, resDinner, resDessert, resDrink] =
      await Promise.all([
        fetchDataBreakfast(),
        fetchDataLunch(),
        fetchDataDinner(),
        fetchDataDessert(),
        fetchDataDrink(),
      ]);

    const arrOfData = [];

    if (resBreakfast) {
      arrOfData.push(resBreakfast);
    }

    if (resLunch) {
      arrOfData.push(resLunch);
    }

    if (resDinner) {
      arrOfData.push(resDinner);
    }

    if (resDessert) {
      arrOfData.push(resDessert);
    }

    if (resDrink) {
      arrOfData.push(resDrink);
    }

    setData(arrOfData);
  };

  const lockRecipe = async (recipe) => {
    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    let lockedRecipes = stored ? JSON.parse(stored) : [];

    const exists = lockedRecipes.find((x) => x.id === recipe.id);

    if (exists) {
      lockedRecipes = lockedRecipes.filter((x) => x.id !== recipe.id);
    } else {
      lockedRecipes.push({ ...recipe, locked: true });
    }

    await SecureStore.setItemAsync(RECIPE_KEY, JSON.stringify(lockedRecipes));

    setData((prev) =>
      prev.map((item) =>
        item.id === recipe.id ? { ...item, locked: !item.locked } : item
      )
    );
  };

  return (
    <AuthenticatedLayout>
      <FlatList
        style={{ flex: 1, width: "96%" }}
        data={data}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={({ item }) => (
          <Menu
            title={item.name}
            image={item.image}
            recipe_category={item.belongs_to_recipe_category.name}
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
