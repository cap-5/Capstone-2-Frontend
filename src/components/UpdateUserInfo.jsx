import React, { useEffect, useState } from "react";
import axios from "axios";

const UpadteUserInfo = () => {
  const [userInfo, setUerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const getUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        withCredentials: true,
      });
      console.log(res.data);
      const updateUser = res.data.userInfo;
      setUerInfo({
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
      });
    } catch (err) {
      console.error("info could not be displayed", err);
    }
  };

  const updateUserData = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8080/api/users/1",
        userInfo
      );
      console.log(res.data.User);
      const grabUserInfo = res.data.User;
      console.log(grabUserInfo);
      setUerInfo({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      });
    } catch (err) {
      console.error("can not update user info ", err);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    //the object browser gives me whenever people do somthin like click
    e.preventDefault();
    updateUserData();
    //the function makes sure the page does prevents the page  //from refshing after loading so your logic can go through
    console.log("form was summited", userInfo);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="user-container">
      <p>Welcome, {userInfo.firstName}</p>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name{userInfo.firstName}</th>
            <th>Last Name{userInfo.lastName}</th>
            <th>email {userInfo.email}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userInfo.firstName}</td>
            <td>{userInfo.lastName}</td>
            <td>{userInfo.email}</td>
          </tr>
        </tbody>
      </table>
      <div className="form-group">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userInfo.firstName}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter first name"
        />
        <button className="form-button" onClick={handleSubmit}>
          Update
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="lastName" className="form-label">
          lastName
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userInfo.lastName}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter last name"
        />
        <button className="form-button" onClick={handleSubmit}>
          Update
        </button>
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter your email"
        />
        <button className="form-button" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};
export default UpadteUserInfo;
