import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import GuestLayout from "../layout/GuestLayout";

const Login = () => {
  return (
    <GuestLayout>
      <Image source={require("../resource/mealplanner.png")}></Image>
      <TouchableOpacity style={styles.button}>
        <View style={styles.content}>
          <Image
            source={require("../resource/google.png")}
            style={styles.icon}
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
    elevation: 3, // Android shadow
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default Login;
