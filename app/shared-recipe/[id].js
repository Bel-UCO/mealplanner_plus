import { useRoute } from "@react-navigation/native";

const SharedRecipe = () => {
  const { recipe_id } = useLocalSearchParams();
  const router = useRoute();

  router.replace("/(app)/(tabs)/recipe/" + recipe_id);
};

export default SharedRecipe;
