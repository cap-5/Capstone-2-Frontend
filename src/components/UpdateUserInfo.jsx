import React, { useState } from "react";
import axios from "axios";

const UpadteUserInfo = () => {
  const [userInfo, setUerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
};
const fetchUserData = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/users/3",
      userInfo,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.User);
    const grabUserInfo = res.data.User;
    setUerInfo({
      firstName: grabUserInfo.firstName,
      lastName: grabUserInfo.lastName,
      email: grabUserInfo.email,
    });
  } catch (err) {
    console.error("can not update user info ", err);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    //the object browser gives me whenever people do somthin like click
    e.preventDefault(); //the function makes sure the page does prevents the page  //from refshing after loading so your logic can go through
    UpadteUserInfo();
    console.log("form was summited", userInfo);
  };

  return <form onSubmit={handleSubmit}></form>;
};
export default UpadteUserInfo;
