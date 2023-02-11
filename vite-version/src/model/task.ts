
export type Column = string
export interface TaskModel {
    id: string;
    title: string;
    column: Column;
    color: string;
}

export interface DragItem {
    position: number;
    id: TaskModel['id'];
    from: Column;
}