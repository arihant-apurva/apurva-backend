const connectDB = require('../utils/db');
const { ObjectId } = require('mongodb');

const addCategory = async (req, res) => {
    try {
        const listItem = req.body;
        const dbo =await connectDB()
        // console.log(dbo);
        await dbo.collection("category-type").insertOne(listItem)
        return res.status(200).json({ message: "Successfully added ✅" ,type:"success",timeout:3000})
    } catch (error) {
        return res.status(500).json({ message: "Failed to add ❌" ,type:"error",timeout:3000})
    }
}

const viewListItem = async(req,res)=>{
    const { id } = req.params;
    try {
        const dbo =await connectDB()
        const Response = await dbo.collection("category-type").findOne({ _id: new ObjectId(id) });
        return res.status(200).json(Response)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ❌" })
    }

}

const updateCategory = async (req, res) => {
    const { id } = req.params; // Extract the ID from the route parameter
    const { ContentType, title, description, subtype } = req.body; // Extract data from the request body

    try {
        const dbo = await connectDB(); // Connect to the database

        // Update the main content and subtypes
        const updatedCategory = await dbo.collection("category-type").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    ContentType,
                    title,
                    description,
                    subtype, // Subtypes as an array
                },
            }
        );
        res.status(200).json({ message: 'Category updated successfully ✅', data: updatedCategory });
    } catch (error) {
        // console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to Update ❌' });
    }
};


const deleteItem = async(req,res)=>{
    const { id } = req.params;

    try {
        const dbo =await connectDB()
        const Response = await dbo.collection("category-type").deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({ message: "Status changed successfully ✅" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to change Status ❌" })
    }

}

//fetching for listing it out on news form 
const fetchAllCategoryData = async(req,res)=>{
    const collectionName = "category-type" 
    const model = await connectDB();
    const data = await model.collection(collectionName).find().toArray()
    // console.log(data); 
    return res.send(data)
}

const fetchSubtype = async(req,res)=>{
    const category = req.query.category
    // console.log();
    
    const collectionName = "category-type" 
    const model = await connectDB();
    const data = await model.collection(collectionName).find({title:category}).toArray()
    return res.send(data)
}
module.exports={addCategory,viewListItem,deleteItem,updateCategory,fetchAllCategoryData,fetchSubtype}
