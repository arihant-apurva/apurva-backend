const connectDB = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const register = async (req, res) => {
//     try {

//         //taking response into seperate variables
//         const { email, password } = req.body;

//         //connecting database
//         const dbo = await connectDB();

//         //checking if the user already exists or not
//         const userExist = await dbo.collection("users").findOne({ email });
//         if (userExist) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         //hashing the password to store in database
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Insert new user
//         await dbo.collection("users").insertOne({
//             email,
//             password: hashedPassword,
//         });

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }

// }

const login = async (req, res) => {
    try {

        //take input of user email and password
        const { email, password } = req.body;

        //connect to database
        const dbo = await connectDB();

        //check whether email exist or not
        const user = await dbo.collection("users").findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        //check if password is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //genrate token and send back that token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.status(200).json({ message: "Login successful"});
    } catch (error) {        
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;        

        if (!token) {
            return res.status(401).json({ message: "Unauthorized", loggedIn: false });
        }

        // Verify the token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        return res.status(200).json({ message: "User is authenticated", loggedIn: true });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Internal Server Error" ,loggedIn: false});
    }
}


module.exports = { login, logout ,checkAuth};