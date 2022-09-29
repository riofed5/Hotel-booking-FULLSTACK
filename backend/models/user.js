const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  bookingEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    default: "",
  },
  roles: {
    type: String,
    enum: ["Normal", "Admin"],
    default: "Normal",
  },
});

module.exports = mongoose.model("User", userSchema);
