import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import GuestLayout from "../layout/GuestLayout";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { API_BASE_URL } from "../util/api";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const base = API_BASE_URL.replace(/\/$/, "");

      // 👉 Expo will turn this into something like:
      // exp://192.168.1.11:8081/--/login-callback
      const redirectBack = Linking.createURL("login-callback");
      console.log("Redirect back URL:", redirectBack);

      const authUrl =
        `${base}/auth/google/redirect` +
        `?redirect_back=${encodeURIComponent(redirectBack)}`;

      console.log("Opening auth URL:", authUrl);

      await WebBrowser.openBrowserAsync(authUrl);
    } catch (e) {
      console.log("Google web login error:", e?.message || e);
      Alert.alert("Login failed", "Could not start Google login");
    }
  };

  return (
    <GuestLayout>
      <Image source={require("../resource/mealplanner.png")} />

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <View style={styles.content}>
          <Image
            source={require("../resource/google.png")}
            style={{ width: 22, height: 22, marginRight: 10 }}
          />
          <Text style={styles.text}>CONTINUE WITH GOOGLE</Text>
        </View>
      </TouchableOpacity>
    </GuestLayout>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default Login;
