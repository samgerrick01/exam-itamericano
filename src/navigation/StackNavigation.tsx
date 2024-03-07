import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../app/HomeScreen";
import Login from "../auth/Login";
import Register from "../auth/Register";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "Login Screen", headerTitleAlign: "center" }}
      />

      <Stack.Screen
        name="register"
        component={Register}
        options={{
          presentation: "modal",
          title: "Create Account",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}
