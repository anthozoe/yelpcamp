var express       = require("express");
var app           = express();
var request       = require("request");
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var passport      = require("passport");
var LocalStrategy = require("passport-local"); 
var User          = require("./models/user");
var methodOverride= require("method-override");
var flash         = require("connect-flash");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

//SEEDING THE DATABASE
var seedDB = require("./seeds");
//seedDB();

//------------------APP CONFIG----------------------
mongoose.connect("mongodb://Zoe:123@yelpcamp-shard-00-00-edzg2.mongodb.net:27017,yelpcamp-shard-00-01-edzg2.mongodb.net:27017,yelpcamp-shard-00-02-edzg2.mongodb.net:27017/test?ssl=true&replicaSet=yelpcamp-shard-0&authSource=admin&retryWrites=true&w=majority", 
{ useNewUrlParser: true,  useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//--------------AUTH CONFIG-----------------
app.use(require("express-session")({
    secret:"Mickey I love you",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-----------------FINDING CURRENT USER-------------
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//------------------USING ROUTES-------------------
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//------------------PORT CONFIG-------------------
app.listen(3000, function(){
    console.log("Yelp Camp Server is on!")
});