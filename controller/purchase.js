const Razorpay=require('razorpay');

const Order=require('../models/orders');
const admin=require('../controller/admin');


exports.getpurchasepremium=(req,res,next) =>{
    try{
            var raz=new Razorpay({  key_id: process.env.RAZORPAY_KEY_ID,  key_secret: process.env.RAZORPAY_KEY_SECRET})
              
            
            const amount=2500;

            raz.orders.create({amount, currency:"INR"},(err,order) =>{

                if(err){
                    throw new Error(JSON.stringify(err));
                }
                
                req.user.createOrder({ orderid: order.id, status:""})
                .then(() =>{
                    return res.status(201).json({order, Key_id: raz.Key_id});
                })
                .catch(err=> console.log(err)); 
            })
    }
    catch(err){
        console.log(err);
        res.status(400).json({message:'something went wrong from purchase file' , error: err});
    }
}


exports.updatetransactionstatus= async (req,res,next) =>{
        try{
            const userid=req.user.id;
            const {payment_id, order_id}= req.body;
         
             const order=await Order.findOne({where :  {orderid : order_id}});
         
                const  promise1= await order.update({paymentid : payment_id, status: "successfull"});
                 const promise2=await  req.user.update({ispremiumuser : true});

                 
                    Promise.all([promise1,promise2]).then((check) =>{
                        return res.status(202).json({success:true, message:'Transaction successfull', token: admin.generatetoken(userid,undefined,true)});
                     }).catch(err => 
                        {
                            throw new Error(err);
                        })              
                                         
        }
        catch(err) {
            console.log(err);
        }
}
