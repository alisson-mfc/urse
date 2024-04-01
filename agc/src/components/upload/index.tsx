import React, { useCallback, useState, useContext } from "react";
import Dropzone from "../dropzone";
import "./index.scss";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { RobotViewerContext } from "../../contexts/useRobotContext";
import { SubmitReviewContext } from "../../contexts/submit-review/context";
import { useNavigate } from "react-router-dom";
import { CheckBox } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import {
  handleAddUi,
  handleCreateSubmitReview,
} from "../../contexts/submit-review/actions";
import { URL } from "../../services/URL";
const sending_files = `${URL}:3000/api/upload_and_annotate_pdfs`;
const get_status = `${URL}:3000/api/annotate_status`;
const uuid = uuidv4();

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <>
      <div className="dropshadow" />
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
    </>
  );
}

function Upload() {
  const navigate = useNavigate();
  const { setReportId } = useContext(RobotViewerContext);
  const { submitReviewState, submitReviewDispatch } =
    useContext(SubmitReviewContext);
  const [state, setState] = useState({
    progress: 0,
    inProgress: false,
    message: "",
    error: "",
  });
  const handleSubmit = useCallback((acceptedFiles: any[]) => {
    // var fd = new FormData();
    // acceptedFiles.forEach((file: any) => {
    //   fd.append("file", file);
    // });
    handleAddUi(uuid, submitReviewDispatch);
    handleCreateSubmitReview(acceptedFiles, submitReviewDispatch);
    navigate("/outcome-input");
    const input = {};
  }, []);
  const progress = 30;

  return (
    <div className="text">
      <div className="upload-box">
        {state.inProgress && (
          <CircularProgressWithLabel value={state.progress} />
        )}
        {!state.inProgress && (
          <Dropzone
            {...{
              useDropzoneProps: {
                accept: {
                  "application/pdf": [],
                },
                onDrop: handleSubmit,
              },
              text: "Drag 'n drop Systematic Review PDF file or click to select",
            }}
          />
        )}
        {/* <div>
          <div>
            <input
              type="checkbox"
              id="more_intervention"
              name="more_intervention"
            />
            <label htmlFor="more_intervention" className="label">
              More than one intervention (I)
            </label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="checkbox"
              id="more_comparator"
              name="more_comparator"
            />
            <label htmlFor="more_comparator" className="label">
              More than one comparator (C)
            </label>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Upload;
