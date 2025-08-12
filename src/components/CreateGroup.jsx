import React, { useState, useEffect } from "react";
import axios from "axios";
const MakeGroup = () => {
  const [groupData, setGroupData] = useState({
    description: "",
    groupName: "",
  });

  const fetchGroupData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/group/create",
        groupData,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.group); //grabbing the api
      const grabInfo = res.data.group; //res is the data from the sever and the data is just to grab the sepecfic data i need
      setGroupData({
        description: grabInfo.description,
        groupName: grabInfo.groupName, //create a object in setGroupData and setting it value to
      });
      console.log(grabInfo);
    } catch (err) {
      console.error("Cannot create new group", err);
    }
  };
  //useEffects fetches data
  // useEffect(() => {
  //makes sure to only run the code inside is render in this case it would be fetchGroupdata function
  // }, []); //depency array what the compoent loads it renders and you would want to put a varible everytime it changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGroupData();
    console.log("Form was submitted!", groupData);
    // You can also POST groupData here if needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="groupName">Group Name:</label>
      <input
        type="text"
        id="groupName"
        name="groupName"
        value={groupData.groupName}
        onChange={handleChange}
      />
      <br />
      <br />

      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        name="description"
        value={groupData.description}
        onChange={handleChange}
      />
      <br />
      <br />

      <button type="submit">Create Group</button>
    </form>
  );
};

export default MakeGroup;
