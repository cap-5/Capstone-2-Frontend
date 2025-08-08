import React, { useState, useEffect } from "react";
import axios from "axios";

const DisplayUserInfo = () => {
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

        const updateUser = res.data.userInfo;
        setFormData({
          firstName: updateUser.firstName || "",
          lastName: updateUser.lastName || "",
          email: updateUser.email || "",
        });
      } catch (err) {
        console.error("Info could not be displayed", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-container">
      <p>Welcome, {formData.firstName}</p>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
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
