import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const categoryIcons = {
  Breakfast: require("../resource/Breakfast_Randomize.png"),
  Lunch: require("../resource/Lunch_Randomize.png"),
  Dinner: require("../resource/Dinner_Randomize.png"),
  Dessert: require("../resource/Dessert_Randomize.png"),
  Drink: require("../resource/Drink_Randomize.png"),
};

const Menu = ({
  title,
  image,
  onPress,
  recipe_category,
  locked,
  onLockPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <View style={styles.card}>
        {/* MAIN IMAGE */}
        <Image
          source={{
            uri:
              "https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/" +
              image,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {recipe_category && (
          <View style={styles.categoryWrapper}>
            <Image
              source={categoryIcons[recipe_category]}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>
        )}

        <TouchableOpacity style={styles.topRightButton} onPress={onLockPress}>
          <Image
            source={
              locked
                ? require("../resource/Locked.png")
                : require("../resource/Unlock.png")
            }
            style={styles.topRightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* TITLE BAR */}
        <View style={styles.textBar}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 8,
    width: "100%",
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: 140,
  },

  // top-left category icon
  categoryWrapper: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  categoryIcon: {
    width: 26,
    height: 26,
  },

  // ✅ top-right button
  topRightButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  topRightIcon: {
    width: 26,
    height: 26,
  },

  textBar: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
});

export default Menu;
