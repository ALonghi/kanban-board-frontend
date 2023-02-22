import { XMarkIcon } from "@heroicons/react/24/outline";
import { ITask } from "../../../model/task";
import SaveIcon from "../../shared/SaveIcon";
import { useState } from "react";

type TaskProps = {
  task: ITask | Partial<ITask>;
  isNew?: boolean;
  isFocus?: boolean;
  onUpdate: (updatedTask: ITask | Partial<ITask>) => Promise<void>;
  onDelete: (id: ITask["id"]) => Promise<void>;
  // onSelect: (id: TaskModel['id']) => void;
};

export default function TaskCard({
  task,
  isNew,
  isFocus,
  onUpdate,
  onDelete,
}: //
// onSelect,
TaskProps) {
  const [showComponent, setShowComponent] = useState<boolean>(
    !!task?.id || true
  );
  const [isFocused, setIsFocused] = useState<boolean>(!!isFocus);
  const [taskTitle, setTaskTitle] = useState<string>(task.title || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleDeleteClick = async () => {
    const promise = task?.id
      ? onDelete(task.id)
      : Promise.resolve(setShowComponent(false));
    await promise.then(() => {
      setIsFocused(false);
      setTaskTitle("");
    });
  };

  const handleSelectClick = () => {
    // alert(`handleSelectClick`);
    // onSelect(task.id);
  };

  const handleSaveTask = async () => {
    await onUpdate({ ...task, title: taskTitle } as ITask);
    setIsFocused(false);
  };

  return (
    showComponent && (
      <div
        className={`cursor-grab relative flex items-start space-x-3 rounded-lg
            border-0 border-gray-300 bg-white px-4 py-4 shadow-md mt-3 max-w-full h-[5rem]
            `}
      >
        <div className={`relative flex w-full h-full`}>
          <div
            className={` flex flex-row opacity-40 justify-center items-center absolute top-0 right-0`}
          >
            {isNew ? (
              <SaveIcon saveAction={handleSaveTask} classes={`mr-1`} />
            ) : (
              <div
                className={`mx-2 border-box cursor-pointer`}
                onClick={handleSelectClick}
              >
                {/* <ArrowTopRightOnSquareIcon className={`text-gray-700 w-5 h-5 `} /> */}
              </div>
            )}

            <XMarkIcon
              onClick={() => handleDeleteClick()}
              className={`text-gray-700 z-10 w-5 h-5 cursor-pointer`}
            />
          </div>
          {isNew ? (
            <input
              onChange={handleTitleChange}
              defaultValue={task.title}
              ref={(input) => (isNew && input ? input.focus() : null)}
              onKeyDown={(e) => (e.key === "Enter" ? handleSaveTask() : null)}
              className={`focus-visible:ring-0 focus-visible:border-0
                          focus-visible:outline-0 bg-white mr-auto ml-0 overflow-x-none
                          font-normal text-sm p-0 h-fit max-h-full resize-none w-8/12 text-clip`}
            />
          ) : (
            <p
              className={`mr-auto ml-0 overflow-x-none
                        font-normal text-sm p-0 h-fit max-h-full ${
                          isFocused ? `w-8/12` : `w-max`
                        }`}
            >
              {task.title}
            </p>
          )}
        </div>
      </div>
    )
  );
}
