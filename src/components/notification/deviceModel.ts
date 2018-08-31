import { default as mongoose } from 'mongoose';

const device = new mongoose.Schema({
    deviceId: String,
    platform: String,
    token: String,
    userId: String
}, { timestamps: true });
export default mongoose.model('Devices', device);
