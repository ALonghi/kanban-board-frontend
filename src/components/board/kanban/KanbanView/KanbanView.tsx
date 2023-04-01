import { closestCenter, DndContext, useDroppable } from "@dnd-kit/core";
import { IBoard } from "../../../../model/board";
import { ITask } from "../../../../model/task";
import BoardColumn from "../BoardColumn/BoardColumn";
import { useDraggable } from "./useDraggable";
import { useKanbanData } from "./useKanbanData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { groupByColumn } from "../../../../utils/helpers";
import ColumnHeader from "../BoardColumn/ColumnHeader";
import { useColumnHooks } from "../BoardColumn/useColumnHooks";
import TaskCard from "../TaskCard";


type KanbanViewProps = {
  board: IBoard;
  tasks: ITask[];
};

export default function KanbanView({ board, tasks }: KanbanViewProps) {
  const {
    currentBoard,
    groupedTasks,
    currentTasks,
    setCurrentTasks,
    updateTasksForColumn,
    updateBoardColumn,
    newTaskData,
    setNewTaskData,
  } = useKanbanData(board, tasks);

  const {
    deleteTask,
    saveTaskData,
  } = useColumnHooks(board.id, tasks, setCurrentTasks, setNewTaskData);

  const {
    isDragging,
    sensors,
    handleDragStart,
    handleDragEnd,
  } = useDraggable(currentTasks, updateTasksForColumn, board.id)

  console.log(`groupedTasks: ${JSON.stringify(groupedTasks,null,2)}`)
  console.log(`new task data ${JSON.stringify(newTaskData,null,2)}`)
  return (
    <div
      className="mx-2 my-8 min-w-full flex flex-1 items-stretch
    gap-x-2 overflow-x-scroll flex-nowrap w-fit"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        {groupedTasks
          .map(elem => (
            <div
              className={`${elem.columnId}__wrapper
                            flex flex-col justify-start items-center mx-4 min-h-[80vh] 
                 w-[14rem] overflow-x-visible `}
              key={elem.columnId || "-1"}
            >
              <ColumnHeader
                board={board}
                column={elem.column}
                tasks={elem.elems}
                overriddenName={elem.column?.name || "Unassigned"}
                updateBoardColumn={updateBoardColumn}
                setNewTaskData={setNewTaskData}
              />
              <div className={`${elem.columnId}__container
                            bg-gray-100 py-4 px-2 rounded-md w-full h-full shadow-md`}>
                <Droppable droppableId={elem.columnId || "-99999"}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {elem.elems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${item.title.toLowerCase()}__items`}
                            >
                              <TaskCard task={item} onUpdate={saveTaskData} onDelete={deleteTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {(newTaskData && newTaskData?.column_id === elem.columnId) && (
                        <TaskCard
                          task={newTaskData}
                          isNew
                          isFocus
                          onUpdate={(t) => saveTaskData(t)}
                          onDelete={(tId) => deleteTask(tId)}
                        />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
      </DragDropContext>

      {/* <DragDropContext
        autoScroll={false}
        collisionDetection={closestCenter}
        // onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // sensors={sensors}
      > */}


      {/* <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      > */}
      {/* <BoardColumn
          tasks={updatedTasksGrouped.get(null) || []}
          updateTasks={(list) => updateTasksForColumn(list, null)}
          updateBoardColumn={updateBoardColumn}
          overriddenName="Unassigned"
          board={currentBoard}
          isDragging={isDragging}
        />
        {currentBoard?.columns?.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={updatedTasksGrouped.get(col.id) || []}
            updateTasks={(list) => updateTasksForColumn(list, col.id)}
            updateBoardColumn={updateBoardColumn}
            board={currentBoard}
            isDragging={isDragging}
          />
        ))}
        <BoardColumn
          tasks={[]}
          updateTasks={(list) => null}
          updateBoardColumn={updateBoardColumn}
          board={currentBoard}
          isDragging={isDragging}
        />
        {/* </DndContext> */}
      {/*</DragDropContext> */}

    </div>
  );
}
