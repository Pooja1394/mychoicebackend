import { default as mongoose } from "mongoose";
const orderSchema = new mongoose.Schema(
    {
        productId: {
            type: String
        },
        productName: {
            type: String
        },
        image: {},
        quantity: {
            type: String,
            default: 1
        },
        status: {
            type: String,
            default: ""
        },
        orderType: {
            type: String
        },
        retailPrice: {
            type: String
        },
        shippingCharge: {
            type: String,
        },
        promotion: {
            type: String
        },
        coupon: {
            type: String
        },
        user: {
            userName: {
                type: String
            },
            picture: {
                type: String
            },
            ip: {
                type: String
            }
        },
        totalPrice: {
            type: String
        },

        products: {},
    }, { timestamps: true });

export default mongoose.model("orderschema", orderSchema);
