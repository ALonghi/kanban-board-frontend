import { IBoardColumn, IBoard } from '../../../../model/board';
import { ITask } from "../../../../model/task";
import ColumnBody from "./ColumnBody";
import ColumnHeader from "./ColumnHeader";
import { useColumnHooks } from "./useColumnHooks";

type TaskColumnProps = {
  column?: IBoardColumn;
  tasks: ITask[];
  updateTasks?: (tasks: ITask[]) => void;
  updateBoardColumn: (column: IBoardColumn) => Promise<void>;
  overriddenName?: string;
  board: IBoard;
  isDragging: boolean;
};

export default function BoardColumn({
  column,
  overriddenName,
  tasks,
  updateTasks,
  updateBoardColumn,
  board,
  isDragging,
}: TaskColumnProps) {
    currentColumn,
    newTaskData,
    setNewTaskData,
    isTyping,
    saveColumn,
    updateColumnName,
    deleteTask,
    saveTaskData,
  } = useColumnHeaderHooks(board.id, column, tasks, updateBoardColumn, updateTasks);

  return (
      <div
        className={`flex flex-col justify-center mx-4 min-h-[80vh] 
                 w-[14rem] overflow-x-visible`}
      >
        <ColumnHeader
          column={currentColumn}
          // isTyping={isTyping}
          // updateColumnName={updateColumnName}
          // saveColumn={saveColumn}
          overriddenName={overriddenName}
          // setNewTaskData={setNewTaskData}
          boardId={board.id}
        />

        <ColumnBody
          newTaskData={newTaskData as Partial<ITask>}
          tasks={tasks}
          isDragging={isDragging}
          saveTaskData={saveTaskData}
          deleteTask={deleteTask}
          columnId={currentColumn?.id}
          board={board}
        />
      </div>
  );
}
