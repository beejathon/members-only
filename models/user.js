const mongoose = require("monggose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  userName: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, required: true },
  admin: { type: Boolean, required: true }
})

UserSchema.virtual("full name").get(function() {
  return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model("User", UserSchema)