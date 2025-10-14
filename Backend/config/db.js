import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Check if MongoDB URI is provided
        if (!process.env.MONGO_URI) {
            console.warn('⚠️  MONGO_URI not found in environment variables');
            console.warn('⚠️  Please create a .env file with your MongoDB configuration');
            console.warn('⚠️  Using default MongoDB URI: mongodb://localhost:27017/shopsmart');
        }

        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopsmart';
        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('💡 Make sure MongoDB is running on your system');
        console.error('💡 Or install MongoDB: https://www.mongodb.com/try/download/community');
        process.exit(1);
    }
};

export default connectDB;