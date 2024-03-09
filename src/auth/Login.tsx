import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { NavigationProp, StackActions } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebaseConfig";
import Modal from "../app/components/reusable-modal";
import { IModalProps } from "../app/utils/interface";

export interface LoginProps {
  navigation: NavigationProp<any>;
}

export default function Login({ navigation }: LoginProps) {
  //local state
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //Modal state
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IModalProps>({
    title: "",
    children: "",
    confirmModal: false,
  });
  //login function
  async function registerAndLogin() {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      setModalData({
        title: "Ooops!",
        children: "Please fill in all fields.",
        confirmModal: false,
      });
      setOpenModal(true);
    } else {
      try {
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        navigation.dispatch(StackActions.replace("home"));
        return;
      } catch (error: any) {
        setLoading(false);
        setModalData({
          title: "Ooops!",
          children: error.message,
          confirmModal: false,
        });
        setOpenModal(true);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Image
          source={require("../../assets/todo_banner.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          autoComplete="off"
        />
        <TextInput
          style={[styles.input, { marginTop: 15 }]}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={registerAndLogin}>
          {loading ? (
            <ActivityIndicator
              size={"small"}
              color={"white"}
              animating={loading}
            />
          ) : (
            <Text style={{ color: "white" }}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.register}>
          <Text style={styles.link}>Don't have an account? </Text>
          <Text
            style={[styles.link, { color: "teal" }]}
            onPress={() => navigation.navigate("register")}
          >
            Register
          </Text>
        </View>
        <Modal
          props={{
            openModal,
            children: modalData.children,
            title: modalData.title,
            setOpenModal,
            confirmModal: modalData.confirmModal,
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 15,
    color: "gray",
  },
  register: {
    marginTop: 25,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginBottom: 40,
    width: 380,
    height: 200,
    alignSelf: "center",
  },
  button: {
    width: "90%",
    height: 45,
    backgroundColor: "teal",
    borderRadius: 6,
    marginTop: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: 45,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
