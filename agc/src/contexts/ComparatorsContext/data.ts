export type ComparatorState = {
  options: { label: string; value: string }[];
  values: {
    [key: string]: Array<{ label: string; value: string }>;
  };
  loading: boolean;
};
export const comparatorInitialState: ComparatorState = {
  options: [],
  values: {},
  loading: false,
};
