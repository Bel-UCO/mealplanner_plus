import { useEffect, useState } from "react";
import ShareDialog from "../../../../component/shareDialog";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AuthenticatedLayout from "../../../../layout/AuthenticatedLayout";
import api, { API_BASE_URL } from "../../../../util/api";
import * as Linking from "expo-linking";


export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareDialog, setShareDialog] = useState(false);
  const shareUrl = Linking.createURL("/(app)/(tabs)/recipe/" + id);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const closeDialog = () => {
    setShareDialog(false);
  };

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_BASE_URL}/recipe-detail/${id}`);
      setRecipe(res.data);
    } catch (err) {
      console.log("ERROR FETCHING RECIPE:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    const res = await api.post(`${API_BASE_URL}/save-recipe/${id}`);
  };

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

  const imageUrl =
    "https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/" +
    recipe.image;

  return (
    <AuthenticatedLayout>
      <View style={styles.fullWidth}>
        <ShareDialog shareUrl={shareUrl} visible={shareDialog} onClose={closeDialog}></ShareDialog>
        <View style={styles.card}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{recipe.name}</Text>

                <View style={styles.tagRow}>
                  <Text style={styles.tag}>⏱ {recipe.time} min</Text>
                </View>
              </View>

              <View style={styles.iconGroup}>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    saveRecipe();
                  }}
                >
                  <Image
                    source={require("../../../../resource/Save.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    setShareDialog(true);
                  }}
                >
                  <Image
                    source={require("../../../../resource/Share.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INGREDIENT</Text>
              {recipe.has_many_recipe_ingredient.map((item) => (
                <Text key={item.id} style={styles.bullet}>
                  • {item.ingredient_metadata}
                </Text>
              ))}
            </View>

            {recipe.has_many_recipe_seasoning.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SEASONING</Text>
                {recipe.has_many_recipe_seasoning.map((item) => (
                  <Text key={item.id} style={styles.bullet}>
                    • {item.seasoning_metadata}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STEPS</Text>
              {recipe.has_many_steps.map((step, index) => (
                <Text key={step.id} style={styles.step}>
                  {index + 1}. {step.steps}
                </Text>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    flex: 1,
    width: "100%",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 14,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
    columnGap: 8,
  },
  tag: {
    fontSize: 12,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 10,
  },
  icon: {
    fontSize: 20,
  },

  // BODY
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 13,
    marginBottom: 4,
  },
  step: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
});
