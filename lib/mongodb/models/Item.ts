import mongoose, { Schema, Document } from "mongoose";

export type IItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  cost: number[];
  stock: number[];
  fullstock: number;
  photo: string;
};

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  cost: { type: [Number], required: true },
  stock: { type: [Number], required: true },
  photo: { type: String },
});

export default mongoose.models.Item ||
  mongoose.model<IItem>("Item", ItemSchema);
