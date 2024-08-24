const { Types, Schema, model } = require("mongoose");

const ReferralSchema = new Schema({
  referral_id: {
    type: String,
    required: true,
    unique: true,
  },
  referred_by: {
    type: Types.ObjectId,
    ref: "User",
  },
  referred_to: {
    type: Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Referral = model("Referral", ReferralSchema);
module.exports = Referral;
