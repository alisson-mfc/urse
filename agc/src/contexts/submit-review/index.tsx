import React, { ReactNode, useReducer } from "react";
import { SubmitReviewContext } from "./context";
import { submitReviewInitialState } from "../submit-review/data";
import { reducer } from "./reducer";

type SubmitReviewContextProviderType = {
  children: ReactNode;
};
export const SubmitReviewContextProvider = ({
  children,
}: SubmitReviewContextProviderType) => {
  const [submitReviewState, submitReviewDispatch] = useReducer(
    reducer,
    submitReviewInitialState
  );
  return (
    <SubmitReviewContext.Provider
      value={{
        submitReviewState,
        submitReviewDispatch,
      }}
    >
      {children}
    </SubmitReviewContext.Provider>
  );
};
