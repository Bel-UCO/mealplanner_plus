// app/(app)/_layout.js
import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#FB9637",
          width: 320,
        },
        drawerActiveTintColor: "#000",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
        }}
      />

      <Drawer.Screen
        name="filter"
        options={{
          title: "Filter",
        }}
      />

      <Drawer.Screen
        name="filterexplore"
        options={{
          title: "Filter Explore",
        }}
      />

      <Drawer.Screen
        name="filtersaved"
        options={{
          title: "Filter Saved",
        }}
      />
    </Drawer>
  );
}
