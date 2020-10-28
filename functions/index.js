const functions = require('firebase-functions');
const express =   require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51Hds5DDdQWukj4lnussE2fzy6qkgee0IA3qiSCSVZMG6as9hEXyfrXrrfp5CXFz24Xn4opM5l3cMaiwAJq7Z6Z2W00ApHjZf4c')

//API setUP now

//API config
const app = express();


//Middlewares
app.use(cors({origin : true}));
app.use(express.json());

//API routes
app.get('/', (request, response) => {
    response.status(200).send("Hello World");
})

app.post('/payments/create', async (request, response) => {
    const total = request.query.total;

    console.log("Payment Request received ! BOOM !! for this amount", total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });

    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })

})


//Listen command
exports.api = functions.https.onRequest(app);



//http://localhost:5001/clone-/us-central1/api -----API endpoint

//http://localhost:5000

//http://localhost:4000/logs?q=metadata.emulator.name%3D%22functions%22