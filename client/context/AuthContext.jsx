//here will add all state variable n func related

import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast"; // FIX 8: removed unused Toaster import (rendered in App.jsx)
import {io} from "socket.io-client";
//port url
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();
export const AuthProvider = ({children}) =>{
    const [token,setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [socket, setSocket] = useState(null);
    // check if user is authenticated and if so , set the user data and connect the socket
    const checkAuth = async()=>{
        try {
            // if data is there then check if user is valid
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
        //for error use toast notification 
          toast.error(error.message)
        }
    }
    // login func to handle user authentication and socket connection 
    const login = async(state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token)
                // after success login signup a toast notif will be displayed
                toast.success(data.message)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // logout func
 const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    // FIX 7: guard against socket being null before disconnecting
    if (socket) {
        socket.disconnect();
        setSocket(null);
    }
 }
 const updateProfile = async(body)=>{
    try {
        const {data}= await axios.put("/api/auth/update-profile" , body);
        if(data.success){
            setAuthUser(data.user)
            toast.success("Profile updated successfully")
        }
    } catch (error) {
        toast.error(error.message)
    }
 }

    //connect socket fucn to handle socket connection and online users updates
    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query:{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }
    useEffect(()=>{
        if(token){
           axios.defaults.headers.common["token"] = token; 
        }
         checkAuth();
    },[])
    const value = {
     axios,
     authUser,
     onlineUsers,
     socket,
     login,
     logout,
     updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
            
        </AuthContext.Provider>
    )
}