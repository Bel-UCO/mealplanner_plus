import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AutoComplete from "../../component/autocomplete";
import useFilterRecipeExplore from "../../util/filterHooksExplore";
import Tooltip from "react-native-walkthrough-tooltip";

const ORANGE = "#FB9637";

// ✅ Diet → disabled category ids (based on your categoryIconList ids)
const DIET_DISABLED_CATEGORY_IDS = {
  vegan: [1, 2, 3, 4, 5, 13], // meat/poultry/seafood/processed/egg/dairy
  vegetarian: [1, 2, 3, 4],  // meat/poultry/seafood/processed
};

const FilterExplore = () => {
  const router = useRouter();
  const { filterRecipeExplore, saveFilterRecipeExplore } =
    useFilterRecipeExplore();

  const [filterObject, setFilterObject] = useState(filterRecipeExplore);

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  // ✅ added: track disabled categories
  const [disabledCategoryIds, setDisabledCategoryIds] = useState([]);

  const disabledCategorySet = useMemo(
    () => new Set(disabledCategoryIds),
    [disabledCategoryIds]
  );

  // ✅ added: when diet changes -> update disabled list + reset selected categories
  useEffect(() => {
    const diet = filterObject?.diet || "";
    const disabled = DIET_DISABLED_CATEGORY_IDS[diet] || [];
    setDisabledCategoryIds(disabled);

    // reset category filter array when diet changes
    setFilterObject((prev) => ({
      ...prev,
      ingredient_categories: [],
    }));
  }, [filterObject?.diet]);

  const categoryIconList = [
    { id: 1, icon: require("../../resource/Meat.png"), label: "Meat" },
    { id: 2, icon: require("../../resource/Chicken.png"), label: "Poultry" },
    { id: 3, icon: require("../../resource/Seafood.png"), label: "Seafood" },
    {
      id: 4,
      icon: require("../../resource/Processed_meat.png"),
      label: "Processed Meat",
    },
    { id: 5, icon: require("../../resource/Egg.png"), label: "Egg" },
    { id: 6, icon: require("../../resource/Grain.png"), label: "Grain" },
    {
      id: 7,
      icon: require("../../resource/Vegetable.png"),
      label: "Vegetable",
    },
    { id: 8, icon: require("../../resource/Fruit.png"), label: "Fruit" },
    {
      id: 9,
      icon: require("../../resource/Root.png"),
      label: "Root Vegetable",
    },
    { id: 10, icon: require("../../resource/Peanut.png"), label: "Nut & Seed" },
    {
      id: 11,
      icon: require("../../resource/Flour.png"),
      label: "Dry Ingredient",
    },
    {
      id: 12,
      icon: require("../../resource/Processed_food.png"),
      label: "Ready-Made Product",
    },
    { id: 13, icon: require("../../resource/Milk.png"), label: "Milk & Dairy" },
    { id: 14, icon: require("../../resource/Alcohol.png"), label: "Alcohol" },
  ];

  const utensilIconList = [
    { id: 1, icon: require("../../resource/Blender.png"), label: "Blender" },
    { id: 2, icon: require("../../resource/Chopper.png"), label: "Chopper" },
    { id: 3, icon: require("../../resource/Mixer.png"), label: "Mixer" },
    {
      id: 4,
      icon: require("../../resource/Microwave.png"),
      label: "Microwave",
    },
    { id: 5, icon: require("../../resource/Oven.png"), label: "Oven" },
    { id: 6, icon: require("../../resource/Grinder.png"), label: "Grinder" },
    { id: 7, icon: require("../../resource/Shaker.png"), label: "Shaker" },
  ];

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
    const times = [30, 60, 120, 240, 999];
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
    setFilterObject((prev) => {
      const exists = prev.type.includes(typeValue);
      const type = exists
        ? prev.type.filter((t) => t !== typeValue)
        : [...prev.type, typeValue];

      return { ...prev, type };
    });
  };

  const toggleCategory = (id) => {
    // ✅ block press if disabled
    if (disabledCategorySet.has(id)) return;

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

  const applyFilter = () => {
    saveFilterRecipeExplore(filterObject);
    router.back();
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const CategoryFilterButtonTemplate = ({ id, icon, label }) => {
    const [showTip, setShowTip] = useState(false);

    const isSelected = filterObject.ingredient_categories.includes(id);
    const isDisabled = disabledCategorySet.has(id);

    return (
      <Tooltip
        isVisible={showTip}
        content={<Text style={{ padding: 6, color: "#000" }}>{label}</Text>}
        placement="top"
        onClose={() => setShowTip(false)}
      >
        <TouchableOpacity
          disabled={isDisabled}
          style={[
            styles.squareButton, // not selected = white
            isSelected && styles.squareButtonSelected, // selected = light gray
            isDisabled && styles.squareButtonDisabled, // disabled = dark gray (last)
          ]}
          onPress={() => toggleCategory(id)}
          onLongPress={() => setShowTip(true)}
          delayLongPress={250}
        >
          <Image
            source={icon}
            style={[
              styles.typeIconImg,
              isDisabled && styles.typeIconImgDisabled,
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Tooltip>
    );
  };

  const UtensilFilterButtonTemplate = ({ id, icon, label }) => {
    const [showTip, setShowTip] = useState(false);

    return (
      <Tooltip
        isVisible={showTip}
        content={<Text style={{ padding: 6, color: "#000" }}>{label}</Text>}
        placement="top"
        onClose={() => setShowTip(false)}
      >
        <TouchableOpacity
          style={[
            styles.squareButton,
            filterObject.utensils.includes(id) && styles.squareButtonSelected,
          ]}
          onPress={() => toggleUtensil(id)}
          onLongPress={() => setShowTip(true)}
          delayLongPress={250}
        >
          <Image
            source={icon}
            style={styles.typeIconImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Tooltip>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => {
              applyFilter();
            }}
          >
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
              filterObject.type.includes("Breakfast") &&
                styles.squareButtonSelected,
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
              filterObject.type.includes("Lunch") && styles.squareButtonSelected,
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
              filterObject.type.includes("Dinner") && styles.squareButtonSelected,
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
              filterObject.type.includes("Dessert") &&
                styles.squareButtonSelected,
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
              filterObject.type.includes("Drink") && styles.squareButtonSelected,
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

        {/* DIET (fixed) */}
        <Text style={styles.sectionTitle}>DIET</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              filterObject.diet === "vegan" && styles.chipSelected,
            ]}
            onPress={() => handleDietPress("vegan")}
          >
            <Text style={styles.chipText}>VEGAN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              filterObject.diet === "vegetarian" && styles.chipSelected,
            ]}
            onPress={() => handleDietPress("vegetarian")}
          >
            <Text style={styles.chipText}>VEGETARIAN</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <View style={styles.iconGrid}>
          {chunkArray(categoryIconList, 5).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.iconRow}>
              {row.map((element) => (
                <CategoryFilterButtonTemplate
                  key={element.id}
                  id={element.id}
                  icon={element.icon}
                  label={element.label}
                />
              ))}
            </View>
          ))}
        </View>

        {/* INGREDIENT */}
        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        <AutoComplete
          value={filterObject.ingredients}
          onChange={(newVal) =>
            setFilterObject((prev) => ({
              ...prev,
              ingredients: newVal,
            }))
          }
        />

        {/* UTENSIL */}
        <Text style={styles.sectionTitle}>UTENSIL</Text>
        <View style={styles.iconGrid}>
          {chunkArray(utensilIconList, 5).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.iconRow}>
              {row.map((element) => (
                <UtensilFilterButtonTemplate
                  key={element.id}
                  id={element.id}
                  icon={element.icon}
                  label={element.label}
                />
              ))}
            </View>
          ))}
        </View>
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
    paddingBottom: 160,
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
    backgroundColor: "#FFFFFF",
  },
  difficultyItemActive: {
    backgroundColor: "#8C8C8C",
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

  // shared square buttons
  squareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // not selected
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },

  // ✅ selected (light gray)
  squareButtonSelected: {
    backgroundColor: "#D9D9D9",
  },

  // ✅ disabled (dark gray)
  squareButtonDisabled: {
    backgroundColor: "#8C8C8C",
  },

  typeIconImg: {
    width: 26,
    height: 26,
  },

  typeIconImgDisabled: {
    opacity: 0.4,
  },

  chipRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  chip: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF", // not selected
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },

  // ✅ selected (light gray)
  chipSelected: {
    backgroundColor: "#D9D9D9",
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

  iconRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
});

export default FilterExplore;
