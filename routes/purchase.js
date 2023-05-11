const expanse=require('express');

const routes=expanse.Router();
const purchase=require('../controller/purchase');
const auth=require('../middleware/auth');

routes.get('/purchasepremium' ,auth.authorization ,purchase.getpurchasepremium);
routes.post('/updatetransaction', auth.authorization, purchase.updatetransactionstatus);



module.exports=routes;
