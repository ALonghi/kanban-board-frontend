import { IBoardColumn } from "./board";

export interface ITask {
  id: string;
  position: number;
  title: string;
  description?: string;
  column_id?: string;
  above_task_id?: string;
  board_id: string;
  created_at: string;
  updated_at?: string;
}

export interface IDragItem {
  position: number;
  id: ITask["id"];
  from: IBoardColumn["id"];
}
