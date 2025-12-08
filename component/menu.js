import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Menu = ({ title, image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri:
              "https://xsaajlpecgffmsbllgby.supabase.co/storage/v1/object/public/mealplanner/" +
              image,
          }}
          style={styles.image}
          resizeMode="cover"
        />

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
    width:"100%"
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 3,
    shadowColor: "#000",
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
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Menu;
