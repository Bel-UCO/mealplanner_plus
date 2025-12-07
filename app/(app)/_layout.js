// app/(app)/_layout.tsx
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
      {/* Main content → Tabs group */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
        }}
      />

      {/* Filter sidebar screen */}
      <Drawer.Screen
        name="filter"
        options={{
          title: "Filter",
        }}
      />
    </Drawer>
  );
}
