import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import "./style.scss";
import { ServiceReport } from "../../services/ReportService";
import { RobotViewerContext } from "../../contexts/useRobotContext";
import { Grid } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const mapAmstar: any = {
  item1: "'A priori' design",
  item2: "Duplicate study selection and data extraction",
  item3: "Comprehensive literature search",
  item4: "Status of publication used",
};

// const outcome1 = {
//   number_of_participants: {
//     items: {
//       RCT1: 200,
//       RCT2: 300,
//       RCT3: 400,
//       RCT4: 500,
//     },
//     total: 1400,
//     result: 0,
//   },
//   risk_of_bias: {
//     random: {
//       RCT1: true,
//       RCT2: true,
//       RCT3: true,
//       RCT4: true,
//     },
//     outcome: {
//       RCT1: true,
//       RCT2: true,
//       RCT3: true,
//       RCT4: true,
//     },
//     result: -1,
//   },
//   heterogeneity: {
//     i2: 84,
//     result: -1,
//   },
//   amstar: {
//     items: {
//       item1: true,
//       item2: true,
//       item3: true,
//       item4: true,
//     },
//     result: 0,
//   },
// };

// const input = [
//   {
//     values: [
//       { label: "a1", value: "a1" },
//       { label: "b1", value: "b1" },
//       { label: "c1", value: "c1" },
//     ],
//     result: outcome1,
//   },
//   {
//     values: [
//       { label: "a2", value: "a2" },
//       { label: "b1", value: "b1" },
//       { label: "c1", value: "c1" },
//     ],
//     result: outcome1,
//   },
// ];

function parseResult(result: number) {
  return {
    "-2": "2 Downgrades",
    "-1": "1 Downgrade",
    "0": "No Downgrade",
  }[result];
}

type NumberOfParticipantsType = {
  items: any;
  total: number;
  result: number;
};
function NumberOfParticipants({
  items,
  total,
  result,
}: NumberOfParticipantsType) {
  return (
    <Grid xs={12} className="box">
      <h4>Number of Partipantes</h4>
      <List dense={true}>
        {items &&
          Object.keys(items).map((it, index) => {
            const values = Object.values(items);
            return (
              <ListItem key={index}>
                <>
                  <strong>{it}:</strong>
                  {values[index]}
                </>
              </ListItem>
            );
          })}
        <ListItem>
          <>
            <strong>total:</strong>
            {result}
            <span className="downgrade">{parseResult(total)}</span>
          </>
        </ListItem>
      </List>
    </Grid>
  );
}

type RiskOfBiasType = {
  allocation_concealment: any;
  blinding_of_outcome_assessment: any;
  blinding_of_participants_and_personnel: any;
  random_sequence_generation: any;
  result: number;
};
function RiskOfBias({
  allocation_concealment,
  blinding_of_outcome_assessment,
  blinding_of_participants_and_personnel,
  random_sequence_generation,
  result,
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
  Object.keys(random_sequence_generation).map((key, index) => {
    console.log(
      "allocation_concealment_values[index]",
      allocation_concealment_values[index]
    );
  });
  const isTrue = (cls: any) => {
    if (cls === 1 || cls === "1") return parseClass(cls);
  };
  const isNone = (cls: any) => {
    if (cls === "" || cls === "?") {
      return parseClass(cls);
    }
    return "";
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
        return "bias success active";

      case "":
      case "?":
        return "bias warning active";

      case "0":
      case 0:
        return "bias error active";
    }
  };
  const parseText = (cls: string | number) => {
    switch (cls) {
      case "1":
      case 1:
        return "+";

      case "":
      case "?":
        return "?";

      case "0":
      case 0:
        return "-";
    }
  };
  return (
    <Grid xs={12} className="box">
      <h4>Risk of Bias</h4>
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
        {Object.keys(random_sequence_generation).map((key, index) => {
          return (
            <ListItem key={key}>
              <>
                <Grid xs={5}>{key}</Grid>
                <Grid xs={2}>
                  <div
                    className={parseClass(
                      random_sequence_generation_values[index]
                    )}
                  >
                    {parseText(random_sequence_generation_values[index])}
                  </div>
                </Grid>
                <Grid xs={2}>
                  <div
                    className={parseClass(allocation_concealment_values[index])}
                  >
                    {parseText(allocation_concealment_values[index])}
                  </div>
                </Grid>
                <Grid xs={2}>
                  <div
                    className={parseClass(
                      blinding_of_participants_and_personnel_values[index]
                    )}
                  >
                    {parseText(
                      blinding_of_participants_and_personnel_values[index]
                    )}
                  </div>
                </Grid>
                <Grid xs={2}>
                  <div
                    className={parseClass(
                      blinding_of_outcome_assessment_values[index]
                    )}
                  >
                    {parseText(blinding_of_outcome_assessment_values[index])}
                  </div>
                </Grid>
              </>
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
}

type HeterogeneityType = {
  i2: number;
  result: number;
};
function Heterogeneity({ i2, result }: HeterogeneityType) {
  return (
    <Grid xs={12} className="box">
      <h4>Heterogeneity</h4>
      <p>
        <strong>I²:</strong> {i2}{" "}
        <span className="downgrade">{parseResult(result)}</span>{" "}
      </p>
    </Grid>
  );
}

type AmstarType = {
  items: any;
  result: number;
};
function Amstar({ items, result }: AmstarType) {
  const keys = Object.keys(items);
  const itemValues: string[] = Object.values(items);

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
                <Grid xs={5}>{checkAmstar(itemValues[index])}</Grid>
              </>
            </ListItem>
          );
        })}
        <ListItem>
          <span className="downgrade">{parseResult(result)}</span>
        </ListItem>
      </List>
    </Grid>
  );
}

