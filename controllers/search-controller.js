const { ObjectId } = require('mongodb');
const connectDB = require('../utils/db');

// Fetching for listing it out on category form
const searchFunctionality = async (req, res) => {
    try {
        const { collectionName } = req.params; // Extract the collection name from route params
        const {
            page,
            limit,
            sort,  // Sort as JSON object
            filters // Filters as JSON object
        } = req.query;

        const parsedFilters = filters ? JSON.parse(filters) : {};
        const parsedSort = sort ? JSON.parse(sort) : {};

        // Connect to the database
        const model = await connectDB();
        const results = {};


        //intialised matchStage for pipeline used in aggregation
        const matchStage = {
            $match: {}
        };

        // Apply filters (field-based search)
        for (const [field, value] of Object.entries(parsedFilters)) {
            if (field === '_id' && ObjectId.isValid(value)) {
                matchStage.$match[field] = new ObjectId(value);
            } 
            else if (typeof value === 'boolean') {
                // Handle boolean values
                matchStage.$match[field] = value;
            } 
            else {
                matchStage.$match[field] = { $regex: value, $options: 'i' };
            }
        }

        // Building $sort stage dynamically
        const sortStage = Object.keys(parsedSort).length ? { $sort: parsedSort } : { $sort: { _id: 1 } };


        // Pagination logic
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        //Agregation pipeline for results
        const pipeline = [
            matchStage,
            sortStage,
            { $skip: skip },
            { $limit: pageSize }
        ];

        // Separate count pipeline (to get total filtered records)
        const countPipeline = [
            matchStage,
            { $count: "totalCount" }
        ];

        results.results = await model.collection(collectionName).aggregate(pipeline).toArray();
        const countResult = await model.collection(collectionName).aggregate(countPipeline).toArray();
        results.totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

        // Send the results as a response
        res.status(200).send(results);
    } catch (error) {
        console.error("Error in searchFunctionality:", error);
        res.status(500).send({ error: "An error occurred while fetching data." });
    }
};

module.exports = { searchFunctionality };
