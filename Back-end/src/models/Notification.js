import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: String,

  message: String,

  type: {
    type: String,
    enum: ["leave", "attendance", "payroll", "announcement","holiday","reminder"],
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  link: String
},
{ timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);