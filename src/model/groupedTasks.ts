import { ITask } from "./task";
import { IBoardColumn } from './board';

export default interface GroupedTasks {
    columnId: string,
    elems: ITask[],
    column?: IBoardColumn,
}
