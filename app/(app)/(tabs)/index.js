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
  const { filterRecipe } = useFilterRecipe();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [filterRecipe]);

  const fetchData = async () => {
    const filterParam = JSON.parse(filterRecipe);
    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const stored = await SecureStore.getItemAsync(RECIPE_KEY);
    const lockedRecipes = stored ? JSON.parse(stored) : [];

    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: filterParam,
    });    
    
    setData([...res.data]);
  
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
