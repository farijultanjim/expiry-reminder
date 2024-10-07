// models/DomainList.js

import mongoose from "mongoose";

const DomainListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true,
    },
    domainName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    domainPurchaseDate: { type: Date, required: true },
    domainExpiryDate: { type: Date, required: true },
    domainSellingPrice: { type: Number, required: true },
    domainBuyingPrice: { type: Number, required: true },
    domainSellingCurrency: { type: String, required: true },
    domainBuyingCurrency: { type: String, required: true },
    hostingUnit: { type: String, required: true },
    hostingPrice: { type: Number, required: true },
    hostingCurrency: { type: String, required: true },
    hostingPurchaseDate: { type: Date, required: true },
    hostingExpiryDate: { type: Date, required: true },
    hostingCompany: { type: String, required: true },

    isArchived: { type: Boolean, default: false },

    note: { type: String },

    // These fields to track reminder statuses
    reminderSent20Days: { type: Boolean, default: false }, // 20-day reminder sent
    reminderSent7Days: { type: Boolean, default: false },  // 7-day reminder sent
}, { timestamps: true });

export default mongoose.models.DomainList || mongoose.model('DomainList', DomainListSchema);
