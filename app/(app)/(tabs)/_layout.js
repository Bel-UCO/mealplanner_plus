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
          tabBarIcon: ({ color, focused }) => {
            return <Image source={require("../../../resource/randomize.png")}></Image>
          },
          tabBarLabel:()=>null,
          header:()=><Header></Header>
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => {
            return <Image source={require("../../../resource/explore.png")}></Image>

          },
          tabBarLabel:()=>null,
          header:()=><Header></Header>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => {
            return <Image source={require("../../../resource/profile.png")}></Image>
          },
          tabBarLabel:()=>null,
          header:()=><Header></Header>
        }}
      />
    </Tabs>
  );
}
