var express       = require("express");
var router        = express.Router();
var passport      = require("passport");
var User          = require("../models/user");

//----------------HOME-------------------
router.get("/", function(req, res){
    res.render("home");

});

//--------------AUTH ROUTES---------------------

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);            
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "User "+ user.username +" registered succesfully.");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req,res){

});

router.get("/logout", function(req,res){
    req.logOut();
    req.flash("success", "User logged out succesfully.");
    res.redirect("/campgrounds");
});


module.exports=router;