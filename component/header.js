import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderInput from "./headerInput";
import useFilterRecipeExplore from "../util/filterHooksExplore";
import useFilterRecipeSaved from "../util/filterHooksSaved";

// header component for something related to recipe such as explore and saved recipe
const Header = ({ headText, filterRoute }) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { filterRecipeExplore, saveFilterRecipeExplore } =
    useFilterRecipeExplore();
  const { filterRecipeSaved, saveFilterRecipeSaved } = useFilterRecipeSaved();

  const openFilter = () => {
    if (!filterRoute) return;
    router.push(filterRoute);
  };

  const onEnterPressed = () => {
    if (headText === "EXPLORE") {
      saveFilterRecipeExplore({ ...filterRecipeExplore, keyword: searchValue });
    } else if (headText === "SAVED RECIPE") {
      saveFilterRecipeSaved({ ...filterRecipeSaved, keyword: searchValue });
    }
  };

  return (
    <View style={styles.header}>
      {!showSearch ? (
        <View style={styles.row}>
          {/* ✅ BACK BUTTON ONLY FOR /filtersaved */}
          {filterRoute === "/filtersaved" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/(app)/(tabs)/profile")}
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.headerText}>{headText}</Text>

          <View style={styles.rightIcons}>
            {headText === "MEALPLANNER+" || headText === "SETTING" ? null : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowSearch(true)}
              >
                <Image
                  source={require("../resource/Search.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {filterRoute ? (
              <TouchableOpacity style={styles.button} onPress={openFilter}>
                <Image
                  source={require("../resource/filter.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowSearch(false)}
          >
            <Image
              source={require("../resource/Search.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <HeaderInput
            value={searchValue}
            onChangeText={(val) => {
              setSearchValue(val);
            }}
            onSubmit={onEnterPressed}
            placeholder="Search..."
            style={{ flex: 1 }}
          />

          {filterRoute ? (
            <TouchableOpacity style={styles.button} onPress={openFilter}>
              <Image
                source={require("../resource/filter.png")}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FB9637",
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: "auto",
  },

  headerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },

  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },

  button: {
    padding: 4,
  },

  backArrow: {
    fontSize: 28,
    color: "#000",
    lineHeight: 28,
  },
});

export default Header;
