const express = require("express");
const router = express.Router();
 
router.get("/", (req, res) => {
  res.send("Does this work?? LMFAO");
});

module.exports = router;
