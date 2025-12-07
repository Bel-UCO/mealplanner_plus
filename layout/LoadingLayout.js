import { StyleSheet, View } from "react-native";

const LoadingLayout = (props) => {


  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FB9637",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingLayout;
