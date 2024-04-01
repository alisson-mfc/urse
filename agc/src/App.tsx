import React from "react";
import "./App.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import HeaderComponent from "./components/header";
import BodyContainer from "./components/body-container";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ComparatorInput from "./components/compators-input";
import ReviewsList from "./components/reviews-list";
import FinalRevision from "./components/final-revision";
import OutcomeInput from "./components/outcome-input";
import OutcomeUpload from "./components/outcome-upload";
import GradePreview from "./components/grade-preview";
import Upload from "./components/upload";
import AboutComponent from "./components/about";
import TutorialComponent from './components/tutorial';
import { RobotViewerContextProvider } from "./contexts/useRobotContext";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <RobotViewerContextProvider>
          <HeaderComponent />
          <BodyContainer>
            <Routes>
              <Route path="/" element={<ReviewsList />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/outcome-input" element={<OutcomeInput />} />
              <Route path="/outcome-upload" element={<OutcomeUpload />} />
              <Route path="/grade-preview/:id" element={<GradePreview />} />
              <Route path="/final-revision/:id" element={<FinalRevision />} />
              <Route path="/tutorial" element={<TutorialComponent />} />
              <Route path="/about" element={<AboutComponent />} />
            </Routes>
          </BodyContainer>
        </RobotViewerContextProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
