import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayUserReceipts = () => {
  const [userReceipts, setUserReceipts] = useState([]);
  const fetchUserReceipts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/1");
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
  return (
    <div>
      <ul>
        {userReceipts.map((recpit) => {
          return (
            <li key={recpit.id}>
              title:{recpit.title},{recpit.body}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DisplayUserReceipts;
