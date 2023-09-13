import React, { useRef } from "react";
import "./SignupScreen.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

//review this page for authentication: https://firebase.google.com/docs/auth/web/start

function SignupScreen() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const register = async (event) => {
    event.preventDefault();

    // await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
    //   .then((userCredential) => {
    //     // Signed in
    //     console.log(userCredential);
    //     const user = userCredential.user;
    //     console.log(user);
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(errorCode);
    //     console.log(errorMessage);
    //     // ..
    //   });
    console.log("clicked");
  };

  // const signIn = (event) => {
  //   event.preventDefault();

  //   const loginEmailPassword = async () => {
  //     const loginEmail = emailRef.current.value;
  //     const loginPassword = passwordRef.current.value;

  //     const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  //   };
  // };

  return (
    <div className="signupScreen">
      <form>
        <h1>Sign In</h1>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />
        <button onClick type="submit">
          Sign In
        </button>
        <h4>
          <span className="signupScreen__gray">New to Netflix? </span>{" "}
          <span className="signupScreen_link" onClick={register}>
            Sign Up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;