type GradeListType = {
  result: any;
  values: any[];
};
function GradeList({ result, values }: GradeListType) {
  const grade =
    4 +
      (result.amstar.result.amstar_result || 0) +
      (result.heterogeneity.result || 0) +
      (result.number_of_participants.result || 0) +
      Object.values(result.risk_of_bias)
        .map((c: any) => Object.values(c).reduce((ac: any, cc: any) => ac + cc))
        .reduce((ac: any, c: any) => ac + c) || 0;

  let gradelist = [
    <AddCircleOutlineIcon className="grade" />,
    <AddCircleOutlineIcon className="grade" />,
    <AddCircleOutlineIcon className="grade" />,
    <AddCircleOutlineIcon className="grade" />,
  ];
  for (let i = 3; i > grade - 1; i--) {
    gradelist[i] = <RemoveCircleOutlineIcon className="grade" />;
  }
  return (
    <Grid container spacing={2} className="box">
      <Grid xs={12} className="box">
        {/* <h2>
          {" "}
          {values[0].value.length > 1 ? `Outcome: ${values[0].value}` : ""}
          {values[1].value.length > 1
            ? ` VS Comparison: ${values[2].value}`
            : ""}
          
        </h2> */}
        <Grid
          xs={12}
          className={
            "box grade_box " +
            (grade >= 3 ? "green" : grade >= 2 ? "moderade" : "low")
          }
        >
          <h3>
            <span>GRADE:</span>
            <span>{gradelist.map((i) => i)}</span>
          </h3>
        </Grid>

        <NumberOfParticipants
          {...{
            items: result.number_of_participants.items,
            total: result.number_of_participants.total,
            result: result.number_of_participants.result,
          }}
        />

        <RiskOfBias
          {...{
            allocation_concealment: result.risk_of_bias.allocation_concealment,
            blinding_of_outcome_assessment:
              result.risk_of_bias.blinding_of_outcome_assessment,
            blinding_of_participants_and_personnel:
              result.risk_of_bias.blinding_of_participants_and_personnel,
            random_sequence_generation:
              result.risk_of_bias.random_sequence_generation,
            result: result.risk_of_bias.result,
          }}
        />

        <Heterogeneity
          {...{
            i2: result.heterogeneity.i2,
            result: result.heterogeneity.result,
          }}
        />

        <Amstar
          {...{
            items: result.amstar.items,
            result: result.amstar.result,
          }}
        />
      </Grid>
    </Grid>
  );
}
function GradePreview() {
  const service = new ServiceReport();
  const params = useParams();
  const uid = params.id;
  const [input, setInput] = useState([]);

  const fetchData = useCallback(
    async (uid: any) => {
      const response: any = await service.getReviewResult(uid);
      console.log("INPUT: ", response.message);
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
        input.map((_input: any) => {
          return (
            <>
              <h2>
                {_input.values[0].value.length > 1
                  ? `Outcome: ${_input.values[0].value}`
                  : ""}
                {_input.values[2].value.length > 1
                  ? ` VS Comparison: ${_input.values[2].value}`
                  : ""}
              </h2>
              <GradeList
                {...{ result: _input.result, values: _input.values }}
              />
            </>
          );
        })}
    </>
  );
}

export default GradePreview;
