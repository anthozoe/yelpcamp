var express = require("express");
var app= express();
var request= require("request");
var bodyParser= require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgroungSchema= mongoose.Schema({
    name: String,
    image: String,
    description: String

});

var Campground= mongoose.model("Campground", campgroungSchema);


app.get("/", function(req, res){
    res.render("home");

});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }
        else {
            console.log("Found all campgrounds and added them to the site");
            res.render("index", {campgrounds: allCampgrounds});

        }
    }); 
    
});

// Campground.create({name: "High Mountain", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg", description:"Very Nice Mountain!"},
//     function(err, newcampground){
//        if (err){
//            console.log("There was an error");
//            console.log(err);
//        }
//        else{
//            console.log("Added a new campground!");
    
//        }
//    });

app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

app.post("/campgrounds", function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground= {name: name, image: image, description: description};
    Campground.create(newCampground,
     function(err, newcampground){
        if (err){
            console.log("There was an error");
            console.log(err);
        }
        else{
            console.log("Added a new campground!");
            res.redirect("/campgrounds");
        }
    });
     
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if (err){
           console.log(err)
       }
       else {
        res.render("show", {campground: foundCampground});

       }

    });
   

});

//fhdfhsffds;s



app.listen(3000, function(){
    console.log("Yelp Camp Server is on!")
});