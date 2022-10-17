var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var schemas = require("../models/schemas.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/:id", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.render("toy", {
      title: "Edit",
      loggedIn: false,
      error: "Invalid Request",
    });
  } else {
    let id = req.params.id;
    let err = "";

    let toys = schemas.toys;
    let qry = { _id: id };

    let itemResult = await toys.find(qry).then((itemData) => {
      if (itemData == null) {
        err = "Invalid ID";
      }

      res.render("toy", {
        title: "Edit Toy",
        item: itemData,
        loggedIn: sesh.loggedIn,
        error: err,
      });
    });
  }
});

router.get("/delete/:id", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let toys = schemas.toys;
    let toyId = req.params.id;
    let qry = { _id: toyId };
    let deleteResult = await toys.deleteOne(qry);
    res.redirect("/");
  }
});

router.post("/save", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let toyId = req.body.toyId;
    let toyName = req.body.toyName;
    let toyIcon = req.body.toyIcon;
    // let menuUrl = req.body.menuUrl;
    let toys = schemas.toys;

    let qry = { _id: toyId };

    let saveData = {
      $set: {
        name: toyName,
        icon: toyIcon,
        // menuUrl: menuUrl,
      },
    };

    let updateResult = await toys.updateOne(qry, saveData);

    res.redirect("/");
  }
});

router.post("/new", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let toyName = req.body.toyName;
    let toyIcon = req.body.toyIcon;
    // let menuUrl = req.body.menuUrl;
    let toys = schemas.toys;

    let qry = { name: toyName };

    let searchResults = await toys.findOne(qry).then(async (userData) => {
      if (!userData) {
        // ok to add toy
        let newToy = new schemas.toys({
          name: toyName,
          icon: toyIcon,
        });

        let saveToy = await newToy.save();
      }
    });

    res.redirect("/");
  }
});

module.exports = router;
