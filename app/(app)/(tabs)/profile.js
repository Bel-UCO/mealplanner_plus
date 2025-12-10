// ProfileButtonsScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";        // for user & heart
import MaterialIcon from "react-native-vector-icons/MaterialIcons"; // for logout
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

const ProfileButtonsScreen = () => {
  const email = "KENNY******@gmail.com";

  return (
    <AuthenticatedLayout>
      <View style={styles.screen}>
        {/* Email row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>{email}</Text>
          <Icon name="user" size={22} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Saved recipe row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>SAVED RECIPE</Text>
          <Icon name="heart" size={24} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Logout row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>LOGOUT</Text>
          <MaterialIcon name="logout" size={24} />
        </TouchableOpacity>
      </View>
    </AuthenticatedLayout>
  );
};

export default ProfileButtonsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    width:"100%"
  },
  listContainer: {
    borderWidth: 1,           // thin outer border
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rowText: {
    fontSize: 16,
    color: "#000",
  },
  separator: {
    height: 1,                // thin line between rows
    backgroundColor: "#000",
  },
});
