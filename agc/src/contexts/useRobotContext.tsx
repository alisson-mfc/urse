import * as React from "react";
import { BiasType } from "../services/ReportService";
import { ComparatorContextProvider } from "./ComparatorsContext";
import { SubmitReviewContextProvider } from "./submit-review";

interface RobotViewerContextType {
  report_id: string;
  setReportId: any;
  robotViewerSummary: Array<BiasType>;
  setRobotViewerSummary: any;
}
const init = {
  report_id: "",
  setReportId: () => {},
  robotViewerSummary: [],
  setRobotViewerSummary: () => {},
};
export const RobotViewerContext =
  React.createContext<RobotViewerContextType>(init);

export const RobotViewerContextProvider = (props: { children: any }) => {
  const [report_id, setReportId] = React.useState("");
  const [robotViewerSummary, setRobotViewerSummary] = React.useState([]);

  return (
    <RobotViewerContext.Provider
      value={{
        report_id,
        setReportId,
        robotViewerSummary,
        setRobotViewerSummary,
      }}
    >
      <SubmitReviewContextProvider>
        <ComparatorContextProvider>{props.children}</ComparatorContextProvider>
      </SubmitReviewContextProvider>
    </RobotViewerContext.Provider>
  );
};
