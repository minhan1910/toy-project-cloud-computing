var express = require("express");
var router = express.Router();
var schemas = require("../models/schemas.js");

/* GET home page. */
router.get("/", async (req, res) => {
  let toys = schemas.toys;
  let sesh = req.session;

  let toyResult = await toys.find({}).then((toyData) => {
    res.render("index", {
      title: "Toy App",
      data: toyData,
      search: "",
      loggedIn: sesh.loggedIn,
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/q", async (req, res) => {
  let toys = schemas.toys;
  let q = req.body.searchInput;
  let toyData = null;
  let sesh = req.session;
  let qry = { name: { $regex: "^" + q, $options: "i" } };

  if (q != null) {
    let toyResult = await toys.find(qry).then((data) => {
      toyData = data;
    });
  } else {
    q = "Search";
    let toyResult = await toys.find({}).then((data) => {
      toyData = data;
    });
  }

  res.render("index", {
    title: "Toy App",
    data: toyData,
    search: q,
    loggedIn: sesh.loggedIn,
  });
});

module.exports = router;
