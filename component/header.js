import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();

  const openFilter = () => {
    // Navigate to the filter "drawer" screen
    router.push("/filter");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>MEALPLANNER+</Text>

      <TouchableOpacity style={styles.button} onPress={openFilter}>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 3,
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
    tintColor: "#000",
  },
  // optional, if you want touch area styles:
  button: {
    padding: 4,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
