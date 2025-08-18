import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
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
            {userReceipts.map((receipt) => (
              <TableRow
                key={receipt.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {receipt.title}
                </TableCell>
                <TableCell align="right">
                  {receipt.body.substring(0, 50)}
                </TableCell>
                <TableCell align="right">
                  {receipt.category ? receipt.category : "No category provided"}
                </TableCell>
                <TableCell align="right">
                  ${receipt.totalPay ? receipt.totalPay : 0}
                </TableCell>
                <TableCell align="right">
                  {receipt.createdAt.substring(0, 10)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserReceipts;
