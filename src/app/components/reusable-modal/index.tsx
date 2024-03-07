import {
  StyleSheet,
  Text,
  View,
  Modal as RNModal,
  TouchableOpacity,
} from "react-native";
import React from "react";

interface ModalProps {
  title: string;
  openModal: boolean;
  children: React.ReactNode;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmModal: boolean;
  okAction?: () => void;
}

export default function Modal({ props }: { props: ModalProps }) {
  const { openModal, children, setOpenModal, title, confirmModal, okAction } =
    props;
  return (
    <RNModal
      visible={openModal}
      statusBarTranslucent={true}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{children}</Text>
          <View style={styles.btnWrapper}>
            {confirmModal && (
              <TouchableOpacity style={[styles.btnOk]} onPress={okAction}>
                <Text style={styles.text}>Okay</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.buttonCLose,
                !confirmModal ? { width: "100%" } : { width: "48%" },
              ]}
              onPress={() => setOpenModal(false)}
            >
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
    marginBottom: 12,
  },
  desc: {
    fontSize: 18,
    lineHeight: 24,
    opacity: 0.7,
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnOk: {
    marginTop: 24,
    width: "48%",
    backgroundColor: "#79d2d1",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 8,
  },
  buttonCLose: {
    marginTop: 24,
    backgroundColor: "#ff6666",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 8,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
});
