import { StyleSheet, View } from "react-native";

const AuthenticatedLayout = (props) => {
  const localStorage = ""


  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AuthenticatedLayout;
