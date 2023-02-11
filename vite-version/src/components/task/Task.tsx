import {TaskModel} from "@/model/task";
import {ArrowTopRightOnSquareIcon, XMarkIcon} from "@heroicons/react/24/outline";

type TaskProps = {
    task: TaskModel;
    // onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
    // onDelete: (id: TaskModel['id']) => void;
    // onSelect: (id: TaskModel['id']) => void;
};

export default function Task({
                                 task,
                                 // onUpdate,
                                 // onDelete,
                                 // onSelect,
                             }: TaskProps) {
    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        // onUpdate(task.id, {...task, title: newTitle});
    };
    const handleDeleteClick = () => {
        alert(`handleDeleteClick`)
        // onDelete(task.id);
    };

    const handleSelectClick = () => {
        alert(`handleSelectClick`)
        // onSelect(task.id);
    };

    return (

        <div
            className={`cursor-grab relative flex items-start space-x-3 rounded-lg
            border-0 border-gray-300 bg-white px-4 py-4 shadow-md mt-3 w-[14rem] h-[5rem]
            `}
        >

            <div className={`relative flex w-full h-full`}>
                <div className={` flex flex-row opacity-40 justify-center items-center absolute top-0 right-0`}>
                    <div className={`px-2 border-box cursor-pointer`} onClick={handleSelectClick}>
                        <ArrowTopRightOnSquareIcon
                                                   className={`text-gray-700 w-5 h-5 `}/>
                    </div>

                    <XMarkIcon onClick={handleDeleteClick}
                               className={`text-gray-700  w-5 h-5 cursor-pointer`}/>
                </div>
                <textarea onChange={handleTitleChange} defaultValue={task.title}
                          className={`focus-visible:ring-0 focus-visible:border-0
                          focus-visible:outline-0 bg-${task.color} mr-auto ml-0 overflow-x-none
                          font-normal text-sm p-0 h-fit max-h-full resize-none w-8/12`}/>
            </div>
        </div>
    );
}


