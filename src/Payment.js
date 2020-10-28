import React, { useEffect, useState } from 'react'
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider'
import './Payment.css'
import { Link, useHistory } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import {db} from './firebase'


function Payment() {
    const [{basket , user}, dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);
    const history = useHistory();
    
    useEffect(()=> {
        //generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                //Stripe expects the total in a currencies subunits, means in cents/paisa
                url: `/payments/create?total=${getBasketTotal(basket)*100}`

            });
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
    }, [basket]);

    console.log("The Secret is >>>>", clientSecret);
    console.log("the user is", user);
    
    
    const handleSubmit = async (e) => {
        //do all the fancy stripe stuff here...
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            }).then(({paymentIntent})=> {//destructuring response to paymentIntent
                //paymentIntent is equal to payment Confirmation

                db
                    .collection("users")
                    .doc(user?.uid)
                    .collection("orders")
                    .doc(paymentIntent.id)
                    .set({
                        basket: basket,
                        amount: paymentIntent.amount,
                        created: paymentIntent.created
                    })



                setSucceeded(true);
                setError(null);
                setProcessing(false);

                dispatch({
                    type: "EMPTY_BASKET"
                })

                history.replace('/orders');//to avoid coming back to payment page after pressing back on keyboard.

            })

            




    }
    const handleChange = e => {
        //Listen for changes in the CardElement
        //and display any errors as the customer types their card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }
    return (
        <div className="payment">
            <div className="payment__container">
            
                <h1>CheckOut(<Link to="/checkout">{basket?.length} items</Link>)</h1>

                 {/*Payment Section -- delivery Address */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 Lane</p>
                        <p>Tampines</p>
                        <p>Singapore</p>
                    </div>
                </div>
                {/*Payment Section -- Review Items */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review Items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map( item=> (
                            <CheckoutProduct 
                                id = {item.id}
                                title = {item.title}
                                price = {item.price}
                                rating = {item.rating}
                                image = {item.image}
                            />
                        ))}
                        
                    </div>
                    
                </div>

                {/*Payment Section -- Payment Method */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        {/*Stripe Magic */}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>

                            <div className="payment__priceContainer">
                                <CurrencyFormat value={getBasketTotal(basket)}
                                        decimalScale={2}
                                        displayType={"text"} 
                                        thousandSeperator={true} 
                                        prefix={"$"} 
                                        renderText={(value) => (
                                            
                                                <h3>
                                                    Order Total : <strong>{value}</strong>
                                                </h3>
                                                
                                        )}
                                />
                                <button disabled={processing || disabled ||succeeded}>
                                        <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button>
                            </div>
                            {/* Errors */}
                            {error && <div>{error}</div>}
                            
                        </form>
                    </div>
                    
                </div>

            </div>
            
        </div>
    )
}

export default Payment
