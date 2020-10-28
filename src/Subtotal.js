import React from 'react'
import "./Subtotal.css"
import CurrencyFormat from "react-currency-format";
import { ShoppingBasket } from '@material-ui/icons';
import { useStateValue } from './StateProvider';
import { getBasketTotal } from './reducer';
import { useHistory } from 'react-router-dom';

function Subtotal() {
    const history = useHistory();
    const [{basket}, dispatch] = useStateValue();
    return (
        <div className="subtotal">
            <CurrencyFormat value={getBasketTotal(basket)}
                decimalScale={2}
                displayType={"text"} 
                thousandSeperator={true} 
                prefix={"$"} 
                renderText={(value) => (
                    <>
                        <p>
                SubTotal ({basket?.length} items): <strong>{value}</strong>
                        </p>
                        <small className="subtotal__gift">
                            <input type="checkbox"/>This Order contains a gift
                        </small>
                    </>
                )}
            />
            <button onClick = {e => history.push('/payment')}>Proceed to Checkout</button>
            
        </div>
    )
}

export default Subtotal
