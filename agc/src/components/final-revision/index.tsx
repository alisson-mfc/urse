import { Button, ButtonGroup, Grid, List, ListItem } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ServiceReport } from "../../services/ReportService";
import "./style.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";
const mapAmstar: any = {
  item1: "'A priori' design",
  item2: "Duplicate study selection and data extraction",
  item3: "Comprehensive literature search",
  item4: "Status of publication used",
};

type RiskOfBiasType = {
  allocation_concealment: any;
  blinding_of_outcome_assessment: any;
  blinding_of_participants_and_personnel: any;
  random_sequence_generation: any;
  result: number;
  setInput: any;
  index: number;
  is_rct: boolean;
};
function RiskOfBiasForm({
  allocation_concealment,
  blinding_of_outcome_assessment,
  blinding_of_participants_and_personnel,
  random_sequence_generation,
  result,
  setInput,
  index,
  is_rct,
}: RiskOfBiasType) {
  const keys = Object.keys(allocation_concealment);

  const allocation_concealment_values: string[] = Object.values(
    allocation_concealment
  );

  const blinding_of_outcome_assessment_values: string[] = Object.values(
    blinding_of_outcome_assessment
  );
  const blinding_of_participants_and_personnel_values: string[] = Object.values(
    blinding_of_participants_and_personnel
  );
  const random_sequence_generation_values: string[] = Object.values(
    random_sequence_generation
  );

  const isTrue = (cls: any) => {
    if (cls === 1 || cls === "1") return parseClass(cls);
  };
  const isNone = (cls: any) => {
    if (cls === "" || cls === "?") {
      return parseClass(cls);
    }
    return isFalse(cls);
  };
  const isFalse = (cls: any) => {
    if (cls === "0" || cls === 0) {
      return parseClass(cls);
    }
  };
  const parseClass = (cls: string | number) => {
    switch (cls) {
      case "1":
      case 1:
        return "success active";

      case "":
      case "?":
        return "warning active";

      case "0":
      case 0:
        return "warning active";
    }
  };
  return (
    <Grid xs={12} className="box">
      <h4>Risk of Bias </h4>
      <List>
        <ListItem>
          <>
            <Grid xs={4}></Grid>
            <Grid xs={2} className="rotate_45">
              Random sequence generation
            </Grid>
            <Grid xs={2} className="rotate_45">
              Allocation concealment
            </Grid>
            <Grid xs={2} className="rotate_45">
              Blinding of participants and personnel
            </Grid>
            <Grid xs={2} className="rotate_45">
              Blinding of outcome assessment
            </Grid>
          </>
        </ListItem>
        {Object.keys(random_sequence_generation).map((key, _index) => {
          return (
            <ListItem key={key}>
              <>
                <Grid xs={4}>{key}</Grid>
                <Grid xs={2}>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      color="success"
                      className={isTrue(
                        random_sequence_generation_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.random_sequence_generation[
                            key
                          ] = "1";
                          return [...a];
                        });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      className={isNone(
                        random_sequence_generation_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.random_sequence_generation[
                            key
                          ] = "?";
                          return [...a];
                        });
                      }}
                    >
                      ?
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid xs={2}>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      color="success"
                      className={isTrue(allocation_concealment_values[_index])}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[index].result.risk_of_bias.allocation_concealment[
                            key
                          ] = "1";
                          return [...a];
                        });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      className={isNone(allocation_concealment_values[_index])}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[index].result.risk_of_bias.allocation_concealment[
                            key
                          ] = "?";
                          return [...a];
                        });
                      }}
                    >
                      ?
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid xs={2}>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      color="success"
                      className={isTrue(
                        blinding_of_participants_and_personnel_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.blinding_of_participants_and_personnel[
                            key
                          ] = "1";
                          return [...a];
                        });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      className={isNone(
                        blinding_of_participants_and_personnel_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.blinding_of_participants_and_personnel[
                            key
                          ] = "?";
                          return [...a];
                        });
                      }}
                    >
                      ?
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid xs={2}>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      color="success"
                      className={isTrue(
                        blinding_of_outcome_assessment_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.blinding_of_outcome_assessment[
                            key
                          ] = "1";
                          return [...a];
                        });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      className={isNone(
                        blinding_of_outcome_assessment_values[_index]
                      )}
                      onClick={(event) => {
                        setInput((p: any) => {
                          const a = [...p];
                          a[
                            index
                          ].result.risk_of_bias.blinding_of_outcome_assessment[
                            key
                          ] = "?";
                          return [...a];
                        });
                      }}
                    >
                      ?
                    </Button>
                  </ButtonGroup>
                </Grid>
              </>
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
}

