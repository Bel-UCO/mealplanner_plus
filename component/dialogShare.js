import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { API_BASE_URL } from "../util/api";

// template share dialog component for sharing recipe via WhatsApp, Telegram, Facebook, or copying link.
export default function ShareDialog({ shareUrl, visible, onClose }) {
  const base = API_BASE_URL.replace(/\/$/, ""); // no trailing slash

  const landingUrl = `${base}/shared?redirect=${encodeURIComponent(shareUrl)}`;

  const shareToWhatsApp = async () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(landingUrl)}`;

    try {
      await Linking.openURL(waUrl);
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const shareToTelegram = async () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      landingUrl
    )}`;
    try {
      await Linking.openURL(tgUrl);
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(landingUrl);
    Alert.alert("Copied", landingUrl);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Share</Text>

          <View style={styles.row}>
            <TouchableOpacity onPress={shareToWhatsApp} style={styles.item}>
              <Image
                source={require("../resource/WhatsApp.png")}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Image
                source={require("../resource/Facebook.png")}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={shareToTelegram} style={styles.item}>
              <Image
                source={require("../resource/Telegram.png")}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={copyToClipboard} style={styles.item}>
              <Image
                source={require("../resource/Link.png")}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "70%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 10,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },

  iconImg: {
    width: 28,
    height: 28,
  },
});
