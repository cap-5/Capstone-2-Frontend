// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { API_URL } from "../shared";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Container } from "@mui/material";

// const GetGroupReceipts = () => {
//   const [groupName, setGroupName] = useState("");
//   const [groupRecpits, setGroupRecpits] = useState([]);
//   const { groupId } = useParams();
//   console.log("groupId:", groupId);

//   const fetchGroupRecpits = async () => {
//     try {
//       const groupReceiptsRes = await axios.get(
//         `${API_URL}/api/group/GroupReceipts/${groupId}`
//       );
//       console.log("GROUP RECEIPTS RESPONSE: ", groupReceiptsRes);
//       setGroupRecpits(groupReceiptsRes.data);
//       // setGroupName(groupNameRes.data.groupName);
//     } catch (err) {
//       console.error("no group recpits", err);
//     }
//   };

//   const fetchGroupName = async () => {
//     try {
//       const groupNameRes = await axios.get(
//         `${API_URL}/api/group/myGroups/${groupId}`
//       );
//       console.log("GROUP NAME RESPONSE: ", groupNameRes);
//       setGroupName(groupNameRes.data.groupName);
//     } catch (err) {
//       console.error("EROR: ", err);
//       console.log("Failed to fetch group's name.");
//     }
//   };

//   useEffect(() => {
//     fetchGroupRecpits();
//     fetchGroupName();
//   }, []);

//   console.log("Fetching group receipts", groupRecpits);
//   console.log("GROUP NAME: ", groupName);
//   // return (
//   //   <div>
//   //     <ul>
//   //       {groupRecpits.map((recpit) => {
//   //         return <li key={recpit.id}>title: {recpit.title}</li>;
//   //       })}
//   //     </ul>
//   //   </div>
//   // );

//   return (
//     <Container maxWidth="md">
//       <h1>Receipt History for {groupName}</h1>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                 Body
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                 Category
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                 Total
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                 Created At:
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {groupRecpits.map((receipt) => (
//               <TableRow
//                 key={receipt.id}
//                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {receipt.title}
//                 </TableCell>
//                 <TableCell align="right">
//                   {receipt.body.substring(0, 50)}
//                 </TableCell>
//                 <TableCell align="right">
//                   {receipt.category ? receipt.category : "No category provided"}
//                 </TableCell>
//                 <TableCell align="right">
//                   ${receipt.totalPay ? receipt.totalPay : 0}
//                 </TableCell>
//                 <TableCell align="right">
//                   {receipt.createdAt.substring(0, 10)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default GetGroupReceipts;
