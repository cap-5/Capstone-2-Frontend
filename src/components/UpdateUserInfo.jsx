import React, { useState } from "react" ;
import axios from "axios";


const UpadteUserInfo = () =>  {
    const [userInfo,setUerInfo] = useState({
        firstName:"",
        lastName:"",
        email: ""

    })
}
const fetchUserData = async ()=> {
    try{
const res = await axios.post("http://localhost:8080/api/users/3",
    userInfo,
    {
        withCredentials:true,
    }

)
    }catch(err){

    }
}
export default UpadteUserInfo;