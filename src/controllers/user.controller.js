const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await user.generateAuthToken();

        const currentUser = await User.findById(user._id).select("-password");

        return res
        .status(200)
        .cookie("accessToken", token, { secure: true})
        .json({ currentUser,token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, zipCode, phoneNumber, dob, is_admin=false } = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ firstName, lastName, email, password, gender,zipCode, phoneNumber, dob,is_admin});
        const user = await newUser.save();

        const token = await user.generateAuthToken();

        return res
        .status(200)
        .cookie("accessToken", token, { secure: true})
        .json({ user,token });
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const editUserStoreLocation = async (req, res) => {
    try {
        const {id} = req.params;
        const { locationId } = req.body;

        const existedUser = await User.findOne({_id:id})
        existedUser.selectedStoreLocation = locationId
        await existedUser.save();


        return res
        .status(200)
        .json('successfully Changed');
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, zipCode, phoneNumber, dob, is_admin=true} = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ firstName, lastName, email, password, gender,zipCode, phoneNumber, dob,is_admin});
        const user = await newUser.save();

        return res
        .status(200)
        .json({ user });
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    return res
    .clearCookie('accessToken')
    .json({ message: 'Logout successful' });
}

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({data: req.user})
}

const testUser = async(req,res) => {
    return res.
    status(200)
    .json({ message: 'user route successfull' });
}

module.exports = {
    loginUser,
    registerUser,
    registerAdmin,
    logoutUser,
    getCurrentUser,
    testUser,
    editUserStoreLocation
}