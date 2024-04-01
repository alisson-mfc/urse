import React from "react";
import Container from "@mui/material/Container";

import { Grid } from "@mui/material";
import { RobotViewerContextProvider } from "../../contexts/useRobotContext";

function BodyContainer(props: any) {
  return (
    <Container component="main" sx={{ mb: 4, mt: 2 }}>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </Container>
  );
}

export default BodyContainer;
