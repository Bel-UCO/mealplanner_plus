import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { API_BASE_URL } from "../util/api";

const API_URL = API_BASE_URL + "/ingredient";

export default function AutoComplete({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);

  // Fetch full ingredient objects
  useEffect(() => {
    if (!search.trim()) {
      setOptions([]);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}?name=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );

        const json = await res.json();

        // store full objects
        setOptions(json);
      } catch (err) {
        console.log("ingredient fetch error", err);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  const handleSelect = (item) => {
    // Only add if not already selected
    if (!value.find((v) => v.id === item.id)) {
      const newSelected = [...value, item];
      onChange && onChange(newSelected);
    }
    setSearch("");
    setOpen(false);
  };

  const handleRemove = (removedItem) => {
    const newSelected = value.filter((v) => v.id !== removedItem.id);
    onChange && onChange(newSelected);
  };

  // Filter by object.name
  const filtered = options.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.wrapper}>
      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputArea}
          onPress={() => setOpen(!open)}
        >
          {value.length > 0 ? (
            <View style={styles.chipContainer}>
              {value.map((item) => (
                <View key={item.id} style={styles.chip}>
                  <Text style={styles.chipText}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <Text style={styles.chipClose}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <TextInput
              placeholder="Search ingredient..."
              value={search}
              onChangeText={(t) => {
                setSearch(t);
                if (!open) setOpen(true);
              }}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      {open && (
        <View style={styles.dropdown}>
          {value.length === 0 && (
            <TextInput
              autoFocus
              placeholder="Search ingredient..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchBar}
              placeholderTextColor="#aaa"
            />
          )}

          {/* 🔁 Use ScrollView instead of FlatList */}
          <ScrollView
            style={{ maxHeight: 180 }}
            keyboardShouldPersistTaps="handled"
          >
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  plusButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  plusText: { fontSize: 16 },
  inputArea: { flex: 1 },
  input: { fontSize: 16, color: "#000" },
  arrow: { fontSize: 18, paddingLeft: 8 },

  dropdown: {
    backgroundColor: "#FFF",
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
    elevation: 3,
  },
  searchBar: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  item: { padding: 12 },
  itemText: { fontSize: 16 },

  chipContainer: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  chipText: { fontSize: 14, marginRight: 6 },
  chipClose: { fontSize: 16 },
});
