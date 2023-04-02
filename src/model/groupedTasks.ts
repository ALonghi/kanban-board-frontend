import { ITask } from "./task";
import { IBoardColumn } from './board';

export default interface GroupedTask {
    [columnId: IBoardColumn['id']]: {
        column: IBoardColumn,
        items: ITask[]
    }
}
