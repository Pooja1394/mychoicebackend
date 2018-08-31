import { default as mongoose } from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    EmployeeId: {
        type: String
    },
    qrcode: {
        type: String
    },
    img1: {
        type: String
    },
    qrId: {
        type: String
    },
    EmployeeName: {
        type: String
    },
    employeetype: {
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
    email: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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
}, { timestamps: true });

export default mongoose.model('employee', EmployeeSchema);