import mongoose from "mongoose";

const optimalOrderSchema = new mongoose.Schema({
  bakery: { type: Number, required: true },
  beverages: { type: Number, required: true },
  condiments: { type: Number, required: true },
  dairy: { type: Number, required: true },
  frozen: { type: Number, required: true },
  meat: { type: Number, required: true },
  produce: { type: Number, required: true },
  snacks: { type: Number, required: true },
  staples: { type: Number, required: true },
}, { _id: false }); // Set _id to false for subdocument schema

const predictionsSchema = new mongoose.Schema({
  business: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  optimalOrder: { type: optimalOrderSchema, required: true }, // Use the nested schema here
  onboarded: { type: Boolean, default: false },
});

const Prediction = mongoose.models.Prediction || mongoose.model("Prediction", predictionsSchema);

export default Prediction;
