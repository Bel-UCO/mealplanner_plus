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
  const [filterObject,setFilterObject] = useState({difficulties:"",ingredients:"",ingredient_categories:"",utensils:"",diet:"",time:30});
  const router = useRouter();
  const { saveFilterRecipe } = useFilterRecipe()

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
          <View style={styles.difficultyItem}>
            <View style={styles.checkbox} />
            <Text style={styles.difficultyText}>1</Text>
          </View>
          <View style={styles.difficultyItem}>
            <View style={styles.checkbox} />
            <Text style={styles.difficultyText}>2</Text>
          </View>
          <View style={styles.difficultyItem}>
            <View style={styles.checkbox} />
            <Text style={styles.difficultyText}>3</Text>
          </View>
          <View style={styles.difficultyItem}>
            <View style={styles.checkbox} />
            <Text style={styles.difficultyText}>4</Text>
          </View>
          <View style={styles.difficultyItem}>
            <View style={styles.checkbox} />
            <Text style={styles.difficultyText}>5</Text>
          </View>
        </View>

        {/* TIME */}
        <Text style={styles.sectionTitle}>TIME</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack} />

            {/* 5 Dots on the track */}
            <View style={styles.sliderDotsRow}>
              <View style={[styles.sliderDotOuter, styles.sliderDotOuterActive]}>
                <View style={styles.sliderDotInner} />
              </View>
              <View style={styles.sliderDotOuter} />
              <View style={styles.sliderDotOuter} />
              <View style={styles.sliderDotOuter} />
              <View style={styles.sliderDotOuter} />
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
          <TouchableOpacity style={styles.typeButton}>
            <Image source={require("../../resource/Breakfast.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeButton}>
            <Image source={require("../../resource/Lunch.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeButton}>
            <Image source={require("../../resource/Dinner.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeButton}>
            <Image source={require("../../resource/Dessert.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeButton}>
            <Image source={require("../../resource/Drink.png")}></Image>
          </TouchableOpacity>
        </View>

        {/* DIET */}
        <Text style={styles.sectionTitle}>DIET</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>VEGAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>VEGETARIAN</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <View style={styles.iconGrid}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍽</Text>
          </TouchableOpacity>
        </View>

        {/* INGREDIENT */}
        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        <View style={styles.ingredientWrapper}>
          <View style={styles.ingredientPill}>
            <Text style={styles.ingredientText}>MELON</Text>
          </View>

          <View style={styles.ingredientPlusCircle}>
            <Text style={styles.ingredientPlus}>+</Text>
          </View>

          <Text style={styles.dropdownArrow}>⌵</Text>
        </View>

        {/* UTENSIL */}
        <Text style={styles.sectionTitle}>UTENSIL</Text>
        <View style={styles.iconGrid}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>🍴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ORANGE,
  },
  scroll: {
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

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

  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  // Difficulties
  difficultyRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  difficultyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 6,
    backgroundColor: "#FFF",
  },
  difficultyText: {
    fontSize: 12,
    color: "#000",
  },

  // Time slider
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
  },
  sliderDotOuterActive: {
    borderColor: "#1BA1FF",
    justifyContent: "center",
    alignItems: "center",
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

  // TYPE
  typeRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
  },
  typeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  typeIcon: {
    fontSize: 22,
  },

  // DIET chips
  chipRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  chip: {
    borderRadius: 18,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  // ICON GRID
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  iconPlaceholder: {
    fontSize: 18,
  },

  // INGREDIENT
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
    backgroundColor: "#E0E0E0",
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
});

export default Filter;
