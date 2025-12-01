import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        //Ket noi CSDL MongoDB
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Ket noi CSDL thanh cong!');
    } catch (error) {
        //Loi khi ket noi CSDL
        console.log('Loi khi ket noi CSDL:', error);
        process.exit(1); //Thoat ung dung
    }
};