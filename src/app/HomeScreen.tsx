import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, StackActions } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React, { useContext, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import app from "../../firebaseConfig";
import { createTodoTask } from "./firebase/firestore/create";
import { fetchOnlyMyTodoList } from "./firebase/firestore/read";
import { updateItemText } from "./firebase/firestore/update";
import Empty from "./todo/Empty";
import TodoItem from "./todo/TodoItem";
import { DataContext } from "./utils/Context";
import { sortItemsByPrio } from "./utils/SortTodos";

export interface LoginProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: LoginProps) {
  //firebase auth
  const user = getAuth(app).currentUser;

  //context
  const { tasks, setTasks } = useContext(DataContext);

  //local state
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [todo, setTodo] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editID, setEditID] = useState<string>("");

  //memoized value
  const sortedTodos = useMemo(() => {
    return sortItemsByPrio(tasks);
  }, [tasks]);

  // add and edit task function
  async function addToList() {
    if (todo.length < 3) {
      return;
    }

    if (isEdit && editID && todo !== "") {
      try {
        setLoading(true);
        const index = tasks.findIndex((task) => task.docId === editID);
        const updatedTasks = [...tasks];
        updatedTasks[index].todo = todo;
        setTasks(updatedTasks);

        await updateItemText(editID, todo);
        setIsEdit(false);
        setEditID("");
        setTodo("");
      } catch (error: any) {
        Alert.alert("Something went wrong", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        if (!user) return;
        const addedTask = await createTodoTask({
          todo,
          ownerId: user.uid,
          isCompleted: false,
          isPriority: false,
        });

        const todoItem = {
          completed: false,
          todo,
          ownerId: user?.uid,
          docId: addedTask.id,
        };
        setTasks(() => [todoItem, ...tasks]);
        setTodo("");
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  }

  //logout function
  const logOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Yes",
        onPress: () => {
          getAuth(app).signOut();
          navigation.dispatch(StackActions.replace("login"));
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
  };

  //fetch data from firestore
  async function getMyTodosInDB() {
    setGetLoading(true);
    if (!user) return;
    const result = await fetchOnlyMyTodoList(user.uid);
    const myTodos = result.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setTasks(myTodos);
    setGetLoading(false);
  }

  //useLayoutEffect to fetch data from firestore
  useLayoutEffect(() => {
    getMyTodosInDB();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.greeting}>
          Hello,{" "}
          <Text style={{ color: "teal" }}>{user?.displayName || "user"}</Text>
        </Text>
        <Text onPress={logOut} style={styles.greeting}>
          Log Out
        </Text>
      </View>
      <Text>{`Total task: ${sortedTodos.length}`}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Add some task here..."
          onEndEditing={addToList}
          returnKeyType="done"
          onChangeText={setTodo}
          defaultValue={todo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={addToList}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating={loading} color={"white"} />
          ) : isEdit ? (
            <MaterialIcons name="update" size={30} color="white" />
          ) : (
            <MaterialIcons name="add" size={30} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {getLoading && (
        <ActivityIndicator
          style={{ marginTop: 100 }}
          size="large"
          color="teal"
        />
      )}
      {!getLoading && (
        <FlatList
          data={sortedTodos}
          renderItem={({ item, index }) => (
            <TodoItem
              data={{ ...item, setTodo, setIsEdit, setEditID }}
              key={item.docId}
            />
          )}
          ListEmptyComponent={Empty}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 15,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
    fontStyle: "italic",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "teal",
    height: 60,
    width: "18%",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    columnGap: 10,
  },
  input: {
    height: 60,
    borderRadius: 8,
    width: "80%",
    backgroundColor: "white",
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: "rgba(0,0,0,0.6)",
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
