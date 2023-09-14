const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//const EmpInfoModal = require("../../models/Employ/login.modal");
const EmpInfoModal = require("../../models/Employ/Employ.model");

// function to validate Email
function validateEmail(Email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(Email);
}

class login {
  async Login(req, res) {
    try {
      const secretKey = crypto.randomBytes(64).toString("hex");
      const { email, password } = req.body;

      //Check email and password are provide or not
      if (!email || !password)
        res.status(400).send({ msg: "Please fill in all fields." });

      //Check Porvid Email format is valid or not
      if (!validateEmail(email))
        return res.status(400).send({ msg: "Invalid emails." });

      // CHECK EMAIL/USER IS EXISTS OR NOT
      const user = await EmpInfoModal.findOne({ email });

      //If user/Email is not exists
      if (!user) res.status(401).send({ msg: "This Email Not exists.", user });

      //If user/Email is exists then check password validation
      if (!password.length > 6)
        res.status(400).send({ msg: "Password length minimum 6..." });
      else {
        const token = jwt.sign({ email }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).send({
          token,
          userData: {
            id: user._id,
            email: user.email,
            name: user.First_Name,
            role: user.Position,
          },
        });
        // res.send({ msg: "Success", data: user });
        // res.send({ token, expireAt: Date.now() + 5 * 60 * 1000 });
        // res.send({ token, expireAt: Date.now() + 60 * 60 * 1000 });
      }
    } catch (error) {
      res.status(400).send({ msg: error });
    }
  }

  async ChangePassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;
      console.log(email, oldPassword, newPassword);
      // Check if the required fields are present
      if (!email || !oldPassword || !newPassword) {
        res.status(400).send({ msg: "Please fill in all fields." });
      }

      // Retrieve the user based on the email
      const user = await EmpInfoModal.findOne({ email });
      if (!user) {
        res.status(404).send({ msg: "User not found." });
      }
      console.log(user);
      // Check if the old password matches the stored password
      if (user.Password !== oldPassword) {
        res.status(401).send({ msg: "Invalid old password." });
      }

      // Update the password with the new password
      user.Password = newPassword;
      await user.save();

      res.status(200).send({ msg: "Password changed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal server error." });
    }
  }
}

module.exports = new login();
