const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: ["sales", "support", "warehouse"],
        message: "{VALUE} is not a valid department",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before storing it
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

const StaffModel = mongoose.model("staff", staffSchema);

module.exports = StaffModel;
