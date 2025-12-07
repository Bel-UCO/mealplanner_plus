import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const Filter = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FILTER</Text>
        </View>
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>SEARCH BY</Text>
        <View style={styles.row}>
          <View style={styles.radioRow}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
            <Text style={styles.radioLabel}>EXPLORE</Text>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioOuter} />
            <Text style={styles.radioLabel}>SAVED</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DIFFICULTIES</Text>
        <View style={styles.difficultyRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <View key={n} style={styles.difficultyBox}>
              <Text style={styles.difficultyText}>{n}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>TIME</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.sliderDot} />
            ))}
          </View>
          <View style={styles.timeLabelRow}>
            <Text style={styles.timeLabel}>30 M</Text>
            <Text style={styles.timeLabel}>1 H</Text>
            <Text style={styles.timeLabel}>2 H</Text>
            <Text style={styles.timeLabel}>4 H</Text>
            <Text style={styles.timeLabel}>4 H+</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DIET</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>VEGAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>VEGETARIAN</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <View style={styles.iconGrid}>
          {Array.from({ length: 10 }).map((_, index) => (
            <TouchableOpacity key={index} style={styles.iconButton}>
              <Text style={styles.iconPlaceholder}>🍽</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        <View style={styles.inputRow}>
          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <Text style={styles.inputPlaceholder}>Ingredient</Text>
          <Text style={styles.dropdownArrow}>⌵</Text>
        </View>

        <Text style={styles.sectionTitle}>UTENSIL</Text>
        <View style={styles.iconGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <TouchableOpacity key={index} style={styles.iconButton}>
              <Text style={styles.iconPlaceholder}>🍴</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>APPLY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FB9637",
  },
  scroll: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 22,
    marginRight: 10,
    color: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 12,
    color: "#000",
  },
  difficultyRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  difficultyBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FB9637",
  },
  difficultyText: {
    fontSize: 12,
    color: "#000",
  },
  sliderContainer: {
    marginTop: 4,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#FDD6A5",
    borderRadius: 2,
    justifyContent: "center",
    marginVertical: 8,
  },
  sliderDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    top: -3,
  },
  timeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeLabel: {
    fontSize: 10,
    color: "#000",
  },
  chipRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  chip: {
    borderRadius: 16,
    backgroundColor: "#FDD6A5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FDD6A5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  iconPlaceholder: {
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDD6A5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FB9637",
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  plusText: {
    fontSize: 16,
    color: "#000",
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: "#555",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#000",
  },
  applyButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
  },
  applyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Filter;
