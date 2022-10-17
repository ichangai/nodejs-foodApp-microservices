import mongoose, { Schema, Document, Model } from "mongoose";

interface CustomerDoc extends Document {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    password: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    salt: string;
}


const CustomerSchema = new Schema({
    firstName: { type: String},
    lastName: { type: String},
    address: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    phone: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
        }
    },
    timestamps: true
});


const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export { Customer }