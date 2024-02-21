import { Schema } from 'mongoose';

export const company = new Schema({
  name: { type: String, required: true },
  domain: { type: String },
  hs: {
    id: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  archived: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});
