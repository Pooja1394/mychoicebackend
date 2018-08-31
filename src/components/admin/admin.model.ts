import { default as mongoose } from 'mongoose';
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    bidSellingPrice: {
        type: String
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
        default: 'Admin',
    },
    picture: {
        type: String,
    },
    EmployeeId: {
        type: String
    },
    EmployeeName: {
        type: String
    },
    Designation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation'
    },
    Department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    Privileges: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'privilege'
    },
    status: {
        type: Boolean,
        // required: true,
        default: false
    },
    Address: {
        type: String
    },
    TownShip: {
        type: String
    },
    DivisionORstate: {
        type: String
    },
    phoneNo1: {
        type: String
    },
    phoneNo2: {
        type: String
    },
    img: {
        type: String
    },
    lastlogin: {
        type: String
    }
},
    { timestamps: true });

export default mongoose.model('Admin', adminSchema);
