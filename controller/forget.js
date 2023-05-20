const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const SibApiV3Sdk = require('sib-api-v3-sdk');

const forgotpassword = async (req, res) => {
    try {
        const emails=req.body.em;
        console.log(emails);

        const user = await User.findOne({where : { email: emails }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

                let defaultClient = SibApiV3Sdk.ApiClient.instance;

                let apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey =process.env.SENDINBLUE_KEY;
                
                let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                
                let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                
                const reciever=[
                    {
                        email:emails
                    }
                ]

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent = `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`;
sendSmtpEmail.sender = {"name":"Sendinblue","email":"justexample@gmail.com"};
sendSmtpEmail.to =reciever
// sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
// sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
// sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
// sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
// sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(responnse) {
     res.status(200).json({message: 'Link to reset password sent to your mail ', sucess: true})
    //console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error) {
console.error(error);
});
}

    }
    catch(err) {
        console.log(err);
    }
}
const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id:id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/updatepassword/${id}" method="GET">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ Password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}
// exports.resetpassword=(req,res) =>{
//         const emails=req.body.em;
//         console.log(emails);

       
// let defaultClient = SibApiV3Sdk.ApiClient.instance;

// let apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';

// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// const reciever=[
//     {
//         email:emails
//     }
// ]
// sendSmtpEmail.subject = "My {{params.subject}}";
// sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email </h1></body></html>";
// sendSmtpEmail.sender = {"name":"Sendinblue","email":"justexample@gmail.com"};
// sendSmtpEmail.to =reciever
// // sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
// // sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
// // sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
// // sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
// // sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

// apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
//   console.log('API called successfully. Returned data: ' + JSON.stringify(data));
// }, function(error) {
//   console.error(error);
// });
// }
    
