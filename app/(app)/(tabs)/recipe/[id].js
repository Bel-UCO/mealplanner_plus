import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AuthenticatedLayout from "../../../../layout/AuthenticatedLayout";
import api, { API_BASE_URL } from "../../../../util/api";
import * as Linking from "expo-linking";
import ShareDialog from "../../../../component/dialogShare";

// recipe detail screen
export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);

  const shareUrl = Linking.createURL("/(app)/(tabs)/recipe/" + id);

  const categoryIconObject = {
    Meat: require("../../../../resource/Meat.png"),
    Poultry: require("../../../../resource/Chicken.png"),
    Seafood: require("../../../../resource/Seafood.png"),
    "Processed Meat": require("../../../../resource/Processed_meat.png"),
    Eggs: require("../../../../resource/Egg.png"),
    Grains: require("../../../../resource/Grain.png"),
    "Vegetable & Herb": require("../../../../resource/Vegetable.png"),
    Fruit: require("../../../../resource/Fruit.png"),
    "Root Vegetable": require("../../../../resource/Root.png"),
    "Nut & Seed": require("../../../../resource/Peanut.png"),
    "Dry Ingredient": require("../../../../resource/Flour.png"),
    "Ready-Made Product": require("../../../../resource/Processed_food.png"),
    "Milk & Cheese Product": require("../../../../resource/Milk.png"),
    Alcohol: require("../../../../resource/Alcohol.png"),
    Other: require("../../../../resource/Flour.png"),
  };

  // on id change fetch recipe detail
  useEffect(() => {
    loadRecipe();
  }, [id]);

  // fetch recipe detail from api
  const loadRecipe = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_BASE_URL}/recipe-detail/${id}`);
      setRecipe(res.data);
      setIsSaved(res?.data?.is_saved);
    } catch (err) {
      console.log("ERROR FETCHING RECIPE:", err);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  // hit api save recipe
  const saveRecipe = async () => {
    try {
      await api.post(`${API_BASE_URL}/save-recipe/${id}`);
      setIsSaved(!isSaved)
    } catch (err) {
      console.log("ERROR SAVING RECIPE:", err);
    }
  };

  // hit storage on supabase bucket of image
  const imageUrl = useMemo(() => {
    if (!recipe?.image) return null;
    return (
      "https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/" +
      recipe.image
    );
  }, [recipe]);

  // UNIQUE INGREDIENT CATEGORY ICONS (icons only)
  const ingredientIcons = useMemo(() => {
    if (!recipe?.has_many_recipe_ingredient) return [];

    const map = {};
    recipe.has_many_recipe_ingredient.forEach((item) => {
      const name =
        item?.belongs_to_ingredients?.belongs_to_ingredients_category?.name ||
        "Other";

      if (!map[name]) {
        map[name] = categoryIconObject[name] || categoryIconObject.Other;
      }
    });

    return Object.entries(map).map(([name, icon]) => ({
      name,
      icon,
    }));
  }, [recipe]);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </AuthenticatedLayout>
    );
  }

  if (!recipe) {
    return (
      <AuthenticatedLayout>
        <View style={styles.centered}>
          <Text>No recipe found.</Text>
        </View>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <View style={styles.fullWidth}>
        <ShareDialog
          shareUrl={shareUrl}
          visible={shareDialog}
          onClose={() => setShareDialog(false)}
        />

        {/* IMAGE */}
        <View style={styles.imageWrap}>
          {!!imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>{recipe.name}</Text>

              <View style={styles.iconGroup}>
                <TouchableOpacity style={styles.actionBtn} onPress={saveRecipe}>
                  {isSaved ? (
                    <Image
                      source={require("../../../../resource/Saved.png")}
                      style={styles.actionIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../../../resource/Save.png")}
                      style={styles.actionIcon}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setShareDialog(true)}
                >
                  <Image
                    source={require("../../../../resource/Share.png")}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ICONS LEFT | TIME RIGHT */}
            <View style={styles.metaBetweenRow}>
              <View style={styles.miniIconRow}>
                {ingredientIcons.map((x) => (
                  <View key={x.name} style={styles.miniIconPill}>
                    <Image source={x.icon} style={styles.miniIcon} />
                  </View>
                ))}
              </View>

              <View style={styles.metaItem}>
                <Image
                  source={require("../../../../resource/Clock.png")}
                  style={styles.metaIcon}
                />
                <Text style={styles.metaText}>{recipe.time}m</Text>
              </View>
            </View>

            {/* INGREDIENT (NO GROUPING) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INGREDIENT</Text>
              {recipe.has_many_recipe_ingredient.map((item) => (
                <Text key={item.id} style={styles.bullet}>
                  • {item.ingredient_metadata}
                </Text>
              ))}
            </View>

            {/* SEASONING */}
            {!!recipe.has_many_recipe_seasoning?.length && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SEASONING</Text>
                {recipe.has_many_recipe_seasoning.map((item) => (
                  <Text key={item.id} style={styles.bullet}>
                    •{" "}
                    {item.seasoning_metadata || item.ingredient_metadata || "-"}
                  </Text>
                ))}
              </View>
            )}

            {/* STEPS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>HOW TO</Text>
              {recipe.has_many_steps.map((step, index) => (
                <Text key={step.id} style={styles.step}>
                  {index + 1}. {step.steps}
                </Text>
              ))}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  fullWidth: { flex: 1, width: "100%", alignSelf: "stretch" },

  imageWrap: { width: "100%", height: 220, backgroundColor: "#eee" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },

  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -18,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -6 },
      },
      android: { elevation: 6 },
    }),
  },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 22, width:"50%", fontWeight: "900", textTransform: "uppercase" },

  iconGroup: { flexDirection: "row" },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { width: 24, height: 24 },

  metaBetweenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  miniIconRow: { flexDirection: "row", gap: 10 },
  miniIconPill: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  miniIcon: { width: 18, height: 18 },

  metaItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaIcon: { width: 16, height: 16 },
  metaText: { fontSize: 12, fontWeight: "600", opacity: 0.8 },

  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  bullet: { fontSize: 13, marginBottom: 6, lineHeight: 18 },
  step: { fontSize: 13, marginBottom: 10, lineHeight: 20 },
});
