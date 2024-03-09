import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface FilterBtnsProps {
  setTab: React.Dispatch<React.SetStateAction<"All" | "Todo" | "Finished">>;
  tab: "All" | "Todo" | "Finished";
}

const index = (props: FilterBtnsProps) => {
  //check if the tab is active
  const isActive = (val: string) => {
    let style = {};
    if (val === props.tab) {
      style = {
        width: "33.3%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#06bcee",
      };
    } else {
      style = {
        width: "33.3%",
        justifyContent: "center",
        alignItems: "center",
      };
    }
    return style;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => props.setTab("All")}
        style={isActive("All")}
      >
        <Text style={styles.filterBtnText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.setTab("Todo")}
        style={isActive("Todo")}
      >
        <Text style={styles.filterBtnText}>Todo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.setTab("Finished")}
        style={isActive("Finished")}
      >
        <Text style={styles.filterBtnText}>Finished</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  filterBtnText: {
    color: "#06bcee",
    fontSize: 18,
    fontWeight: "bold",
  },
});
