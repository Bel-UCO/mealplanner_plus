import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>MEALPLANNER+</Text>

      <TouchableOpacity style={styles.button}>
        <View style={styles.content}>
          <Image
            source={require("../resource/filter.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FB9637",
    flexDirection: "row", // put text & icon in a row
    alignItems: "center", // vertically center them
    justifyContent: "space-between",
    borderBottomWidth: 3, // white line at bottom
    borderBottomColor: "#FFFFFF",
  },
  headerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000", // make sure icon is black
  },
});

export default Header;
