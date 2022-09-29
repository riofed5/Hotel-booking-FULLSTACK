const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require("../../helpers/sendmail");
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const existedUser = await User.findOne({
        email: args.userInput.email,
      });
      if (existedUser) {
        throw new Error("User exist already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const confirmationCode = jwt.sign(
        {
          email: args.userInput.email,
        },
        "confirmationcodesecret"
      );

      const fixedConfirmationCode = confirmationCode.split(".").join("");

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        confirmationCode: fixedConfirmationCode,
      });

      const result = await user.save();
      
      sendConfirmationEmail(result.email, result.email, fixedConfirmationCode);
      
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  verifyUser: async ({ confirmationCode }) => {
    const existedUser = await User.findOne({
      confirmationCode: confirmationCode,
    });
    if (!existedUser) {
      throw new Error("User doesn't exist");
    }
    existedUser.status = "Active";
    existedUser.confirmationCode = "";
    const result = await existedUser.save();
    console.log("DONE", result);
    return { ...result._doc, password: null, _id: result.id };
  },
  login: async ({ email, password }) => {
    const userLogin = await User.findOne({ email: email });
    if (!userLogin) {
      throw new Error("User does not exist!");
    }

    const isEqual = await bcrypt.compare(password, userLogin.password);
    if (!isEqual) {
      throw new Error("Password is not correct!");
    }

    if (userLogin.status != "Active") {
      throw new Error("Account is pending!");
    }

    const token = jwt.sign(
      {
        userId: userLogin.id,
        email: userLogin.email,
      },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );

    return {
      status: userLogin.status,
      userId: userLogin.id,
      token: token,
      tokenExpiration: 1,
    };
  },
};
