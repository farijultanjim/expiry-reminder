// models/DomainHistory.js
import mongoose from "mongoose";

const DomainHistorySchema = new mongoose.Schema({
  domainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainList",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  changes: {
    type: Object,
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DomainHistory || mongoose.model('DomainHistory', DomainHistorySchema);