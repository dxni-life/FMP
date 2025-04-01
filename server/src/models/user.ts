import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  availableMoney?: number;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 0 },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);