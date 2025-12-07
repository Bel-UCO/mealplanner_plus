import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";

const Menu = ({ title, image, onPress }) => {
  console.log(image);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <Image source={{uri:"https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/"+ image}} style={styles.image} resizeMode="cover" />
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
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 140,
  },
  textBar: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.6)", // grey/black bar like the example
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Menu;
