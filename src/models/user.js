import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
        type: String,
        requird: true,
        unique: true,
    },
    password: {
        type: String,
        requird: true,
    },  
    isMfaActivate: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
    },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;