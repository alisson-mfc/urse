import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import CreatableSelect from "react-select/creatable";
import { ComparatorContext } from "../../contexts/ComparatorsContext/context";
import {
  handleCreateOptions,
  handleDelete,
  handleSelectOptions,
} from "../../contexts/ComparatorsContext/actions";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.scss";

export interface Option {
  readonly label: string;
  readonly value: string;
}
const createOption = (label: string) =>
  ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  } as Option);

type POIType = {
  index: string;
  label?: string;
};

type LabelValueType = {
  label: string;
  value: string;
};
const POIInput = ({ index, label }: POIType) => {
  const { comparatorState, comparatorDispatch } = useContext(ComparatorContext);

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<Option | null>();

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption: Option = createOption(inputValue);
      setIsLoading(false);
      handleCreateOptions(newOption, comparatorDispatch);
      setValue(newOption);
      handleSelectOptions(newOption, index, comparatorDispatch);
    }, 1000);
  };
  return (
    <>
      <label>{label}</label>
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={(newValue) => {
          console.log(index);
          handleSelectOptions(newValue as Option, index, comparatorDispatch);
          setValue(newValue);
          setTimeout(() => setIsLoading(false), 500);
        }}
        onCreateOption={handleCreate}
        options={comparatorState.options.map((opt) => {
          return opt as Option;
        })}
        value={value}
      />
    </>
  );
};

const mountSelect = (
  interventions: boolean,
  comparators: boolean,
  callback: any
) => {
  const index = new Date().getTime().toString();
  if (interventions && comparators) {
    return (
      <Grid container spacing={2} key={index}>
        <Grid item xs={12} sm={5}>
          <POIInput {...{ index, label: "Outcome" }} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <POIInput {...{ index, label: "Comparisons" }} />
        </Grid>
        {/* <Grid item xs={12} sm={3}>
          <POIInput {...{ index, label: "Interventions" }} />
        </Grid> */}
        <Grid
          item
          xs={12}
          sm={2}
          container
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            onClick={() => callback(index)}
            variant="contained"
            color="primary"
          >
            <DeleteIcon />
          </Button>
        </Grid>
      </Grid>
    );
  } else if (!interventions && comparators) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <POIInput {...{ index, label: "Outcome" }} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <POIInput {...{ index, label: "Comparators" }} />
        </Grid>
      </Grid>
    );
  } else if (interventions && !comparators) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <POIInput {...{ index, label: "Outcome" }} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <POIInput {...{ index, label: "Interventions" }} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <POIInput {...{ index, label: "Outcome" }} />
        </Grid>
      </Grid>
    );
  }
};

type ComparatorInputType = {
  interventions: boolean;
  comparators: boolean;
};
function ComparatorInput({ interventions, comparators }: ComparatorInputType) {
  const { comparatorDispatch } = useContext(ComparatorContext);

  const handleLocalDelete = (index: string) => {
    setSelects((sel) => {
      return [...sel].filter((element) => element.key !== index);
    });
    handleDelete(index, comparatorDispatch);
  };

  const [selects, setSelects] = useState([
    mountSelect(interventions, comparators, handleLocalDelete),
  ]);

  const handleAdd = () => {
    setSelects((prev: any) => [
      ...prev,
      mountSelect(interventions, comparators, handleLocalDelete),
    ]);
  };

  return (
    <div>
      {selects.map((select, index) => {
        return select;
      })}
      <Grid container spacing={2} direction="row" justifyContent="flex-end">
        <Grid item xs={1} direction="row" justifyContent="flex-end">
          <Button
            style={{ width: "100%", marginTop: 5 }}
            variant="contained"
            color="secondary"
            onClick={handleAdd}
          >
            ADD
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ComparatorInput;