type NumberOfParticipantsType = {
  items: any;
  total: number;
  result: number;
  setInput: any;
  index: number;
};
function NumberOfParticipantsForm({
  items,
  total,
  result,
  setInput,
  index,
}: NumberOfParticipantsType) {
  let n_total = 0;
  return (
    <Grid xs={12} className="box">
      <h4>Number of Participants</h4>
      <List dense={true}>
        {Object.keys(items).map((it, _index) => {
          const values = Object.values(items);
          const currentValue = parseInt(
            (values[_index] + "").indexOf("?") != -1
              ? "10"
              : values[_index] + "",
            10
          );
          n_total += currentValue;
          return (
            <ListItem key={_index}>
              <>
                <strong>{it}:</strong>
                <input
                  type="tel"
                  value={currentValue as number}
                  onChange={(event) => {
                    setInput((p: any) => {
                      const a = [...p];
                      if (
                        a[index] != undefined &&
                        a[index].result.number_of_participants.items[it] !=
                          undefined
                      ) {
                        a[index].result.number_of_participants.items[it] =
                          event.target.value;
                      }
                      return [...a];
                    });
                  }}
                />
              </>
            </ListItem>
          );
        })}
        <ListItem>
          <>
            <strong>total:</strong>
            <input
              type="tel"
              value={
                total.toString().indexOf("?") != -1
                  ? Math.max(result as number, n_total)
                  : total
              }
              onChange={(event) => {
                setInput((p: any) => {
                  const a = [...p];
                  if (
                    a[index] != undefined &&
                    a[index].result.number_of_participants.result != undefined
                  ) {
                    a[index].result.number_of_participants.result =
                      event.target.value;
                  }
                  return [...a];
                });
              }}
            />
          </>
        </ListItem>
      </List>
    </Grid>
  );
}

type HeterogeneityType = {
  i2: number;
  result: number;
  setInput: any;
  index: number;
};
function HeterogeneityForm({ i2, result, index, setInput }: HeterogeneityType) {
  return (
    <Grid xs={12} className="box">
      <h4>Heterogeneity</h4>
      <p>
        <strong>I²:</strong>{" "}
        <input
          type="tel"
          value={i2}
          onChange={(event) => {
            setInput((p: any) => {
              const a = [...p];
              a[index].result.heterogeneity = event.target.value;
              return [...a];
            });
          }}
        />
      </p>
    </Grid>
  );
}
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

