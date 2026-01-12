import { StyleSheet, View } from "react-native";

// Layout for authenticated users
const AuthenticatedLayout = (props) => {

  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default AuthenticatedLayout;
