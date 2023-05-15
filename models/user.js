const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  userName: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, required: true },
  admin: { type: Boolean, required: true }
})

UserSchema.virtual("fullname").get(function() {
  return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model("User", UserSchema)