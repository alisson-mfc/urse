import { SubmitReviewState } from "./data";
import * as types from "./types";

type SubmitReviewAction = {
  type: string;
  payload: any;
};
export const reducer = (
  state: SubmitReviewState,
  action: SubmitReviewAction
) => {
  switch (action.type) {
    case types.SUBMIT_REVIEW_CREATE: {
      return {
        ...state,
        review: {
          ...state.review,
          files: action.payload,
        },
        loading: false,
      };
    }
    case types.SUBMIT_REVIEW_ADD_UUI: {
      return {
        ...state,
        review: {
          ...state.review,
          uuid: action.payload,
        },
        loading: false,
      };
    }

    case types.SUBMIT_REVIEW_CREATE: {
      return { ...state, loading: true };
    }

    case types.SUBMIT_REVIEW_ADD_COMPARATORS_UPLOAD: {
      const input = action.payload;
      const comparatorIndex = state.comparators.findIndex(
        (item: any) =>
          item.outcome === input.outcome &&
          item.intervetion === input.intervetion &&
          item.comparator === input.comparator
      );
      if (comparatorIndex !== -1) {
        const currentState = state.comparators[comparatorIndex];
        const newState = state.comparators.splice(comparatorIndex, 1);
        return {
          ...state,
          comparators: [...newState, input],
        };
      }
      return {
        ...state,
        comparators: [...state.comparators, input],
      };
    }
  }

  console.log("Não encontrei a action", action.type);
  return { ...state };
};
