import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";

// ---- CSS MUI IMPORTS BELOW HERE ---- \\
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Skeleton,
  TablePagination,
  TableSortLabel,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Slider,
  Grid,
  LinearProgress,
  Button,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";

const UserReceipts = () => {
  const [userReceipts, setUserReceipts] = useState([]);
  const navigate = useNavigate();
  const getGroupId = (r) => r.Group_Id ?? r.groupId ?? r.GroupId;

  const fetchUserReceipts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/user-receipts`, {
        withCredentials: true,
      });
      console.log(res.data);
      setUserReceipts(res.data);
      console.log(userReceipts);
    } catch (err) {
      console.error("no repicpts exist for user", err);
    }
  };
  useEffect(() => {
    fetchUserReceipts();
  }, []);
  console.log("this is user", userReceipts);

  // return (
  /* <div className="receipt-container">
      <ul>
        {userReceipts.map((recpit) => (
          <li key={recpit.id}>
            <h2>Title:{recpit.title}</h2>
            <ul>
              <li>Body: {recpit.body}</li>
              <li>
                Category:{" "}
                {recpit.category ? recpit.category : "No category provided"}
              </li>
              <li>Total: ${recpit.totalPay ? recpit.totalPay : 0}</li>
              <li>Created at: {recpit.createdAt}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div> */

  return (
    <Container maxWidth="md">
      <h1>Your Receipt History</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Body
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Created At:
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userReceipts.map((receipt) => {
          const groupId = getGroupId(receipt);
          return (
            <TableRow
              key={receipt.id}
              onClick={() => navigate(`/assign/${groupId}/${receipt.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/assign/${groupId}/${receipt.id}`);
                }
              }}
              role="button"
              tabIndex={0}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <TableCell component="th" scope="row">
                {receipt.title}
              </TableCell>
              <TableCell align="right">
                {receipt.body?.substring(0, 50)}
              </TableCell>
              <TableCell align="right">
                {receipt.category ? receipt.category : "No category provided"}
              </TableCell>
              <TableCell align="right">
                ${receipt.totalPay ? receipt.totalPay : 0}
              </TableCell>
              <TableCell align="right">
                {receipt.createdAt?.substring(0, 10)}
              </TableCell>
            </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserReceipts;
