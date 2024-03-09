import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
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
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RightActions } from "./RightActions";

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
      if (!isPriority) return;
      checkAsPrio();
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
    <Swipeable
      friction={3}
      leftThreshold={80}
      rightThreshold={40}
      renderRightActions={(dragAnimatedValue) => (
        <RightActions
          dragAnimatedValue={dragAnimatedValue}
          onDelete={deleteMyTodo}
          onEdit={handleEdit}
          onPrio={checkAsPrio}
          isPriority={isPriority}
          isCompleted={isCompleted}
        />
      )}
    >
      <View style={isPriority ? styles.prioCard : styles.card}>
        <TouchableOpacity style={styles.row}>
          <Pressable onPress={checkAsCompleted}>
            <MaterialCommunityIcons
              name={
                isCompleted
                  ? "checkbox-marked-circle-outline"
                  : "checkbox-blank-circle-outline"
              }
              size={28}
              color={isCompleted ? "teal" : "gray"}
            />
          </Pressable>
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                isCompleted && {
                  color: "lightgray",
                  textDecorationLine: "line-through",
                },
                styles.todoText,
              ]}
            >
              {todo}
            </Text>
            {isPriority && (
              <AntDesign name="exclamationcircle" size={24} color="red" />
            )}
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
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  todoText: {
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
  prioCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#db5353",
    padding: 12,
    borderRadius: 4,
  },
});
