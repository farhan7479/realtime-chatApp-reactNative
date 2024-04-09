import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    socketId: String,
    username: String
});

const User = mongoose.model('User', userSchema);

export default User;
