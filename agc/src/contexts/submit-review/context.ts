import { createContext } from "react";
import { submitReviewInitialState, SubmitReviewState } from "./data";

type SubmitReviewContextType = {
  submitReviewState: SubmitReviewState;
  submitReviewDispatch: any;
};
export const SubmitReviewContext = createContext<SubmitReviewContextType>(
  {} as SubmitReviewContextType
);
