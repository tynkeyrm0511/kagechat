import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Ket noi CSDL thanh cong!');
    } catch (error) {
        console.log('Loi khi ket noi CSDL:', error);
        process.exit(1);
    }
};