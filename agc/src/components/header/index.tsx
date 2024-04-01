import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import "./style.scss";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function HeaderComponent() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" className="toolbar">
        <div className="w70">
          <Link to={"/"}>
            <img src="/polar-bear2.png" className="bear_class" />
            <Typography variant="h6" color="inherit" component="div">
              URSE - Automated GRADE Classification
            </Typography>
          </Link>
        </div>
        <div className="w30 toolsbutton">
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            className="fr"
          >
            <Link to={"/tutorial"}>Tutorial</Link>
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            className="fr"
          >
            <Link to={"/about"}>About</Link>
          </Typography>
        </div>
      </Toolbar>
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
    </AppBar>
  );
}

export default HeaderComponent;
