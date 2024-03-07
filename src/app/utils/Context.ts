import { createContext } from "react";
import { MediaItemShape } from "../../../App";
import { TodoItemProps } from "../todo/TodoItem";

interface DataContextProps {
  tasks: TodoItemProps[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  media: MediaItemShape[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItemShape[]>>;
}

export const DataContext = createContext<DataContextProps>({
  setTasks: () => {},
  tasks: [],
  media: [],
  setMedia: () => {},
});
