export type SubmitReviewState = {
  review: {
    uuid: string;
    files: Array<any>;
  };
  comparators: {
    outcome: string;
    intervetion: string;
    comparator: string;
    files: any[];
  }[];
  loading: boolean;
};
export const submitReviewInitialState: SubmitReviewState = {
  review: {
    uuid: "",
    files: [],
  },
  comparators: [],
  loading: false,
};
