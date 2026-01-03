// ProfileButtonsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useRouter } from "expo-router";
import useToken from "../../../util/useToken";
import api from "../../../util/api";

const ProfileButtonsScreen = () => {
  const { clearToken } = useToken();

  const [user, setUser] = useState();

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/user");
    setUser(res.data);
  };

  return (
    <AuthenticatedLayout>
      <View style={styles.screen}>
        {/* Email row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>{user?.email}</Text>
          <Image source={require("../../../resource/Profile.png")} size={24} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Saved recipe row */}
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            router.push({
              pathname: "/savedrecipe/list",
            })
          }
        >
          <Text style={styles.rowText}>SAVED RECIPE</Text>
          <Image source={require("../../../resource/Saved.png")} size={24} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Logout row */}
        <TouchableOpacity
          style={styles.row}
          onPress={async () => {
            await clearToken();
          }}
        >
          <Text style={styles.rowText}>LOGOUT</Text>
          <Image source={require("../../../resource/Logout.png")} size={24} />
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
    width: "100%",
  },
  listContainer: {
    borderWidth: 1, // thin outer border
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
    height: 1, // thin line between rows
    backgroundColor: "#000",
  },
});
