import { ComparatorState } from "./data";
import * as types from "./types";

type ComparatorAction = {
  type: string;
  payload: any;
};
export const reducer = (state: ComparatorState, action: ComparatorAction) => {
  switch (action.type) {
    case types.OPTIONS_CREATE: {
      return {
        ...state,
        options: [...state.options, action.payload],
        loading: false,
      };
    }
    case types.OPTIONS_LOADING: {
      return { ...state, loading: true };
    }
    case types.OPTIONS_SELECT: {
      console.log(action.type, state.values);
      const key = state.values[action.payload.key as string] || [];
      console.log("antes: ", key);
      /* eslint-disable */
      const newList = Array.from(new Set([...key, action.payload.data]));
      /* eslint-enable */
      console.log("depois: ", newList);
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.key]: newList,
        },
        loading: false,
      };
    }
    case types.OPTIONS_DELETE_ROW: {
      console.log(action.type, state.values);
      delete state.values[action.payload];
      return {
        ...state,
      };
    }
  }

  console.log("Não encontrei a action", action.type);
  return { ...state };
};
