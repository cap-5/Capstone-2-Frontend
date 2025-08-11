import React, { useEffect, useState } from "react";
import axios from "axios";

const GetGroupReceipts = () => {
  const [groupRecpits, setGroupRecpits] = useState([]);
  const fetchGroupRecpits = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/group/2");
      console.log(res.data);
      setGroupRecpits(res.data);
    } catch (err) {
      console.error("no group recpits", err);
    }
  };
  useEffect(() => {
    fetchGroupRecpits();
  }, []);
  console.log("Fetching group receipts", groupRecpits);
  return (
    <div>
      <ul>
        {groupRecpits.map((recpit) => {
          return <li key={recpit.id}>title: {recpit.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default GetGroupReceipts;
