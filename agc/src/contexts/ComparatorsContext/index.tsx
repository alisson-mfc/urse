import React, { ReactNode, useReducer } from "react";
import { ComparatorContext } from "./context";
import { comparatorInitialState } from "./data";
import { reducer } from "./reducer";

type ComparatorContextProviderType = {
  children: ReactNode;
};
export const ComparatorContextProvider = ({
  children,
}: ComparatorContextProviderType) => {
  const [comparatorState, comparatorDispatch] = useReducer(
    reducer,
    comparatorInitialState
  );
  return (
    <ComparatorContext.Provider
      value={{
        comparatorState: comparatorState,
        comparatorDispatch,
      }}
    >
      {children}
    </ComparatorContext.Provider>
  );
};
