import { StyleSheet, View } from "react-native";

const LoadingLayout = (props) => {


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

export default LoadingLayout;
