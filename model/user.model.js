import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: value => validator.isNumeric(value, { no_symbols: true }),
        message: "Only numbers are allowed without area code",
      },
    },
    my_cars: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
export const User = mongoose.model("User", userSchema);
