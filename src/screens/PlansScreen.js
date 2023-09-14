//import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import "./PlansScreen.css";
import db from "../firebase";

export default function PlansScreen() {
  //const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  async function fetchProducts() {
    const productsCol = collection(db, "products");
    console.log(productsCol.id);
    const productSnapshot = await getDocs(productsCol);
    console.log(productSnapshot.id);

    console.log(productSnapshot.docs);
    const productList = productSnapshot.docs.map((doc) => doc.id);
    console.log(productList);

    return productList;
  }

  const loadCheckout = async (priceId) => {
    const docRef = await collection(db, "customers").doc(user.uid).collection(db, "checkout_sessions").add({
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        //Show an error to your customer and inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message} `);
      }

      if (sessionId) {
        //We have a session, let's redirect to Checkout
        //Init Stripe

        const stripe = await loadStripe(
          "pk_test_51Nq3s9BBXczy7crogv2zWloHNrQntIgLe5l1dJWlmJqnvUTlLLLbSPO6bJG2LEZzk7jDyTR9a7bijwdIZDw5Iz0s00eudP2fja"
        );
        stripe.redirectToCheckout({ sessionID });
      }
    });
  };

  return (
    <div className="plansScreen__plan">
      <div className="plansScreen__info">
        <h5>Plan Name</h5>
        <h6>Description</h6>
      </div>
      <button onClick={fetchProducts}>Test</button>
    </div>
  );
}
