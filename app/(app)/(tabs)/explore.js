import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

export default function Explore() {
  return (
    <AuthenticatedLayout>
      <Text>Explore</Text>
      <StatusBar style="auto" />
    </AuthenticatedLayout>
  );
}