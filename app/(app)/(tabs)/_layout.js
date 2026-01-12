import { Tabs, useRouter } from "expo-router";
import Header from "../../../component/header";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";

// screen layout and navigation for main app for authenticated users
export default function Layout() {
  const router = useRouter();

  const BackHeader = ({ title }) => {
    return (
      <View style={styles.header}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerText}>{title}</Text>

          {/* keep spacing similar to Header (right side area) */}
          <View style={styles.rightIcons} />
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerStyle: { backgroundColor: "#FB9637" },
        headerShadowVisible: false,
        headerTintColor: "#000",
        tabBarStyle: { backgroundColor: "#FB9637" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <View style={{ paddingTop: 10 }}>
              <Image
                source={require("../../../resource/randomize.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
          ),
          tabBarLabel: () => null,
          header: () => (
            <Header headText="MEALPLANNER+" filterRoute="/filter" />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: () => (
            <View style={{ paddingTop: 10 }}>
              <Image
                source={require("../../../resource/explore.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
          ),
          tabBarLabel: () => null,
          header: () => (
            <Header headText="EXPLORE" filterRoute="/filterexplore" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <View style={{ paddingTop: 10 }}>
              <Image
                source={require("../../../resource/Profile.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
          ),
          tabBarLabel: () => null,
          header: () => <Header headText="SETTING" />,
        }}
      />

      {/* hidden tab route */}
      <Tabs.Screen
        name="recipe/[id]"
        options={{
          href: null,
          header: () => <BackHeader title="Recipe Detail" />,
        }}
      />

      <Tabs.Screen
        name="savedrecipe/list"
        options={{
          href: null,
          header: () => (
            <Header headText="SAVED RECIPE" filterRoute="/filtersaved" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // ✅ SAME AS YOUR Header component
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FB9637",
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },

  // ✅ SAME spacing as Header
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // keeps layout consistent with Header (right side placeholder)
  rightIcons: {
    marginLeft: "auto",
  },

  // ✅ SAME text style as Header
  headerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },

  // back arrow matching icon size visually
  backArrow: {
    fontSize: 28, // slightly bigger so it looks like an icon
    color: "#000",
    lineHeight: 28,
  },

  // ✅ SAME button padding as Header
  button: {
    padding: 4,
  },

  // if you switch to an Image back icon later
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
});
