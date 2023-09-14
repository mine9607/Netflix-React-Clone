import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        //Logged in
        console.log(userAuth);
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
      } else {
        //Logged Out
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  console.log(user);
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={!user ? <LoginScreen /> : <Navigate replace to={"/"} />} />
        <Route exact path="/" element={<HomeScreen />} />
        <Route exact path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
