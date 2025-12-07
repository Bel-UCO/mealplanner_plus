import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../../util/api";
import Menu from "../../../component/menu";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useFilterRecipe from "../../../util/filterHooks";

export default function Home() {
  const [data, setData] = useState([]);
  const {filterRecipe} = useFilterRecipe()
  const router = useRouter();

  useEffect(()=>{
    fetchData()
  },[filterRecipe])

  const fetchData = async () => {
    const res = await api.get(`${API_BASE_URL}/randomize`, {
      params: {
        time: 30,
        recipe_category: "Breakfast",
      },
    });

    setData(res.data); // make sure this is an array
  };

  return (
    <AuthenticatedLayout>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={({ item }) => (
          <Menu
            title={item.name}
            image={item.image}
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={{ padding: 10 }}
      />
    </AuthenticatedLayout>
  );
}
