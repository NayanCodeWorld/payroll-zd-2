const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmpInfoModal = require('../../models/Employ/Employ.model')// const login = (req, res) => {
//   const secretKey = crypto.randomBytes(64).toString('hex');
//   const { email, password } = req.body;

//   if (email !== "admin@gmail.com" || password !== "admin@123") {
//     return res.status(401).send({ message: "Invalid credentials" });
//   } else {
//     console.log("good to go");
//     const token = jwt.sign({ email }, secretKey, { expiresIn: '7d' });
//     res.send({ token });
//   }

// };
class login {
  async Login(req, res) {
    try {
      console.log('login');
      // const { Email, Password } = req.body;
      const secretKey = crypto.randomBytes(64).toString('hex');
      const { email, password } = req.body;


      if (!email || !password)
        return res.send({ msg: "Please fill in all fields." });
      console.log('fill');
      if (!validateEmail(email))
        return res.send({ msg: "Invalid emails." });

      // CHECK EMAIL IS ALREADY EXISTS ARE NOT
      console.log('user');
      const user = await EmpInfoModal.findOne({ email });
      if (!user)
        return res.json({ msg: "This Email Not exists." });

      if (!password.length > 6)
        return res.send({ msg: "Password length minimum 6..." })

      if (user.Password != password || user.email != email) {
        return res.status(401).send({ message: "Invalid credentials" });
      }
      else {
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        //     res.send({ token });
        // res.send({ msg: "Success", data: user })
        // res.send({ token, expireAt: Date.now() + (5 * 60 * 1000) });
   
   
        res.send({ token, expireAt: Date.now() + (60 * 60 * 1000) });
      }
    } catch (error) {
      res.send({ msg: error })
      console.log(error);
    }

  }
  async changePassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // Check if the required fields are present
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).send({ msg: "Please fill in all fields." });
      }

      // Retrieve the user based on the email
      const user = await EmpInfoModal.findOne({ email });
      if (!user) {
        return res.status(404).send({ msg: "User not found." });
      }

      // Check if the old password matches the stored password
      if (user.Password !== oldPassword) {
        return res.status(401).send({ msg: "Invalid old password." });
      }

      // Update the password with the new password
      user.Password = newPassword;
      await user.save();

      res.send({ msg: "Password changed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal server error." });
    }
  }

}
function validateEmail(Email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(Email);
}
module.exports = new login()
