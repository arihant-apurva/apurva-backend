// const ContentType = require("../models/content-type-model")
const { response } = require('express');
const connectDB = require('../utils/db');
const { ObjectId } = require('mongodb');




const updateList = async(req, res) => {
    const { id } = req.params; // Get the ID from the route
    const { title, status ,description } = req.body; // Get updated data from the request body

    try {
        const dbo =await connectDB()
        
        const updatedContentType = await dbo.collection("content-type").updateOne(
            { _id: new ObjectId(id) }, 
            { $set: { title,status,description} }
        );

        if (!updatedContentType) {
            return res.status(404).json({ message: 'Content type not found' });
        }

        res.json({ message: 'Successfully Updated ✅', data: updatedContentType });
    } catch (error) {
        // console.error('Error updating content type:', error);
        res.status(500).json({ message: 'Internal server error ❌' });
    }
}

// const viewListItem = async(req,res)=>{
//     const { id } = req.params;
//     try {
//         const dbo =await connectDB()
//         const Response = await dbo.collection("content-type").findOne({ _id: new ObjectId(id) });
//         return res.status(200).json(Response)
//     } catch (error) {
//         return res.status(500).json({ message: "Internal server error ❌" })
//     }

// }

// const deleteItem = async(req,res)=>{
//     const { id } = req.params;
//     try {
//         const dbo =await connectDB()
//         const Response = await dbo.collection("content-type").findOne({ _id: new ObjectId(id) });
//         if(!Response.status){
//             return res.status(200).json({ message: "Status is already Inactive ⚠️",type:"info"})
//         }
//         // const data = await Response.json()
//         // console.log(Response.status);
        
//         const updatedContentType = await dbo.collection("content-type").updateOne(
//             { _id: new ObjectId(id) }, 
//             { $set: { status :false } }
//         );
//         return res.status(200).json({ message: "Status changed to Inactive ✅",type:"success"})
//     } catch (error) {
//         return res.status(500).json({ message: "Status failed to change ❌" })
//     }

// }
//fetching for listing it out on category form 
const fetchAllContentType = async(req,res)=>{
    const collectionName = "sensorship-news" 
    const model = await connectDB();
    const data = await model.collection(collectionName).find().toArray()
    // console.log(data); 
    return res.send(data)
}

// module.exports = { requestController };
