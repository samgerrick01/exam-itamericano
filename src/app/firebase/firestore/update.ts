import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import app from "../../../../firebaseConfig";

const db = getFirestore(app);
const todosCollection = collection(db, "todos");

export async function updatePrioItem(docId: string, isPriority: boolean) {
  const docRef = doc(todosCollection, docId);
  return await updateDoc(docRef, { isPriority });
}

export async function updateStatusItem(docId: string, isCompleted: boolean) {
  const docRef = doc(todosCollection, docId);
  return await updateDoc(docRef, { isCompleted });
}

export async function updateItemText(docId: string, todo: string) {
  const docRef = doc(todosCollection, docId);
  return await updateDoc(docRef, { todo });
}
