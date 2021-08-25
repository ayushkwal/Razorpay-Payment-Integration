const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const Razorpay = require('razorpay')

app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var instance = new Razorpay({
    key_id: 'rzp_test_UACj7zr3oyYdYc',
    key_secret: 'l4MmS60gdfTHBhI5dHNiJcxg',
  });


app.get('/',(req,res)=>{
    res.render('index')
})
app.post('/create/orderId',async(req,res)=>{
    console.log(req.body)
    var options = {
        amount: req.body.amount*100,  // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.json({orderId:order.id})
      });
})


app.post("/api/payment/verify",(req,res)=>{

  let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
 
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', 'l4MmS60gdfTHBhI5dHNiJcxg')
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.response.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.response.razorpay_signature)
   {
     console.log('tttrrrruuuuuue')
     response={"signatureIsValid":"true"}
   }else{
    console.log('faalseue')

   }

       res.send(response);
   });

app.listen(3000,()=>{
    console.log('listening port')
})

// rzp_test_UACj7zr3oyYdYc
// l4MmS60gdfTHBhI5dHNiJcxg