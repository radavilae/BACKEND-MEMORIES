const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { authenticateToken } = require("../middleware/jwt.middleware");
const { AppError } = require("../error-handling/index");

//************** Find User */

router.get(
  "/protected/user",

  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
      }
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const {
        _id,
        email,
        userName,
        //profileImage
      } = user;

      res.status(200).json({
        _id,
        email,
        userName,
        //profileImage,
      });
    } catch (error) {
      next(error);
    }
  }
);

//****************** Update User *************/

router.put(
  "/protected/user-update",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.payload.userId;

      const updateData = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
      };

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        throw new AppError("User not found", 404);
      }

      if (!updatedUser) {
        throw new AppError("User not found", 404);
      }

      res.status(200).json({ message: "User updated", updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

//************** Delete */

router.delete("/protected/user", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.payload.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new AppError("Could not delete user", 404);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// //****create  */

// router.post("/create-a-post", (req, res) => {
//   PostModel.create(req.body)
//     .then((newPost) => {
//       res.status(201).json(newPost);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// //************** Update-User **************

// router.put("/update-a-user/:userID", async (req, res) => {
//   //   const userID = req.params.userID;
//   const { userID } = req.params;
//   try {
//     const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body, {
//       new: true,
//     });
//     if (!updatedUser) {
//       res.status(500).json({ errorMessage: "User not found" });
//     } else {
//       res
//         .status(200)
//         .json({ message: "User updated successfully", updatedUser });
//     }
//   } catch (error) {
//     res.status(500).json({ errorMessage: "User not found" });
//     console.log("User not found");
//   }
// });

// //****************  Delete-User  **************

// router.delete("/delete/:id", (req, res) => {
//   UserModel.findByIdAndDelete(req.params.id)
//     .then((deletedUser) => {
//       if (!deletedUser) {
//         res.status(500).json(err);
//       } else {
//         res.status(204).send();
//       }
//     })
//     .catch((error) => {
//       res.status(500).json(err);
//     });
// });

// module.exports = router;
