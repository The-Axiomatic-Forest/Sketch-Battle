let mongoose = require("mongoose"),
    bcrypt = require("bcrypt"),
    salt = bcrypt.genSaltSync(10),
    Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wins:{
        type: Number,
        default:0
    } ,
    losses:{
        type: Number,
        default:0
    } 
});

userSchema.pre("save", function(next){
    this.password=bcrypt.hashSync(this.password+this.username,salt);
    next();

});

userSchema.methods.auth=function(passwordAttempt,cb){
    bcrypt.compare(passwordAttempt+this.username, this.password, (err,result)=>{
        if (err){
            console.log(err);
            cb(false);
        } else if(result){
            cb(true);
        } else{
            cb(false);
        }
    });
};


module.exports = mongoose.model("users", userSchema);