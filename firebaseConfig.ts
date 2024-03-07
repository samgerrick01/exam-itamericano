import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPrzh4ZwaMIdrQhYVXncz4N5nFZqqaYRs",
  authDomain: "todoappv1-90360.firebaseapp.com",
  databaseURL:
    "https://todoappv1-90360-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todoappv1-90360",
  storageBucket: "todoappv1-90360.appspot.com",
  messagingSenderId: "619705064929",
  appId: "1:619705064929:web:398df5e41f2bf0a75886a0",
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
getFirestore(app);

export default app;
