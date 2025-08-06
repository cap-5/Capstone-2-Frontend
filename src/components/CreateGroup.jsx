// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const createGroup = (groupInfo) => {
//   const [createGroup, setCreateGroup] = useState({
//     description: "",
//     groupName: "",
//     Receipt_Id: [],
//   });

//   const fetchGroupData = async () => {
//     try {
//       const res = await axios.post("http://localhost:8080/api/group/create");
//       const grabInfo = res.data.grabInfo; // this the user info the info that i want and i pass
//       setCreateGroup({
//         description: grabInfo.description,
//         groupName: grabInfo.groupName,
//         Receipt_Id: grabInfo.Receipt_Id,
//       });
//     } catch (err) {
//       console.error("cant not create new group", err);
//     }
//   };
//   const handleChang = (e) => {
//     const { name, value } = e.target;
//     setCreateGroup((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   return(<p>welcome {createGroup.groupName}</p>
// <input 


//   );
// };
// export default createGroup;
