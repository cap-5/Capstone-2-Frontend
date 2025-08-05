import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DisplayUserInfoStyle.css";

const DisplayUserInfo = (userInfo) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
        });
        console.log(res.data);
        const updateUser = res.data.userInfo;
        setFormData({
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          email: updateUser.email,
        });
      } catch (err) {
        console.error("info could not be displayed", err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="user-container">
      <p>Welcome, {formData.firstName}</p>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name{formData.firstName}</th>
            <th>Last Name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formData.firstName}</td>
            <td>{formData.lastName}</td>
            <td>{formData.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisplayUserInfo;
