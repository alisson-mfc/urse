import { Option } from "../../components/compators-input";
import * as types from "./types";

export const handleCreateOptions = (inputValue: Option, dispatch: any) => {
  dispatch({ type: types.OPTIONS_LOADING });

  dispatch({ type: types.OPTIONS_CREATE, payload: inputValue });
};

export const handleSelectOptions = (
  inputValue: Option,
  key: string,
  dispatch: any
) => {
  dispatch({ type: types.OPTIONS_LOADING });
  dispatch({ type: types.OPTIONS_SELECT, payload: { key, data: inputValue } });
};

export const handleDelete = (key: string, dispatch: any) => {
  dispatch({ type: types.OPTIONS_LOADING });
  dispatch({ type: types.OPTIONS_DELETE_ROW, payload: key });
};
