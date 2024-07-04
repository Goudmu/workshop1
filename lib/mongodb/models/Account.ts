import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  accountID: string;
  name: string;
  balance: "debit" | "credit";
  amount: number;
}

const AccountSchema: Schema = new Schema({
  accountID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  balance: { type: String, required: true, enum: ["debit", "credit"] },
  amount: { type: Number, required: true },
});

export default mongoose.models.Account ||
  mongoose.model<IAccount>("Account", AccountSchema);
