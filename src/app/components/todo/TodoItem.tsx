import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "../reusable-modal";
import { deleteMyTodoItem } from "../../firebase/delete";
import { updatePrioItem, updateStatusItem } from "../../firebase/update";
import { DataContext } from "../../utils/Context";
import { IModalProps } from "../../utils/interface";

//interface for the todo item
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
  //destructure the props
  const {
    todo,
    isCompleted,
    docId,
    isPriority,
    setIsEdit,
    setTodo,
    setEditID,
  } = data;

  //local state
  const [priority, setPriority] = useState<boolean>(isPriority);
  const [completed, setCompleted] = useState<boolean>(isCompleted);

  //Modal state
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IModalProps>({
    title: "",
    children: "",
    confirmModal: false,
  });

  //context
  const { tasks, setTasks } = useContext(DataContext);

  //check as priority function
  const checkAsPrio = async () => {
    try {
      const index = tasks.findIndex((task) => task.docId === docId);
      const updatedTasks = [...tasks];
      updatedTasks[index].isPriority = !updatedTasks[index].isPriority;
      setTasks(updatedTasks);
      setPriority(!priority);
      await updatePrioItem(docId, !isPriority);
    } catch (error: any) {
      setModalData({
        title: "Ooops!",
        children: error.message,
        confirmModal: false,
      });
      setOpenModal(true);
    }
  };

  //check as completed function
  const checkAsCompleted = async () => {
    try {
      const index = tasks.findIndex((task) => task.docId === docId);
      const updatedTasks = [...tasks];
      updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
      setTasks(updatedTasks);
      setCompleted(!completed);
      await updateStatusItem(docId, !isCompleted);
    } catch (error: any) {
      setModalData({
        title: "Ooops!",
        children: error.message,
        confirmModal: false,
      });
      setOpenModal(true);
    }
  };

  //edit function
  const handleEdit = () => {
    setTodo(todo);
    setIsEdit(true);
    setEditID(docId);
  };

  //delete function
  const deleteMyTodo = async () => {
    try {
      const updatedTasks = tasks.filter((t) => t.docId !== docId);
      setTasks(updatedTasks);
      await deleteMyTodoItem(docId);
    } catch (error: any) {
      setModalData({
        title: "Ooops!",
        children: error.message,
        confirmModal: false,
      });
      setOpenModal(true);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onLongPress={() => {
          setModalData({
            title: "Delete Todo?",
            children:
              "You are trying to delete this todo, Would you like to continue?",
            confirmModal: true,
            okAction: deleteMyTodo,
          });
          setOpenModal(true);
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
            numberOfLines={1}
            onPress={checkAsCompleted}
            style={{
              ...(isCompleted && { textDecorationLine: "line-through" }),
              ...styles.todo,
            }}
          >
            {todo}
          </Text>
          <FontAwesome
            onPress={handleEdit}
            name="edit"
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Modal
        props={{
          openModal,
          setOpenModal,
          ...modalData,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  todo: {
    fontSize: 18,
  },

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
