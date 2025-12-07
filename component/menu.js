import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Menu = ({ id, image_url, name }) => {
  return (
    <TouchableOpacity>
      <Image></Image>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  card: {
    borderWidth: "5px",
    borderRadius: "15px",
  },
});

export default Menu;
