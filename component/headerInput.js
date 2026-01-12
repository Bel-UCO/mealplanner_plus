import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

// recipe global filter input field component
const HeaderInput = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        blurOnSubmit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", flex: 1 },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
});

export default HeaderInput;
