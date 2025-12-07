import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../../util/api";
import Menu from "../../../component/menu";
import { FlatList } from "react-native";

export default function Home() {
  const [data, setData] = useState([]); // assume array

  useEffect(() => {
    fetchData();
  }, []);

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
        renderItem={({ item }) => <Menu title={item.name} image={item.image} />}
        contentContainerStyle={{ padding: 10 }}
      />
    </AuthenticatedLayout>
  );
}
