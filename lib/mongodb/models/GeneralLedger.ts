import mongoose, { Schema, Document } from "mongoose";

export interface IEntry {
  accountName: string;
  accountID: string;
  account_id: string;
  amount: number;
}

export interface IGeneralLedger extends Document {
  _id: string | undefined;
  date: Date;
  description: string;
  debits: IEntry[];
  credits: IEntry[];
}

const GeneralEntrySchema: Schema = new Schema({
  accountName: { type: String, required: true },
  accountID: { type: String, required: true },
  account_id: { type: String, required: true },
  amount: { type: Number, required: true },
});

const GeneralLedgerSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true },
    debits: { type: [GeneralEntrySchema], required: true },
    credits: { type: [GeneralEntrySchema], required: true },
    type: { type: String, required: true },
  },
  { strict: false }
);

export default mongoose.models.GeneralLedger ||
  mongoose.model<IGeneralLedger>("GeneralLedger", GeneralLedgerSchema);
