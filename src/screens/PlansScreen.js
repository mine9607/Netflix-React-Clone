import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, onSnapshot, where } from "firebase/firestore";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import "./PlansScreen.css";
import db from "../firebase";

export default function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    //need to navigate to the subscription
    const fetchSubscription = async () => {
      const subscriptionRef = collection(db, "customers", user.uid, "subscriptions");
      const querySubscription = query(subscriptionRef);
      try {
        const subscriptionSnap = await getDocs(querySubscription);

        for (const plan of subscriptionSnap.docs) {
          setSubscription({
            role: plan.data().role,
            current_period_end: plan.data().current_period_end.seconds,
            current_period_start: plan.data().current_period_start.seconds,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSubscription();
  }, [user.uid]);

  //console.log(subscription);

  //Do not edit below
  useEffect(() => {
    const fetchData = async () => {
      const productRef = collection(db, "products");
      const queryProducts = query(productRef, where("active", "==", true));
      const products = {};

      try {
        const querySnapshot = await getDocs(queryProducts);

        for (const productDoc of querySnapshot.docs) {
          products[productDoc.id] = productDoc.data();

          const priceRef = productDoc.ref;
          const priceCollection = collection(db, priceRef.path, "prices");
          const priceSnap = await getDocs(priceCollection);

          priceSnap.forEach((priceDoc) => {
            products[productDoc.id].prices = {
              priceId: priceDoc.id,
              priceData: priceDoc.data(),
            };
          });
        }

        // Set the state after all data is fetched and processed
        setProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const loadCheckout = async (priceId) => {
    //create a new document in a newly created collection "checkout_sessions"
    const docRef = await addDoc(collection(db, "customers", user.uid, "checkout_sessions"), {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });
    console.log(docRef);
    console.log(docRef.id);

    onSnapshot(docRef, async (snap) => {
      //onSnapshot(doc(docRef.id), async (snap) => {
      const { error, sessionId } = snap.data();
      console.log(sessionId);

      if (error) {
        //show an error to your customer and inspect your Cloud Function logs in the FB console
        alert(`An error has occurred: ${error.message}`);
      }

      if (sessionId) {
        //We have a session, let's redirect to Checkout
        //Init Stripe
        console.log(sessionId);
        const stripe = await loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_API_KEY}`);
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
      {Object.entries(products).map(([productId, productData]) => {
        //Todo: add some logic to check if the user's subscription is active...
        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role.toLowerCase());

        return (
          <div key={productId} className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`}>
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
