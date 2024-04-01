import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";

import React, { useEffect, useState } from "react";
import { ServiceReport } from "../../services/ReportService";

import { Link } from "react-router-dom";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import "./style.scss";
function ReviewsList() {
  const [resultList, setResultList] = useState([]);
  useEffect(() => {
    const service = new ServiceReport();
    const fetchData = async () => {
      const result = await service.getReviewsList();
      setResultList((_) => result.message);
    };
    fetchData();
  }, []);

  const [loading, setLoading] = useState<{ [key: string]: number }>({});

  const run = async (uid: string) => {
    try {
      let status: any = {
        ...loading,
      };
      status[uid] = 0;
      setLoading({ ...loading, ...status });

      const service = new ServiceReport();
      await service.processData(uid, (st: number) => {
        let status: any = {
          ...loading,
        };
        console.log(st, st == 99);
        if (st == 99) {
          status[uid] = 100;
        } else if (st < 0) {
          status[uid] = "Erro";
        } else {
          status[uid] = st;
        }
        setLoading({ ...loading, ...status });
      });
    } catch (e) {
      console.log("ooooooooo");
      let status: any = {
        ...loading,
      };
      status[uid] = "Erro";
      setLoading({ ...loading, ...status });
    }
  };
  function click(url: string) {
    window.location.href = url;
  }

  function delete_uid(uid: string) {}
  return (
    <div>
      <button onClick={() => click("/upload")} className="btn_grade">
        New GRADE Classification
      </button>
      <h2>Review List</h2>
      <List>
        {resultList.map((item: any) => {
          return (
            <ListItem disablePadding>
              <Link
                to={
                  item.response === null
                    ? "./final-revision/" + item.uid
                    : "./grade-preview/" + item.uid
                }
                style={{
                  width: "83%",
                  display: "flex",
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.uid} secondary={item.created_at} />
                <ListItemText secondary={item.path?.split("uploads/")[1]} />
              </Link>

              <Button
                onClick={() => run(item.uid)}
                variant="contained"
                color="primary"
                endIcon={<AutorenewIcon />}
              >
                Reprocess{" "}
                {loading &&
                  loading[item.uid] != undefined &&
                  `(${loading[item.uid]})`}
              </Button>
              <Button
                onClick={() => delete_uid(item.uid)}
                color="error"
                endIcon={<DeleteIcon />}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

export default ReviewsList;
