import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
    },
    address: {
      type: String,
    },
    level: {
      type: String,
      enum: ["fresh", "junior", "midLevel", "senior"],
      required: true,
    },
  },
  { timestamps: true }
);
// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
// compare password and hashedPassword
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

const User = mongoose.model("User", userSchema);
export default User;
