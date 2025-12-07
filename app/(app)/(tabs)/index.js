import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

export default function Home() {
  return (
    <AuthenticatedLayout>
      <Text>Home Screen</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </AuthenticatedLayout>
  );
}