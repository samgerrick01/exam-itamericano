import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TodoItemProps } from "./src/app/components/todo/TodoItem";
import { DataContext } from "./src/app/utils/Context";
import StackNavigation from "./src/navigation/StackNavigation";

export default function App() {
  const [tasks, setTasks] = useState<TodoItemProps[]>([]);
  return (
    <SafeAreaProvider>
      <DataContext.Provider value={{ tasks, setTasks }}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </DataContext.Provider>
    </SafeAreaProvider>
  );
}
