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

const DIET_DISABLED_CATEGORY_IDS = {
  vegan: [1, 2, 3, 4, 5, 12, 13, 14], // meat/poultry/seafood/processed/egg/dairy
  vegetarian: [1, 2, 3, 4, 12, 14], // meat/poultry/seafood/processed
};

const FilterExplore = () => {
  const router = useRouter();
  const { filterRecipeExplore, saveFilterRecipeExplore } =
    useFilterRecipeExplore();

  const [filterObject, setFilterObject] = useState(filterRecipeExplore);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const [disabledCategoryIds, setDisabledCategoryIds] = useState([]);
  const disabledCategorySet = useMemo(
    () => new Set(disabledCategoryIds),
    [disabledCategoryIds]
  );

  useEffect(() => {
    const diet = filterObject?.diet || "";
    const disabled = DIET_DISABLED_CATEGORY_IDS[diet] || [];
    setDisabledCategoryIds(disabled);

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
    { id: 7, icon: require("../../resource/Vegetable.png"), label: "Vegetable" },
    { id: 8, icon: require("../../resource/Fruit.png"), label: "Fruit" },
    { id: 9, icon: require("../../resource/Root.png"), label: "Root Vegetable" },
    { id: 10, icon: require("../../resource/Peanut.png"), label: "Nut & Seed" },
    { id: 11, icon: require("../../resource/Flour.png"), label: "Dry Ingredient" },
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
    { id: 4, icon: require("../../resource/Microwave.png"), label: "Microwave" },
    { id: 5, icon: require("../../resource/Oven.png"), label: "Oven" },
    { id: 6, icon: require("../../resource/Grinder.png"), label: "Grinder" },
    { id: 7, icon: require("../../resource/Shaker.png"), label: "Shaker" },
  ];

  const handleSearchByPress = (value) => {
    setFilterObject((prev) => ({
      ...prev,
      search_by: value,
    }));
  };

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
    const payload = {
      ...filterObject,
      search_by: filterObject.search_by || "explore",
    };

    saveFilterRecipeExplore(payload);
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
            styles.squareButton,
            isSelected && styles.squareButtonSelected,
            isDisabled && styles.squareButtonDisabled,
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

    const isSelected = filterObject.utensils.includes(id);

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
            isSelected && styles.squareButtonSelected,
          ]}
          onPress={() => toggleUtensil(id)}
          onLongPress={() => setShowTip(true)}
          delayLongPress={250}
        >
          <Image source={icon} style={styles.typeIconImg} resizeMode="contain" />
        </TouchableOpacity>
      </Tooltip>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FILTER</Text>
        </View>
        <View style={styles.divider} />

        {/* ✅ NEW: SEARCH BY (like Filter) */}
        <Text style={styles.sectionTitle}>SEARCH BY</Text>
        <View style={styles.searchByRow}>
          <TouchableOpacity
            style={styles.searchByItem}
            onPress={() => handleSearchByPress("explore")}
          >
            <View style={styles.radioOuter}>
              {filterObject.search_by === "explore" && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.searchByText}>EXPLORE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchByItem}
            onPress={() => handleSearchByPress("saved")}
          >
            <View style={styles.radioOuter}>
              {filterObject.search_by === "saved" && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.searchByText}>SAVED</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>DIFFICULTIES</Text>
        <View style={styles.difficultyRow}>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.difficultyItem,
                filterObject.difficulties.includes(lvl) &&
                  styles.difficultyItemActive,
              ]}
              onPress={() => toggleDifficulty(lvl)}
            >
              <View
                style={[
                  styles.checkbox,
                  filterObject.difficulties.includes(lvl) && styles.checkboxActive,
                ]}
              />
              <Text style={styles.difficultyText}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>TIME</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack} />

            <View style={styles.sliderDotsRow}>
              {[0, 1, 2, 3, 4].map((i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.sliderDotOuter,
                    selectedTimeIndex === i && styles.sliderDotOuterActive,
                  ]}
                  onPress={() => handleTimePress(i)}
                >
                  {selectedTimeIndex === i && <View style={styles.sliderDotInner} />}
                </TouchableOpacity>
              ))}
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
          {[
            { key: "Breakfast", icon: require("../../resource/Breakfast.png") },
            { key: "Lunch", icon: require("../../resource/Lunch.png") },
            { key: "Dinner", icon: require("../../resource/Dinner.png") },
            { key: "Dessert", icon: require("../../resource/Dessert.png") },
            { key: "Drink", icon: require("../../resource/Drink.png") },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.squareButton,
                filterObject.type.includes(t.key) && styles.squareButtonSelected,
              ]}
              onPress={() => handleTypePress(t.key)}
            >
              <Image source={t.icon} style={styles.typeIconImg} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>DIET</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, filterObject.diet === "vegan" && styles.chipSelected]}
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

        <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
          <Text style={styles.applyText}>APPLY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORANGE },
  scroll: { paddingTop: 36, paddingHorizontal: 18, paddingBottom: 160 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backArrow: { fontSize: 22, marginRight: 12, color: "#000" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  divider: { height: 1, backgroundColor: "#000", marginBottom: 16 },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  searchByRow: { flexDirection: "row", marginBottom: 8 },
  searchByItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#000" },
  searchByText: { fontSize: 12, fontWeight: "bold", color: "#000" },

  difficultyRow: { flexDirection: "row", marginBottom: 4 },
  difficultyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  difficultyItemActive: { backgroundColor: "#8C8C8C" },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 6,
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: { backgroundColor: "#000000" },
  difficultyText: { fontSize: 12, color: "#000" },

  sliderContainer: { marginTop: 4 },
  sliderWrapper: { height: 18, justifyContent: "center" },
  sliderTrack: { height: 3, borderRadius: 2, backgroundColor: "#FFF" },
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
  sliderDotOuterActive: { borderColor: "#1BA1FF" },
  sliderDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1BA1FF" },
  timeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeLabel: { fontSize: 10, color: "#000" },

  typeRow: { flexDirection: "row", marginTop: 4, marginBottom: 4 },

  squareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  squareButtonSelected: { backgroundColor: "#D9D9D9" },
  squareButtonDisabled: { backgroundColor: "#8C8C8C" },

  typeIconImg: { width: 26, height: 26 },
  typeIconImgDisabled: { opacity: 0.4 },

  chipRow: { flexDirection: "row", marginTop: 4 },
  chip: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipSelected: { backgroundColor: "#D9D9D9" },
  chipText: { fontSize: 12, fontWeight: "bold", color: "#000" },

  iconGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  iconRow: { flexDirection: "row", marginBottom: 8 },

  applyButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
  },
  applyText: { fontSize: 14, fontWeight: "bold", color: "#000" },
});

export default FilterExplore;
