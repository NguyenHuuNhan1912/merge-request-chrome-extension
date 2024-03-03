
import { MergeRequestHistory } from "./mrs-history.interface";

export default interface ChildComponentProps  {
    handleSetIsShowMrHistory : () => void;
    mrsHistory: Array<MergeRequestHistory>;
    setMrsHistory: any;
};