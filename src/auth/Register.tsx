import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import app from "../../firebaseConfig";
import Modal from "../app/components/reusable-modal";
import { IModalProps } from "../app/utils/interface";
import { LoginProps } from "./Login";

export default function Register({ navigation }: LoginProps) {
  //local state
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  //Modal state
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IModalProps>({
    title: "",
    children: "",
    confirmModal: false,
  });
  //register user function
  async function registerUser() {
    setLoading(true);
    if (!email || !password || !userName) {
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
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(response.user, { displayName: userName });
        setLoading(false);
        setModalData({
          title: "Success",
          children: "Account created successfully please login to continue.",
          confirmModal: true,
          okAction: () => navigation.navigate("login"),
        });
        setOpenModal(true);
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
    <View style={styles.container}>
      <Image
        source={require("../../assets/todo_banner.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize={"none"}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Username"
        onChangeText={setUserName}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={registerUser}>
        {loading ? (
          <ActivityIndicator
            size={"small"}
            color={"white"}
            animating={loading}
          />
        ) : (
          <Text style={{ color: "white" }}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.register}>
        <Text style={styles.link}>Have an account already? </Text>
        <Text
          style={[styles.link, { color: "teal" }]}
          onPress={() => navigation.navigate("login")}
        >
          login
        </Text>
      </View>
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
