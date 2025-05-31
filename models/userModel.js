import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedToken: {
    type: Number,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  passwordResetToken: {
    type: String,
  },
  passwordExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    default: "others",
    required: true,
  },
  address:{
    line: {
      type: String,
      required: true,
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
    country: { type: String, required: true },
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  //   cart option
  cart: [
    {
      book: { type: mongoose.Schema.ObjectId, ref: "Cart" },
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now },
    },
  ],

  //   purchase history
  totalOrderes: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// hasing the passwords
userSchema.pre("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// comparing the passwords
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
