const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//Variable above....

//First, we need to sigup a user

router.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;

  //check the length of the password and that ther is all the fields and password strength

  if (email === "" || password === "" || userName === "") {
    res
      .status(400)
      .json({ errorMessage: "Provide email, password and name please" }); //before was message only
    return;
  }

  //use regex to validate the email format

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({
  //     message:
  //       "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }

  try {
    const foundUser = await UserModel.findOne({ email }); // added await
    if (foundUser) {
      res.status(403).json({ message: "Email already taken" });
    } else {
      ///added else

      //before creating a user, make sure to hash his or her password

      const mySalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, mySalt);
      // console.log(hash1);
      // console.log(hash2);
      // console.log(password, hashedPassword);
      const hashedUser = {
        ...req.body,
        password: hashedPassword,
      };

      const myNewUser = await UserModel.create(hashedUser);
      console.log("user created", myNewUser);
      const { _id, userName, email } = myNewUser; // I added that!
      res.status(201).json({ _id, userName, email });
    }
  } catch (err) {
    console.log("error signing up", err);
    res.status(500).json(err);
  }
});

// Second, we need a user tashat signed up before to able to login

router.post("/login", async (req, res) => {
  console.log("here are the headers", req.headers);
  const { email, password } = req.body;
  try {
    //first try to find a user based on the email

    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      res.status(400).json({
        errorMessage: "No user with that email", //error message before message
      });
    } else {
      //if there is a user with that email, then we need to compare the passwords
      const doesPasswordMatch = bcryptjs.compareSync(
        password,
        foundUser.password
      );
      if (!doesPasswordMatch) {
        res.status(400).json({
          errorMessage: "Incorrect password", // ERRORMESSSAGE before message
        });

        //This else is for when the user exists and the password matches
      } else {
        /*************** creating JWT token ***********************/

        const { _id, userName } = foundUser;

        const payload = { _id, userName };

        //this is where we create a token
        //.sing method takes three arguments, data you want to save, secret string,objetcs of options

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        //This is when everythin worked and now the user is logged in!

        res.status(200).json({
          message: "Congrats, you logged in",
          authToken,
        });
      }
    }
  } catch (err) {
    console.log("error logging in", err);
    res.status(500).json(err);
  }
});

//lastly logout route
router.get("/verify", isAuthenticated, (req, res) => {
  console.log("verify route", req.payload);

  //the token is all good

  res.status(200).json(req.payload);
});

//Always remember to export your
module.exports = router;
