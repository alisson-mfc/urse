import * as types from "./types";

export const handleCreateSubmitReview = (inputValue: any, dispatch: any) => {
  dispatch({ type: types.SUBMIT_REVIEW_LOADING });

  dispatch({ type: types.SUBMIT_REVIEW_CREATE, payload: inputValue });
};
export const handleAddUi = (inputValue: any, dispatch: any) => {
  dispatch({ type: types.SUBMIT_REVIEW_LOADING });

  dispatch({ type: types.SUBMIT_REVIEW_ADD_UUI, payload: inputValue });
};

export const handleAddComparatorsUpload = (inputValue: any, dispatch: any) => {
  dispatch({ type: types.SUBMIT_REVIEW_LOADING });

  dispatch({
    type: types.SUBMIT_REVIEW_ADD_COMPARATORS_UPLOAD,
    payload: inputValue,
  });
};
