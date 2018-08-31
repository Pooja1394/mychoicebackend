import { default as mongoose } from "mongoose";
// import { Timestamp } from "bson";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        //  required: true
    },
    lastName: {
        type: String,
        //  required: true
    },
    lang: {
        type: String,
        default: "en"
    },
    picture: {
        type: String,
    },

    lastLogin: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
        //   required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        // required: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        // required : true,
    },
    level: {
        type: String,
        default: "Beginner"
    },

    loginType: {

        type: String,
        default: "Manual"
    },

    suspend:
        {
            type: Boolean,
            default: false
        },
    status: {
        type: Boolean
        , default: false
    },
    createdBy: {
        type: String,
        default: "Self"
    },
    bio: {
        type: String,
        maxlength: 100,
        default: ""

    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    ipAddress: {
        type: String,
    },
    success: {
        type: Boolean
    },
    // address:
    // {
    //         localadd: String,
    //         state: String,
    //         city: String,
    //         townShip: String
    //       },

    localadd: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    township: {
        type: String,
    },
    newPassword: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    is_Facebook: {
        type: Boolean
    },
    is_reset: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
export default mongoose.model('User', userSchema);

