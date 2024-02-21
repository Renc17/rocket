import { Schema } from 'mongoose';

export const company = new Schema({
  name: { type: String, required: true },
  domain: { type: String },
  hs: {
    id: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  archived: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export type Company = {
  name: string;
  domain?: string;
  hs: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  archived: boolean;
  updatedAt: Date;
  createdAt: Date;
};
