import { Tabs } from "expo-router";
import Header from "../../../component/header";
import { Image } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerStyle: {
          backgroundColor: "#FB9637",
        },
        headerShadowVisible: false,
        headerTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#FB9637",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <Image source={require("../../../resource/randomize.png")} />
          ),
          tabBarLabel: () => null,
          header: () => <Header />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: () => (
            <Image source={require("../../../resource/explore.png")} />
          ),
          tabBarLabel: () => null,
          header: () => <Header />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <Image source={require("../../../resource/profile.png")} />
          ),
          tabBarLabel: () => null,
          header: () => <Header />,
        }}
      />

      {/* detail route: part of tabs nav, but NOT shown in tab bar */}
      <Tabs.Screen
        name="recipe/[id]"
        options={{
          href: null,            // ← hides it from the tab bar / sitemap
          headerTitle: "Recipe Detail",
        }}
      />
    </Tabs>
  );
}