type AmstarType = {
  items: any;
  result: number;
  setInput: any;
  index: number;
};
function AmstarForm({ items, result, setInput, index }: AmstarType) {
  const keys = Object.keys(items);
  let vals = Object.values(items).map((b) => Boolean(b)) as Array<boolean>;
  vals = vals.length > 0 ? vals : [false, false, false, false];
  // eslint-disable-next-line
  const [itemValues, setItemValues] = useState<boolean[]>(vals);
  // const itemValues: string[] = Object.values(items);
  const checkAmstar = (status: string) => {
    const check = <CheckIcon className="green" />;
    const cancel = <CloseIcon className="red" />;

    return status ? check : cancel;
  };
  return (
    <Grid xs={12} className="box">
      <h4>AMSTAR</h4>

      <List>
        {keys.map((k, index) => {
          return (
            <ListItem key={index}>
              <>
                <Grid xs={5}>
                  <strong>{mapAmstar[k]}:</strong>
                </Grid>
                <Grid xs={5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>False</Typography>
                    <AntSwitch
                      checked={itemValues[index]}
                      onChange={(event) => {
                        setInput((p: any) => {
                          setItemValues((pp) => {
                            pp[index] = !pp[index];
                            return pp;
                          });
                          const a = [...p];
                          a[index].result.amstar.items[k] =
                            !a[index].result.amstar.items[k];
                          return a;
                        });
                      }}
                      inputProps={{ "aria-label": "ant design" }}
                    />
                    <Typography>True</Typography>
                  </Stack>
                </Grid>
              </>
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
}

const gradeResult = (value: number) => {
  switch (value) {
    case 0:
      return "High";
    case 1:
    case 2:
      return "Moderate";
    case 3:
    case 4:
      return "Low";
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return "Very low";
    default:
      return "Undefined";
  }
};

const gradeResultIcon = (value: number) => {
  if (value == undefined || value == null) return 0;

  const value_str = gradeResult(value);
  switch (value_str) {
    case "High":
      return 3;
    case "Moderate":
      return 2;
    case "Low":
      return 1;
    case "Very low":
      return 0;
  }
};

type GradeListType = {
  result: any;
  values: any[];
  setInput: any;
  index: number;
};
function GradeList({ result, values, setInput, index }: GradeListType) {
  const risk_of_bias: number = Object.values(result.risk_of_bias)
    .map((c: any) =>
      Object.values(c).reduce((ac: any, cc: any) => Math.abs(ac) + Math.abs(cc))
    )
    .reduce((ac: any, c: any) => Math.abs(ac) + Math.abs(c)) as number;

  const grade_computado = Math.abs(result.final_score) || 0;

  const grade = 4 - grade_computado;

  let gradelist = [
    <AddCircleOutlineIcon className="grade" key={"0"} />,
    <AddCircleOutlineIcon className="grade" key={"1"} />,
    <AddCircleOutlineIcon className="grade" key={"2"} />,
    <AddCircleOutlineIcon className="grade" key={"3"} />,
  ];
  // @ts-ignore: Object is possibly 'undefined'.
  for (let i = 3; i > gradeResultIcon(grade_computado); i--) {
    gradelist[i] = <RemoveCircleOutlineIcon key={i} className="grade" />;
  }

  return (
    <Grid container spacing={2} className="box">
      <Grid xs={12} className="box">
        {/* <h2>
          {" "}
          {values[0].value.length > 1 ? `Outcome: ${values[0].value}` : ""}
          {values[1].value.length > 1
            ? ` VS Comparators: ${values[1].value}`
            : ""}
          {values[2].value.length > 1
            ? ` VS Interventions: ${values[2].value}`
            : ""}
        </h2> */}
        <Grid
          xs={12}
          className={
            "box grade_box " +
            (grade >= 3 ? "green" : grade >= 2 ? "moderate" : "low")
          }
        >
          <h3>
            <span>GRADE:</span>
            <span>{gradelist.map((i) => i)}</span>
            <span style={{ marginLeft: 10 }}>
              {" "}
              {gradeResult(Math.abs(grade_computado))}
            </span>
          </h3>
        </Grid>

        <NumberOfParticipantsForm
          {...{
            items: result.number_of_participants.items,
            total: result.number_of_participants.total,
            result: result.number_of_participants.result,
            setInput: setInput,
            index: index,
          }}
        />
        <RiskOfBiasForm
          {...{
            allocation_concealment: result.risk_of_bias.allocation_concealment,
            blinding_of_outcome_assessment:
              result.risk_of_bias.blinding_of_outcome_assessment,
            blinding_of_participants_and_personnel:
              result.risk_of_bias.blinding_of_participants_and_personnel,
            random_sequence_generation:
              result.risk_of_bias.random_sequence_generation,
            result: result.risk_of_bias.result,
            setInput: setInput,
            index: index,
            is_rct: result.is_rct,
          }}
        />

        <HeterogeneityForm
          {...{
            i2: result.heterogeneity.i2,
            result: result.heterogeneity.result,
            setInput: setInput,
            index: index,
          }}
        />
        <AmstarForm
          {...{
            items: result.amstar.items,
            result: result.amstar.result,
            setInput: setInput,
            index: index,
          }}
        />
      </Grid>
    </Grid>
  );
}

function FinalRevision() {
  const service = new ServiceReport();
  const params = useParams();
  const uid = params.id;
  const [input, setInput] = useState([]);

  const fetchData = useCallback(
    async (uid: any) => {
      const response: any = await service.getReviewResult(uid);
      // console.log("INPUT: ", response.message);
      setInput(response.message);
    },
    [uid]
  );
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if (uid !== null) {
      // @ts-ignore
      fetchData(uid);
    }
  }, [fetchData]);
  /* tslint:disable */

  const handleAdd = async () => {
    try {
      const response = await service.saveFinalReview(uid, input);
      toast.success("Your Review was saved!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
      toast.error("Your Review was not saved!", {
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
    <>
      {input.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {input.length > 0 &&
        input.map((_input: any, index: number) => {
          return (
            <>
              <h2>
                {_input.values[0].value.length > 1
                  ? `Outcome: ${_input.values[0].value}`
                  : ""}
                {_input.values[2].value.length > 1
                  ? ` ; Comparison: ${_input.values[2].value}`
                  : ""}
              </h2>
              <GradeList
                {...{
                  result: _input.result,
                  values: _input.values,
                  setInput: setInput,
                  index: index,
                }}
              />
            </>
          );
        })}
      {input.length > 0 && (
        <>
          <p>
            * Risk of Bias automation by{" "}
            <a href="https://www.robotreviewer.net/" target="_blank">
              Robot Reviewer
            </a>
            .
          </p>
          <button className="btn_submit" onClick={handleAdd}>
            Save Final Review
          </button>
        </>
      )}
      {/* <ToastContainer
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
      /> */}
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
    </>
  );
}

export default FinalRevision;
