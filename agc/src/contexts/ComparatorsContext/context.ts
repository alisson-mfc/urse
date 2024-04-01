import { createContext } from "react";
import { comparatorInitialState, ComparatorState } from "./data";

type ComparatorContextType = {
  comparatorState: ComparatorState;
  comparatorDispatch: any;
};
export const ComparatorContext = createContext<ComparatorContextType>(
  {} as ComparatorContextType
);
