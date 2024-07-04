import mongoose, { Schema, Document } from "mongoose";

export type IService = {
  name: string;
  description: string;
  price: number;
};

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);
