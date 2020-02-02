var express       = require("express");
var router        = express.Router();
var Campground    = require("../models/campground");
var middleware    = require("../middleware/index");

//----------------INDEX--------------------

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }
        else {
            console.log("Found all campgrounds and added them to the site");
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});

        }
    });     
});

//------------------CREATE----------------------
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var price=req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name, image: image, price: price, description: description, author: author};
    Campground.create(newCampground,
     function(err, newcampground){
        if (err){
            console.log("There was an error");
            console.log(err);
        }
        else{
            req.flash("success", "Campground added succesfully.");
            res.redirect("/campgrounds");
        }
    });     
});

//-----------------------SHOW-----------------------------
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
       if (err){
           console.log(err)
       }
       else {
        res.render("campgrounds/show", {campground: foundCampground});
     }
    });
});

//----------------------EDIT----------------------------
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit", {campground: foundCampground});
   });
      
});

//----------------------UPDATE---------------------------
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground updated succesfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//---------------------DESTROY-----------------------

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground deleted succesfully.");
            res.redirect("/campgrounds");
        }
    });
});


module.exports=router;