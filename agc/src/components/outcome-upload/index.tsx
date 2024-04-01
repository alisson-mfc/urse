import React, { useCallback, useState, useContext, useEffect } from "react";
import Dropzone from "../dropzone";
import "./index.scss";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { RobotViewerContext } from "../../contexts/useRobotContext";
import "./index.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ComparatorContext } from "../../contexts/ComparatorsContext/context";
import { SubmitReviewContext } from "../../contexts/submit-review/context";
import { handleAddComparatorsUpload } from "../../contexts/submit-review/actions";
import { ServiceReport } from "../../services/ReportService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL } from "../../services/URL";
import { LinearProgress, LinearProgressProps } from "@mui/material";

// const input = {
//   outcome: ["outcome1", "outcome2", "outcome1"],
//   intervention: ["storke", "stroke", "All cause mortality"],
//   comparator: ["beta caroteno", "vitamina D", "covid"],
// };
function OutcomeUpload() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(-1);

  const { comparatorState, comparatorDispatch } = useContext(ComparatorContext);
  const { submitReviewState, submitReviewDispatch } =
    useContext(SubmitReviewContext);

  let input = {
    outcome: [],
    intervention: [],
    comparator: [],
  };
  Object.values(comparatorState.values).forEach((item) => {
    if (item[0]) {
      // @ts-ignore:next-line
      input.outcome.push(item[0] ? item[0].label : "");
      // @ts-ignore:next-line
      input.comparator.push(item[1] ? item[1].label : "");
      // @ts-ignore:next-line
      // input.intervention.push(item[2] ? item[2].label : "");
    }
  });

  const handleSave = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    setProgress(1);
    console.log("submitReviewState", submitReviewState);
    const service = new ServiceReport();
    const fetchData = async () => {
      try {
        setProgress(0);
        const responseReview = await service.createSystematicReview(
          submitReviewState.review.uuid,
          // @ts-ignore:next-line
          submitReviewState.review.files
        );
        const responseComparators =
          await service.createComparatorsForSystematicReview(
            submitReviewState.review.uuid,
            // @ts-ignore:next-line
            submitReviewState.comparators
          );
        setTimeout(async () => {
          await service.processData(submitReviewState.review.uuid, setProgress);
        }, 1000);
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };
    fetchData();
  };
  useEffect(() => {
    if (progress >= 95) {
      window.setTimeout(() => {
        setProgress(-1);
        setTimeout(
          () =>
            (window.location.href = `/final-revision/${submitReviewState.review.uuid}`),
          800
        );
      }, 1000);
      toast.success(`Your Review was saved!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [progress]);
  useEffect(() => {
    if (Object.values(comparatorState.values).length === 0) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {progress > 0 && <LinearProgressWithLabel value={progress} />}
      {input.outcome.map((item, index) => (
        <div
          key={`${item}_vs_${input.comparator[index]}`}
          style={{ borderBottom: "1px solid #00478d" }}
        >
          <h4>
            {input.outcome[index]}
            {input.comparator[index] ? "VS" : ""} {input.comparator[index]}
          </h4>
          <div>
            <UploadComparator
              key={`${item}_${input.comparator[index]}`}
              input={{
                outcome: input.outcome[index],
                intervention: item,
                comparator: input.comparator[index],
              }}
            />
          </div>
        </div>
      ))}
      <button onClick={handleSave} className="btn_submit">
        {" "}
        Submit
      </button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "absolute",
        width: "66vw",
      }}
    >
      {/* <div className="dropshadow" /> */}
      <Box className="loader">
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
}
const sending_files = `${URL}:3000/api/upload_and_annotate_pdfs`;

// @ts-ignore:next-line
function UploadComparator({ input }) {
  const navigate = useNavigate();
  const { setReportId } = useContext(RobotViewerContext);

  const [state, setState] = useState({
    progress: 0,
    inProgress: false,
    message: "",
    error: "",
  });
  const { submitReviewState, submitReviewDispatch } =
    useContext(SubmitReviewContext);

  const handleSubmit = useCallback((acceptedFiles: any[]) => {
    var fd = new FormData();
    acceptedFiles.forEach((file: any) => {
      fd.append("file", file);
    });
    const comparatorsObj = {
      outcome: input.outcome,
      intervention: input.intervention,
      comparator: input.comparator,
      files: acceptedFiles,
    };
    handleAddComparatorsUpload(comparatorsObj, submitReviewDispatch);
  }, []);
  const progress = 30;
  return (
    <div className="text">
      <div className="upload-box">
        {/* {state.inProgress && (
          // <CircularProgressWithLabel value={state.progress} />
        )} */}
        {!state.inProgress && (
          <Dropzone
            {...{
              useDropzoneProps: {
                accept: {
                  "application/pdf": [],
                },
                onDrop: handleSubmit,
              },
              files: true,
              text: "Drag and drop or click here to enter the source RCT that evaluate this domain.",
            }}
          />
        )}
      </div>
    </div>
  );
}
export default OutcomeUpload;
