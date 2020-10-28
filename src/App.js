import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from './Checkout';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Orders from './Orders';



function App() {
  const promise= loadStripe('pk_test_51Hds5DDdQWukj4lnFtzQdSTN6iTslkZxSeAhz0QLthCkQaahykXNnT3c1dlm7rhdk3Y5QLegWmVcOZWAMFZlXKfW00GdSZGiSL');
  const [{}, dispatch] =useStateValue();
  useEffect(() => {
    //will only run once when the app component loads...
    
    auth.onAuthStateChanged( (authUser) => {
      console.log("The User is >>>>>>", authUser);

      if(authUser){
        //the user just logged in/thr user was logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }
      else{
        //the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }

    } )

  }, [])
  return (
    //BEM convention
    <Router>
      <div className="App">
    
        <Switch>
        <Route path="/login">
           <Login/>
        </Route>
        <Route path="/orders">
            <Header />
            <Orders />
        </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
         </Switch>
      </div>
    </Router>
  );
}

export default App;