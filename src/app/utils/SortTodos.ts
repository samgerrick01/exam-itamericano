interface ITask {
  docId: string;
  todo: string;
  isCompleted: boolean;
  isPriority: boolean;
  ownerId: string;
}

export function sortItemsByPrio(arr: ITask[]) {
  return arr.sort((a, b) => {
    if (a.isPriority === b.isPriority) {
      return a.todo.localeCompare(b.todo);
    } else {
      return a.isPriority ? -1 : 1;
    }
  });
}
