import { Tabs } from "expo-router";
import Header from "../../../component/header";
import { Image, View } from "react-native";

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
            <View style={{ paddingTop: 10 }}>
              <Image
                source={require("../../../resource/randomize.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
          ),
          tabBarLabel: () => null,
          header: () => <Header />,
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
          header: () => <Header />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <View style={{ paddingTop: 10 }}>
              <Image
                source={require("../../../resource/profile.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
          ),
          tabBarLabel: () => null,
          header: () => <Header />,
        }}
      />

      {/* detail route: part of tabs nav, but NOT shown in tab bar */}
      <Tabs.Screen
        name="recipe/[id]"
        options={{
          href: null,
          headerTitle: "Recipe Detail",
        }}
      />
      <Tabs.Screen
        name="savedrecipe/list"
        options={{
          href: null,
          headerTitle: "Saved Recipe",
        }}
      />
    </Tabs>
  );
}
