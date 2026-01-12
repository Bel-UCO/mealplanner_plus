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
  Image,
} from "react-native";

import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import api, { API_BASE_URL } from "../../../util/api";
import useFilterRecipeExplore from "../../../util/filterHooksExplore";
import { useRouter } from "expo-router";

const ORANGE = "#ff9a20";

// explore recipe tab screen
export default function Explore() {
  const [data, setData] = useState([]);
  const { filterRecipeExplore } = useFilterRecipeExplore();
  const router = useRouter();

  const categoryIcons = {
    Breakfast: require("../../../resource/Breakfast_Randomize.png"),
    Lunch: require("../../../resource/Lunch_Randomize.png"),
    Dinner: require("../../../resource/Dinner_Randomize.png"),
    Dessert: require("../../../resource/Dessert_Randomize.png"),
    Drink: require("../../../resource/Drink_Randomize.png"),
  };

  useEffect(() => {
    fetchData();
  });

  // fetch explore recipe data from api
  const fetchData = async () => {
    const filterParam = { ...filterRecipeExplore };

    filterParam.ingredients = filterParam.ingredients.map((x) => x.id);

    const res = await api.get(`${API_BASE_URL}/recipe`, {
      params: filterParam,
    });

    setData(res.data); // make sure this is an array
  };

  // template render recipe card at explore
  const renderRecipe = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/recipe/[id]",
            params: { id: item?.id },
          })
        }
      >
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
            <Image
              source={categoryIcons[item?.belongs_to_recipe_category?.name]}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            {item.is_saved ? (
              <Image
                source={require("../../../resource/Saved_Explore.png")}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../../resource/Not_Saved_Explore.png")}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
            )}
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
          keyExtractor={(item, index) => index}
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

  categoryWrapper: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  categoryIcon: {
    width: 26,
    height: 26,
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
