// ExploreScreen.js
// ExploreScreen.js
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import AuthenticatedLayout from "../../../../layout/AuthenticatedLayout";
import useFilterRecipe from "../../../../util/filterHooks";
import api, { API_BASE_URL } from "../../../../util/api";

const ORANGE = "#ff9a20";

export default function Explore() {
  const [data, setData] = useState([]);
  const { filterRecipe } = useFilterRecipe();

  useEffect(() => {
    fetchData();
  }, [filterRecipe]);

  const fetchData = async () => {
    const filterParam = JSON.parse(filterRecipe);

    filterParam.ingredients = filterParam.ingredients.map(
      (element) => element.id
    );

    const res = await api.get(`${API_BASE_URL}/recipe`, {
      params: filterParam,
    });

    setData(res.data); // make sure this is an array
  };

  const renderRecipe = ({ item }) => {
    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.85}>
        <ImageBackground
          source={{
            uri:
              "https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/" +
              item.image,
          }}
          style={styles.cardImage}
          imageStyle={styles.cardImageBorder}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="restaurant" size={14} />
            </View>
            <Ionicons name="heart-outline" size={22} color="white" />
          </View>

          <View style={styles.recipeNameBar}>
            <Text style={styles.recipeNameText}>{item.name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <AuthenticatedLayout>
      <View style={styles.contentWrapper}>
        <FlatList
          data={data}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14 }}
        />
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222",
  },

  header: {
    backgroundColor: ORANGE,
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
    color: "black",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  contentWrapper: {
    flex: 1,
    backgroundColor: "white",
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardContainer: {
    width: "48%",
  },

  cardImage: {
    height: 150,
    justifyContent: "space-between",
  },

  cardImageBorder: {
    borderRadius: 12,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },

  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  recipeNameBar: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  recipeNameText: {
    color: "white",
    fontSize: 11,
    letterSpacing: 0.4,
  },

  bottomBar: {
    height: 55,
    backgroundColor: ORANGE,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "black",
    padding: 6,
    borderRadius: 999,
  },
});
