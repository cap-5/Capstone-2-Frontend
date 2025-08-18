import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

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
  return (
    <div>
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
    </div>
  );
};

export default UserReceipts;
