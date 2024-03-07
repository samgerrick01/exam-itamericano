import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { DataContext } from "../utils/Context";
import { updatePrioItem, updateStatusItem } from "../firebase/firestore/update";
import { deleteMyTodoItem } from "../firebase/firestore/delete";

export interface TodoItemProps {
  createdAt?: Timestamp;
  completedAt?: Timestamp | string;
  docId: string;
  todo: string;
  isCompleted: boolean;
  isPriority: boolean;
  ownerId: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  setEditID: React.Dispatch<React.SetStateAction<string>>;
}

export default function TodoItem({ data }: { data: TodoItemProps }) {
  const {
    todo,
    isCompleted,
    docId,
    isPriority,
    setIsEdit,
    setTodo,
    setEditID,
  } = data;
  const [priority, setPriority] = useState<boolean>(isPriority);
  const [completed, setCompleted] = useState<boolean>(isCompleted);

  const { tasks, setTasks } = useContext(DataContext);

  const checkAsPrio = async () => {
    try {
      const index = tasks.findIndex((task) => task.docId === docId);
      const updatedTasks = [...tasks];
      updatedTasks[index].isPriority = !updatedTasks[index].isPriority;
      setTasks(updatedTasks);
      setPriority(!priority);
      await updatePrioItem(docId, !isPriority);
    } catch (error: any) {
      Alert.alert("Something went wrong", error.message);
    }
  };

  const checkAsCompleted = async () => {
    try {
      const index = tasks.findIndex((task) => task.docId === docId);
      const updatedTasks = [...tasks];
      updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
      setTasks(updatedTasks);
      setCompleted(!completed);
      await updateStatusItem(docId, !isCompleted);
    } catch (error: any) {
      Alert.alert("Something went wrong", error.message);
    }
  };

  const handleEdit = () => {
    setTodo(todo);
    setIsEdit(true);
    setEditID(docId);
  };

  const deleteMyTodo = async () => {
    try {
      const updatedTasks = tasks.filter((t) => t.docId !== docId);
      setTasks(updatedTasks);
      await deleteMyTodoItem(docId);
    } catch (error: any) {
      Alert.alert("Something went wrong", error.message);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onLongPress={() => {
          Alert.alert(
            "Alert",
            "You are trying to delete this todo, Would you like to continue?",
            [
              { text: "Cancel", onPress: () => null },
              { text: "Delete", style: "destructive", onPress: deleteMyTodo },
            ]
          );
        }}
      >
        <Pressable onPress={checkAsPrio}>
          <MaterialCommunityIcons
            name={priority ? "checkbox-marked" : "checkbox-blank-outline"}
            size={28}
            color={priority ? "teal" : "gray"}
          />
        </Pressable>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <Text
            onPress={checkAsCompleted}
            style={isCompleted && { textDecorationLine: "line-through" }}
          >
            {todo}
          </Text>
          <FontAwesome
            onPress={handleEdit}
            name="edit"
            size={24}
            color="gray"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  todo: {},

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
  },
});
