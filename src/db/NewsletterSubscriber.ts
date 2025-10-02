import { Schema, model, models } from "mongoose";

// newsletter subscriber schema definition
const NewsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.NewsletterSubscriber || model("NewsletterSubscriber", NewsletterSubscriberSchema); 