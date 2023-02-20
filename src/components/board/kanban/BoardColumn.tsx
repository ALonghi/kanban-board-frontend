import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {PlusIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

import {IBoardColumn} from "../../../model/board";
import {CreateTaskRequest} from '../../../model/dto';
import {getEmptyTask, ITask} from "../../../model/task";
import TaskService from "../../../service/taskService";
import SaveIcon from "../../shared/SaveIcon";
import {SortableTask} from "./SortableTask";
import TaskCard from "./TaskCard";
import {getDifference} from "../../../utils/helpers";

type TaskColumnProps = {
    column?: IBoardColumn;
    tasks: ITask[];
    updateTasks: (tasks: ITask[]) => void;
    updateBoardColumn: (column: IBoardColumn) => Promise<void>;
    overriddenName?: string
    boardId: string
};

export default function TaskColumn({
                                       column,
                                       overriddenName,
                                       tasks,
                                       updateTasks,
                                       updateBoardColumn,
                                       boardId
                                   }: TaskColumnProps) {
    const [currentColumn, setCurrentColumn] = useState<IBoardColumn | null>(
        column || null
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [newTaskData, setNewTaskData] = useState<CreateTaskRequest | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: {x: 0, y: 20},
            },
        }),
        useSensor(TouchSensor)
    );

    function handleDragStart(event: DragStartEvent) {
        setIsDragging(true);
    }

    function handleDragEnd(event: DragEndEvent) {
        setIsDragging(false);

        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((i) => i.id === active?.id);
            const newIndex = tasks.findIndex((i) => i.id === over?.id);
            const reordered = arrayMove([...tasks], oldIndex, newIndex)
                .map((t, i) => ({...t, position: i}));
            updateTasks(reordered)

            const mapped = reordered?.map((task, i) => {
                delete task.position;
                if (i === 0) {
                    delete task.above_task_id
                    return task
                } else {
                    const parent = reordered[i - 1] || null
                    return {...task, above_task_id: parent?.id || null}
                }
            })
            const oldMapped = tasks.map(t => {
                delete t.position
                return t
            })

            const toUpdate = getDifference(oldMapped, mapped);

            TaskService.updateTasks(toUpdate, boardId).then(() => {
                    const mappedWithPosition = mapped.map((t, i) => ({...t, position: i}));
                    updateTasks(mappedWithPosition)
                }
            ).catch(err => console.error(`Received error ${err.message || err}`))
        }
    }

    const saveColumn = async () => {
        await updateBoardColumn(currentColumn).then(() => {
            setIsTyping(false);
            setCurrentColumn(null);
        });
    };

    const updateColumnName = (e) => {
        setIsTyping(true);
        setCurrentColumn((prev) => ({...prev, name: e.target.value}));
    };

    const saveTaskData = async (task: ITask | Partial<ITask>): Promise<void> => {
        const ordered = tasks?.sort((a, b) => a.position > b.position ? 1 : -1) || []
        console.log(`adding new task from ordered ${JSON.stringify(ordered)}`)
        console.log(`adding new task using last one ${JSON.stringify(ordered[tasks.length - 1]?.title)}`)
        const orderedTask: ITask | Partial<ITask> = {
            ...task,
            above_task_id: ordered ? ordered[tasks.length - 1]?.id : null
        }

        if (task.id) {
            return await TaskService
                .updateTask(orderedTask as ITask, boardId)
                .then(result => {
                    const exists = tasks.find(t => t.id === result.id)
                    exists
                        ? updateTasks(tasks.map(t => t.id === result.id ? result : t))
                        : updateTasks([...tasks, result])
                    setIsTyping(false)
                    setNewTaskData(null)
                })
        } else {
            const task_request: CreateTaskRequest = {
                title: orderedTask.title,
                description: orderedTask.description || null,
                column_id: column?.id || null,
                above_task_id: orderedTask.above_task_id || null,
                board_id: boardId
            }
            return TaskService
                .createTask(task_request)
                .then(created => {
                    const lastPosition = ordered[tasks.length - 1]?.position || 0;
                    const updatedList = [...tasks, {...created, position: lastPosition + 1}]
                    updateTasks(updatedList)
                    setIsTyping(false)
                    setNewTaskData(null)
                })
        }
    }

    const deleteTask = async (taskId: ITask['id']) => {
        await TaskService
            .deleteTask(taskId, boardId)
            .then(() => {
                const updatedTasks = tasks?.filter(t => t.id !== taskId);
                console.log(`after removal of ${taskId} ${tasks?.find(t => t.id === taskId)?.title} ${JSON.stringify(updatedTasks, null, 2)}`)
                updateTasks(updatedTasks)
            })
    }

    return (
        <>
            <div
                className={`flex flex-col tasks-center justify-center mx-4 h-[80vh] sm:min-w-[14rem] sm:max-w-[14rem] flex-1`}
            >
                <div
                    className={` mb-4 letter-spacing-2 py-2 px-4 flex flex-col
             tasks-center justify-center bg-gray-100 rounded-t-md w-full`}
                >
                    {(currentColumn?.name && !isTyping) || overriddenName ? (
                        <p className={`w-fit font-bold text-gray-700 ${overriddenName ? `` : `uppercase`} text-sm `}>
                            {currentColumn?.name || (
                                overriddenName ? overriddenName : "Create new column"
                            )
                            }
                        </p>
                    ) : (
                        <div className="flex w-full justify-between items-center">
                            <input
                                className={`bg-inherit font-bold text-gray-700 text-sm w-full 
                            outline-0
                            `}
                                onKeyDown={(e) => (e.key === "Enter" ? saveColumn() : null)}
                                onChange={updateColumnName}
                                value={currentColumn?.name || ""}
                                placeholder="Create new column.."
                            />
                            {isTyping && (
                                <SaveIcon saveAction={saveColumn}/>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className={`bg-gray-100 hover:bg-gray-200 py-0.5 px-4 mb-2 rounded-md w-full cursor-pointer`}
                    onClick={() => setNewTaskData(() => getEmptyTask(column?.id, boardId))}
                >
                    <PlusIcon className={`text-gray-500 w-5 mx-auto`}/>
                </div>

                <div className={` bg-gray-100 py-4 px-2 rounded-md h-full shadow-md`}>
                    <DndContext
                        autoScroll={false}
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tasks?.sort((a, b) => a.position > b.position ? 1 : -1)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {tasks
                                    ?.sort((a, b) => a.position > b.position ? 1 : -1)
                                    ?.map((task) => (
                                        <SortableTask
                                            key={task.id}
                                            task={task}
                                            someoneIsDragging={isDragging}
                                            onUpdate={(t) => saveTaskData(t)}
                                            onDelete={(tId) => deleteTask(tId)}
                                        />
                                    ))}
                                {newTaskData &&
                                    <TaskCard task={newTaskData} isNew isFocus
                                              onUpdate={(t) => saveTaskData(t)}
                                              onDelete={(tId) => deleteTask(tId)}
                                    />
                                }
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </>
    );
}
