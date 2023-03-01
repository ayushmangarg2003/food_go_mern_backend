const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtsecret = "hiiamayushman"

router.post(
  "/createuser",
  [
    body("email", "Incorrect Email").isEmail(),
    body("name").isLength({ min: 1 }),
    body("password", "Incorrect Password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(req.body.password , salt)
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      // console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email", "Incorrect Email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let userdata = await User.findOne({ email });
      if (!userdata) {
        return res.status(400).json({ errors: "User not found" });
      }
      const pwdcompare = await bcrypt.compare(req.body.password , userdata.password)
      if (!pwdcompare) {
        return res.status(400).json({ errors: "User not found" });
      }

      const data = {
        user:{
          id: userdata.id
        }
      }
      const authToken = jwt.sign(data ,jwtsecret )
      return res.json({ success: true , authToken:authToken });
    } catch (error) {
      // console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
