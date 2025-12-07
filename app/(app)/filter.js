import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import useFilterRecipe from "../../util/filterHooks";

const ORANGE = "#FB9637";

const Filter = () => {
  const router = useRouter();
  const { filterRecipe,saveFilterRecipe } = useFilterRecipe();

  const [filterObject, setFilterObject] = useState(JSON.parse(filterRecipe));

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  // ---- handlers ----
  const toggleDifficulty = (value) => {
    setFilterObject((prev) => {
      const exists = prev.difficulties.includes(value);
      const difficulties = exists
        ? prev.difficulties.filter((d) => d !== value)
        : [...prev.difficulties, value];
      return { ...prev, difficulties };
    });
  };

  const handleTimePress = (index) => {
    const times = [30, 60, 120, 240, 999]; // 4H+ = 999 placeholder
    setSelectedTimeIndex(index);
    setFilterObject((prev) => ({
      ...prev,
      time: times[index],
    }));
  };

  const handleDietPress = (diet) => {
    setFilterObject((prev) => ({
      ...prev,
      diet: prev.diet === diet ? "" : diet,
    }));
  };

  const handleTypePress = (typeValue) => {
    setFilterObject((prev) => ({
      ...prev,
      type: prev.type === typeValue ? "" : typeValue,
    }));
  };

  const toggleCategory = (id) => {
    setFilterObject((prev) => {
      const exists = prev.ingredient_categories.includes(id);
      const ingredient_categories = exists
        ? prev.ingredient_categories.filter((c) => c !== id)
        : [...prev.ingredient_categories, id];
      return { ...prev, ingredient_categories };
    });
  };

  const toggleUtensil = (id) => {
    setFilterObject((prev) => {
      const exists = prev.utensils.includes(id);
      const utensils = exists
        ? prev.utensils.filter((u) => u !== id)
        : [...prev.utensils, id];
      return { ...prev, utensils };
    });
  };

  const toggleIngredientMelon = () => {
    setFilterObject((prev) => {
      const exists = prev.ingredients.includes("melon");
      const ingredients = exists
        ? prev.ingredients.filter((i) => i !== "melon")
        : [...prev.ingredients, "melon"];
      return { ...prev, ingredients };
    });
  };

  const applyFilter = () => {
    saveFilterRecipe(filterObject);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FILTER</Text>
        </View>
        <View style={styles.divider} />

        {/* DIFFICULTIES */}
        <Text style={styles.sectionTitle}>DIFFICULTIES</Text>
        <View style={styles.difficultyRow}>
          <TouchableOpacity
            style={[
              styles.difficultyItem,
              filterObject.difficulties.includes(1) &&
                styles.difficultyItemActive,
            ]}
            onPress={() => toggleDifficulty(1)}
          >
            <View
              style={[
                styles.checkbox,
                filterObject.difficulties.includes(1) && styles.checkboxActive,
              ]}
            />
            <Text style={styles.difficultyText}>1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.difficultyItem,
              filterObject.difficulties.includes(2) &&
                styles.difficultyItemActive,
            ]}
            onPress={() => toggleDifficulty(2)}
          >
            <View
              style={[
                styles.checkbox,
                filterObject.difficulties.includes(2) && styles.checkboxActive,
              ]}
            />
            <Text style={styles.difficultyText}>2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.difficultyItem,
              filterObject.difficulties.includes(3) &&
                styles.difficultyItemActive,
            ]}
            onPress={() => toggleDifficulty(3)}
          >
            <View
              style={[
                styles.checkbox,
                filterObject.difficulties.includes(3) && styles.checkboxActive,
              ]}
            />
            <Text style={styles.difficultyText}>3</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.difficultyItem,
              filterObject.difficulties.includes(4) &&
                styles.difficultyItemActive,
            ]}
            onPress={() => toggleDifficulty(4)}
          >
            <View
              style={[
                styles.checkbox,
                filterObject.difficulties.includes(4) && styles.checkboxActive,
              ]}
            />
            <Text style={styles.difficultyText}>4</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.difficultyItem,
              filterObject.difficulties.includes(5) &&
                styles.difficultyItemActive,
            ]}
            onPress={() => toggleDifficulty(5)}
          >
            <View
              style={[
                styles.checkbox,
                filterObject.difficulties.includes(5) && styles.checkboxActive,
              ]}
            />
            <Text style={styles.difficultyText}>5</Text>
          </TouchableOpacity>
        </View>

        {/* TIME */}
        <Text style={styles.sectionTitle}>TIME</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack} />

            <View style={styles.sliderDotsRow}>
              <TouchableOpacity
                style={[
                  styles.sliderDotOuter,
                  selectedTimeIndex === 0 && styles.sliderDotOuterActive,
                ]}
                onPress={() => handleTimePress(0)}
              >
                {selectedTimeIndex === 0 && (
                  <View style={styles.sliderDotInner} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sliderDotOuter,
                  selectedTimeIndex === 1 && styles.sliderDotOuterActive,
                ]}
                onPress={() => handleTimePress(1)}
              >
                {selectedTimeIndex === 1 && (
                  <View style={styles.sliderDotInner} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sliderDotOuter,
                  selectedTimeIndex === 2 && styles.sliderDotOuterActive,
                ]}
                onPress={() => handleTimePress(2)}
              >
                {selectedTimeIndex === 2 && (
                  <View style={styles.sliderDotInner} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sliderDotOuter,
                  selectedTimeIndex === 3 && styles.sliderDotOuterActive,
                ]}
                onPress={() => handleTimePress(3)}
              >
                {selectedTimeIndex === 3 && (
                  <View style={styles.sliderDotInner} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sliderDotOuter,
                  selectedTimeIndex === 4 && styles.sliderDotOuterActive,
                ]}
                onPress={() => handleTimePress(4)}
              >
                {selectedTimeIndex === 4 && (
                  <View style={styles.sliderDotInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeLabelRow}>
            <Text style={styles.timeLabel}>30 M</Text>
            <Text style={styles.timeLabel}>1 H</Text>
            <Text style={styles.timeLabel}>2 H</Text>
            <Text style={styles.timeLabel}>4 H</Text>
            <Text style={styles.timeLabel}>4 H+</Text>
          </View>
        </View>

        {/* TYPE */}
        <Text style={styles.sectionTitle}>TYPE</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.type === "Breakfast" && styles.squareButtonActive,
            ]}
            onPress={() => handleTypePress("Breakfast")}
          >
            <Image
              source={require("../../resource/Breakfast.png")}
              style={styles.typeIconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.type === "Lunch" && styles.squareButtonActive,
            ]}
            onPress={() => handleTypePress("Lunch")}
          >
            <Image
              source={require("../../resource/Lunch.png")}
              style={styles.typeIconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.type === "Dinner" && styles.squareButtonActive,
            ]}
            onPress={() => handleTypePress("Dinner")}
          >
            <Image
              source={require("../../resource/Dinner.png")}
              style={styles.typeIconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.type === "Dessert" && styles.squareButtonActive,
            ]}
            onPress={() => handleTypePress("Dessert")}
          >
            <Image
              source={require("../../resource/Dessert.png")}
              style={styles.typeIconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.type === "Drink" && styles.squareButtonActive,
            ]}
            onPress={() => handleTypePress("Drink")}
          >
            <Image
              source={require("../../resource/Drink.png")}
              style={styles.typeIconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* DIET */}
        <Text style={styles.sectionTitle}>DIET</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              filterObject.diet === "vegan" && styles.chipActive,
            ]}
            onPress={() => handleDietPress("vegan")}
          >
            <Text style={styles.chipText}>VEGAN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              filterObject.diet === "vegetarian" && styles.chipActive,
            ]}
            onPress={() => handleDietPress("vegetarian")}
          >
            <Text style={styles.chipText}>VEGETARIAN</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <View style={styles.iconGrid}>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat1") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat1")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat2") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat2")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat3") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat3")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat4") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat4")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat5") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat5")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat6") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat6")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat7") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat7")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat8") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat8")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat9") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat9")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat10") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat10")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat11") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat11")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.ingredient_categories.includes("cat12") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleCategory("cat12")}
          >
            <Text style={styles.squareIconEmoji}>🍽</Text>
          </TouchableOpacity>
        </View>

        {/* INGREDIENT */}
        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        <View style={styles.ingredientWrapper}>
          <TouchableOpacity
            style={[
              styles.ingredientPill,
              filterObject.ingredients.includes("melon") &&
                styles.ingredientPillActive,
            ]}
            onPress={toggleIngredientMelon}
          >
            <Text style={styles.ingredientText}>MELON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ingredientPlusCircle}
            onPress={toggleIngredientMelon}
          >
            <Text style={styles.ingredientPlus}>+</Text>
          </TouchableOpacity>

          <Text style={styles.dropdownArrow}>⌵</Text>
        </View>

        {/* UTENSIL */}
        <Text style={styles.sectionTitle}>UTENSIL</Text>
        <View style={styles.iconGrid}>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut1") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut1")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut2") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut2")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut3") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut3")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut4") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut4")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut5") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut5")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut6") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut6")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut7") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut7")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.squareButton,
              filterObject.utensils.includes("ut8") &&
                styles.squareButtonActive,
            ]}
            onPress={() => toggleUtensil("ut8")}
          >
            <Text style={styles.squareIconEmoji}>🍴</Text>
          </TouchableOpacity>
        </View>

        {/* APPLY */}
        <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
          <Text style={styles.applyText}>APPLY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // layout
  container: {
    flex: 1,
    backgroundColor: ORANGE,
  },
  scroll: {
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  // header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 22,
    marginRight: 12,
    color: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginBottom: 16,
  },

  // section titles
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  // difficulties
  difficultyRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  difficultyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 6,
    backgroundColor: "#FFFFFF", // inactive
  },

  difficultyItemActive: {
    backgroundColor: "#8C8C8C", // active
  },

  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 6,
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#000000",
  },
  difficultyText: {
    fontSize: 12,
    color: "#000",
  },

  // time slider
  sliderContainer: {
    marginTop: 4,
  },
  sliderWrapper: {
    height: 18,
    justifyContent: "center",
  },
  sliderTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFF",
  },
  sliderDotsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    alignItems: "center",
  },
  sliderDotOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderDotOuterActive: {
    borderColor: "#1BA1FF",
  },
  sliderDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1BA1FF",
  },
  timeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 10,
    color: "#000",
  },

  // TYPE layout row
  typeRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
  },

  // shared square buttons (TYPE, CATEGORY, UTENSIL)
  // shared square buttons (TYPE, CATEGORY, UTENSIL)
  squareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // inactive = white
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },

  squareButtonActive: {
    backgroundColor: "#8C8C8C", // active = grey
  },

  typeIconImg: {
    width: 26,
    height: 26,
  },
  squareIconEmoji: {
    fontSize: 18,
  },

  // diet chips
  chipRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  chip: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#A0A0A0",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  // category & utensil grid
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },

  // ingredient row
  ingredientWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  ingredientPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF", // inactive
  },
  ingredientPillActive: {
    backgroundColor: "#8C8C8C", // active
  },
  ingredientText: {
    fontSize: 12,
    color: "#000",
  },
  ingredientPlusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginRight: "auto",
  },
  ingredientPlus: {
    fontSize: 16,
    color: "#000",
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#000",
    marginLeft: 12,
  },

  // apply button
  applyButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
  },
  applyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Filter;
