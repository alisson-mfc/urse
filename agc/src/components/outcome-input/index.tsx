import { Button, TextField, Grid } from "@mui/material";
import React, { useState, useContext, useCallback, ReactNode } from "react";
import "./index.scss";
import { Form, Field } from "react-final-form";
// import { required } from "../../utils/validation";
import { RobotViewerContext } from "../../contexts/useRobotContext";
import { Link, useNavigate } from "react-router-dom";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ComparatorInput from "../compators-input";
import { ComparatorContextProvider } from "../../contexts/ComparatorsContext";
import { ComparatorContext } from "../../contexts/ComparatorsContext/context";
import { toast } from "react-toastify";

class Intervention {
  constructor(private value: string) {}
}
class Comparator {
  constructor(private value: string) {}
}

class OutcomeComparator {
  intervention: Array<Intervention> = [];
  comparator: Array<Comparator> = [];
  constructor() {}
}

type LabelValueType = {
  label: string;
  value: string;
};
function OutcomeInput() {
  const interventions: boolean = true;
  const comparators: boolean = true;

  const { report_id } = useContext(RobotViewerContext);

  return (
    <OutcomeSelectContainer {...{ report_id, interventions, comparators }} />
  );
}

type OutcomeSelectContainerType = {
  report_id: string;
  interventions: boolean;
  comparators: boolean;
};
const OutcomeSelectContainer = ({
  report_id,
  interventions,
  comparators,
}: OutcomeSelectContainerType) => {
  const { comparatorState, comparatorDispatch } = useContext(ComparatorContext);
  const navigate = useNavigate();
  const onSubmit = async (_values: any) => {
    console.log(comparatorState);
    if (comparatorState.options.length > 0) {
      navigate("/outcome-upload");
    } else {
      toast.error("You must select at least one Outcome and/or comparisons", {
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
  return (
    <div>
      <h2>{report_id}</h2>
      <ComparatorInput {...{ interventions, comparators }} />
      <Button variant="contained" color="primary" onClick={onSubmit}>
        SUBMIT
      </Button>
    </div>
  );
};
export default OutcomeInput;
