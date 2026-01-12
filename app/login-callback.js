import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../util/useToken";

// login route to set token and reroute and logout route
export default function LoginCallback() {
  const { token } = useLocalSearchParams();
  const { saveToken } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!token) {
        console.log("No token in login-callback URL");
        Alert.alert("Login failed", "No token returned from backend");
        router.replace("/"); // or your login route
        return;
      }

      try {
        console.log("Saving token from deep link:", token);
        await saveToken(String(token));

        // Navigate to your logged-in area
        router.replace("/(app)/(tabs)"); // back to login/home
      } catch (e) {
        console.log("Error saving token:", e);
        Alert.alert("Login failed", "Could not save login token");
        router.replace("/"); // back to login/home
      }
    };

    run();
  }, [token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.text}>Finishing login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});
