const express = require("express");

const app = express();
const passport = require("passport");
const auth = require("../../middleware/auth")
const userSchema = require("../../model/UserModel")
const paymentSchema = require("../../model/PaymentModel")

app.use(passport.initialize());
app.use(passport.session());
// Set default API response
app.post("/",auth, (req, res) => {
    const {user_id} = req.user
    const {type=0} = req.body
    const payScheme = new paymentSchema()
    payScheme.user_id = user_id;
    payScheme.created_at = new Date()
    payScheme.status = true;
    payScheme.type = type
    payScheme.save(err=>{
        if(err) throw err
        userSchema.findOneAndUpdate({username:user_id},{isPaid:true}).then((userDetails)=>{
            res.status(200).send({
                status:true,
                message:"Account have been recharged",
                data:{...userDetails._doc,...payScheme._doc}
            })
        })
    })


});

app.get("/",auth,(req,res)=>{
    res.send("WORKING")
})


// Export API routes
module.exports = app;