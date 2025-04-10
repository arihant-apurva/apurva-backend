const connectDB = require('../utils/db');
const path = require('path');
const { ObjectId } = require('mongodb');
const cloudinary = require('../utils/cloudinary');
const { list } = require('aws-amplify/storage');
const fs = require('fs');

//options for getting file from server through sendFile function
const getDestination = (file) => {
    console.log(file);

    let uploadFolder = '../uploads/files'; // Default folder

    if (file.mimetype.startsWith('image')) {
        uploadFolder = '../uploads/images';
    }

    const destinationPath = path.join(__dirname, uploadFolder);
    return destinationPath;
};

const options = {
    root: path.join(__dirname, "../uploads/images"),
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
}

const translateObject = async (sourceLanguage, targetLanguage, obj, ignoringParameter) => {
    const translatedObj = {};

    for (const key in obj) {
        if (ignoringParameter.includes(key) === false) {
            try {
                const url = `https://ftapi.pythonanywhere.com/translate?sl=${sourceLanguage}&dl=${targetLanguage}&text=${obj[key]}`;
                const response = await fetch(url);
                const data = await response.json();
                // console.log(data);

                translatedObj[key] = data["destination-text"] || obj[key];
            } catch (error) {
                console.error(`Error translating ${key}:`, error);
                translatedObj[key] = obj[key]; // Keep original value if translation fails
            }
        } else {
            translatedObj[key] = obj[key]; // Keep non-string values unchanged
        }
    }

    return translatedObj;
};

const translateArray = async (sourceLanguage, targetLanguage, array) => {
    const translatedArray = [];

    for (const key of array) {
        try {
            const url = `https://ftapi.pythonanywhere.com/translate?sl=${sourceLanguage}&dl=${targetLanguage}&text=${key}`;
            const response = await fetch(url);
            const data = await response.json();
            translatedArray.push(data["destination-text"]);
        } catch (error) {
            console.error(`Error translating ${key}:`, error);
            translatedArray.push(key); // Keep original value if translation fails
        }
    }
    return translatedArray;
}
// (async()=>{
//     console.log(path.join(__dirname, './uploads/newsImages'));

// })()

const getFiles = (req, res) => {
    const { fileName } = req.params;
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

const addNews = async (req, res) => {
    try {
        let listItem = req.body;

        
        
        listItem.sensorship = JSON.parse(listItem.sensorship);
        listItem.seo = JSON.parse(listItem.seo);
        
        const storageOption = listItem.storage;
        
        let cloudResponse;
        if(storageOption==="cloud"){
            cloudResponse = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path); 
        }
        
        delete listItem.storage;
        
        // console.log(cloudResponse);
        
        listItem.file = {
            filename: req.file.filename,
            type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: cloudResponse?.url || null
        }

        
        const listItem_hi = await translateObject("en", "hi", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_hi.seo = await translateObject("en", "hi", listItem.seo, ["keywords"])
        listItem_hi.seo.keywords = await translateArray("en", "hi", listItem.seo.keywords)

        const listItem_te = await translateObject("en", "te", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_te.seo = await translateObject("en", "te", listItem.seo, ["keywords"])
        listItem_te.seo.keywords = await translateArray("en", "te", listItem.seo.keywords)

        const listItem_ta = await translateObject("en", "ta", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_ta.seo = await translateObject("en", "ta", listItem.seo, ["keywords"])
        listItem_ta.seo.keywords = await translateArray("en", "ta", listItem.seo.keywords)

        const listItem_ml = await translateObject("en", "ml", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_ml.seo = await translateObject("en", "ml", listItem.seo, ["keywords"])
        listItem_ml.seo.keywords = await translateArray("en", "ml", listItem.seo.keywords)

        const listItem_kn = await translateObject("en", "kn", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_kn.seo = await translateObject("en", "kn", listItem.seo, ["keywords"])
        listItem_kn.seo.keywords = await translateArray("en", "kn", listItem.seo.keywords)

        const listItem_bn = await translateObject("en", "bn", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_bn.seo = await translateObject("en", "bn", listItem.seo, ["keywords"])
        listItem_bn.seo.keywords = await translateArray("en", "bn", listItem.seo.keywords)

        const listItem_or = await translateObject("en", "or", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_or.seo = await translateObject("en", "or", listItem.seo, ["keywords"])
        listItem_or.seo.keywords = await translateArray("en", "or", listItem.seo.keywords)

        const listItem_gu = await translateObject("en", "gu", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_gu.seo = await translateObject("en", "gu", listItem.seo, ["keywords"])
        listItem_gu.seo.keywords = await translateArray("en", "gu", listItem.seo.keywords)

        const listItem_mr = await translateObject("en", "mr", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        listItem_mr.seo = await translateObject("en", "mr", listItem.seo, ["keywords"])
        listItem_mr.seo.keywords = await translateArray("en", "mr", listItem.seo.keywords)


        const dbo = await connectDB()

        const result = await dbo.collection("news").insertOne(listItem)

        listItem_hi.news = result.insertedId;
        listItem_te.news = result.insertedId;
        listItem_ta.news = result.insertedId;
        listItem_ml.news = result.insertedId;
        listItem_kn.news = result.insertedId;
        listItem_bn.news = result.insertedId;
        listItem_or.news = result.insertedId;
        listItem_gu.news = result.insertedId;
        listItem_mr.news = result.insertedId;

        await dbo.collection("news_hi").insertOne(listItem_hi)
        await dbo.collection("news_te").insertOne(listItem_te)
        await dbo.collection("news_ta").insertOne(listItem_ta)
        await dbo.collection("news_ml").insertOne(listItem_ml)
        await dbo.collection("news_kn").insertOne(listItem_kn)
        await dbo.collection("news_bn").insertOne(listItem_bn)
        await dbo.collection("news_or").insertOne(listItem_or)
        await dbo.collection("news_gu").insertOne(listItem_gu)
        await dbo.collection("news_mr").insertOne(listItem_mr)

        return res.status(201).send({ message: 'News added successfully ✅', type: "success" });
    } catch (error) {
        return res.status(500).send({ message: 'Internal server error ❌', type: "error" });
    }
}


const viewListItem = async (req, res) => {
    const { id, collectionName } = req.params;
    try {
        const dbo = await connectDB()
        const Response = await dbo.collection(collectionName).findOne({ _id: new ObjectId(id) });
        return res.status(200).json(Response)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ❌" })
    }
}

const fetchAllNews = async (req, res) => {
    const collectionName = "news"
    const model = await connectDB();
    const data = await model.collection(collectionName).find().toArray()
    return res.send(data)
}

const updateAllNews = async (req, res) => {

    try {
        const { id } = req.params;
        let { type, subcategory, title, shortDescription, description, status, DisplayTime, seo } = req.body;
        

        console.log(req.file);
        
        // let cloudResponse;
       
        
        // if (file && !file.url) {
        //     cloudResponse = await cloudinary.uploader.upload(file.path)
        // }

        
        // file = {
        //     filename: req.file.filename,
        //     type: req.file.mimetype || file.type,
        //     size: req.file.size,
        //     path: req.file.path,
        //     // url: !file.url? cloudResponse.url : req.file.url
        // }

        seo = JSON.parse(seo);


        const listItem = req.body;
        const model = await connectDB();

        const listItem_hi = await translateObject("en", "hi", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_te = await translateObject("en", "te", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_ta = await translateObject("en", "ta", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_ml = await translateObject("en", "ml", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_kn = await translateObject("en", "kn", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_bn = await translateObject("en", "bn", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_or = await translateObject("en", "or", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_gu = await translateObject("en", "gu", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])
        const listItem_mr = await translateObject("en", "mr", listItem, ["sensorship", "file", "DisplayTime", "status", "seo"])


        const response_hi = await model.collection("news_hi").findOne({ news: new ObjectId(id) })
        const response_te = await model.collection("news_te").findOne({ news: new ObjectId(id) })
        const response_ta = await model.collection("news_ta").findOne({ news: new ObjectId(id) })
        const response_ml = await model.collection("news_ml").findOne({ news: new ObjectId(id) })
        const response_kn = await model.collection("news_kn").findOne({ news: new ObjectId(id) })
        const response_bn = await model.collection("news_bn").findOne({ news: new ObjectId(id) })
        const response_or = await model.collection("news_or").findOne({ news: new ObjectId(id) })
        const response_gu = await model.collection("news_gu").findOne({ news: new ObjectId(id) })
        const response_mr = await model.collection("news_mr").findOne({ news: new ObjectId(id) })

        //translating seo that is updated
        listItem_hi.seo = await translateObject("en", "hi", seo, ["keywords"])
        listItem_hi.seo.keywords = await translateArray("en", "hi", seo.keywords)

        listItem_or.seo = await translateObject("en", "or", seo, ["keywords"])
        listItem_or.seo.keywords = await translateArray("en", "or", seo.keywords)

        listItem_bn.seo = await translateObject("en", "bn", seo, ["keywords"])
        listItem_bn.seo.keywords = await translateArray("en", "bn", seo.keywords)

        listItem_kn.seo = await translateObject("en", "kn", seo, ["keywords"])
        listItem_kn.seo.keywords = await translateArray("en", "kn", seo.keywords)

        listItem_ml.seo = await translateObject("en", "ml", seo, ["keywords"])
        listItem_ml.seo.keywords = await translateArray("en", "ml", seo.keywords)

        listItem_ta.seo = await translateObject("en", "ta", seo, ["keywords"])
        listItem_ta.seo.keywords = await translateArray("en", "ta", seo.keywords)

        listItem_te.seo = await translateObject("en", "te", seo, ["keywords"])
        listItem_te.seo.keywords = await translateArray("en", "te", seo.keywords)

        listItem_gu.seo = await translateObject("en", "gu", seo, ["keywords"])
        listItem_gu.seo.keywords = await translateArray("en", "gu", seo.keywords)

        listItem_mr.seo = await translateObject("en", "mr", seo, ["keywords"])
        listItem_mr.seo.keywords = await translateArray("en", "mr", seo.keywords)

        await model.collection("news").updateOne({ _id: new ObjectId(id) }, {
            $set: {
                type, subcategory, title, shortDescription, description, status, DisplayTime, 
                // file,
                 seo
            }
        })

        await model.collection("news_hi").updateOne({ _id: response_hi._id }, {
            $set: {
                type: listItem_hi.type,
                subcategory: listItem_hi.subcategory,
                title: listItem_hi.title,
                shortDescription: listItem_hi.shortDescription,
                description: listItem_hi.description,
                seo: listItem_hi.seo,
                status, DisplayTime, 
                // file
            }
        })

        await model.collection("news_te").updateOne({ _id: response_te._id }, {
            $set: {
                type: listItem_te.type,
                subcategory: listItem_te.subcategory,
                title: listItem_te.title,
                shortDescription: listItem_te.shortDescription,
                description: listItem_te.description,
                seo: listItem_te.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_ta").updateOne({ _id: response_ta._id }, {
            $set: {
                type: listItem_ta.type,
                subcategory: listItem_ta.subcategory,
                title: listItem_ta.title,
                shortDescription: listItem_ta.shortDescription,
                description: listItem_ta.description,
                seo: listItem_ta.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_ml").updateOne({ _id: response_ml._id }, {
            $set: {
                type: listItem_ml.type,
                subcategory: listItem_ml.subcategory,
                title: listItem_ml.title,
                shortDescription: listItem_ml.shortDescription,
                description: listItem_ml.description,
                seo: listItem_ml.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_kn").updateOne({ _id: response_kn._id }, {
            $set: {
                type: listItem_kn.type,
                subcategory: listItem_kn.subcategory,
                title: listItem_kn.title,
                shortDescription: listItem_kn.shortDescription,
                description: listItem_kn.description,
                seo: listItem_kn.seo,
                status, DisplayTime, 
                // file
            }
        })

        await model.collection("news_bn").updateOne({ _id: response_bn._id }, {
            $set: {
                type: listItem_bn.type,
                subcategory: listItem_bn.subcategory,
                title: listItem_bn.title,
                shortDescription: listItem_bn.shortDescription,
                description: listItem_bn.description,
                seo: listItem_bn.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_or").updateOne({ _id: response_or._id }, {
            $set: {
                type: listItem_or.type,
                subcategory: listItem_or.subcategory,
                title: listItem_or.title,
                shortDescription: listItem_or.shortDescription,
                description: listItem_or.description,
                seo: listItem_or.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_gu").updateOne({ _id: response_gu._id }, {
            $set: {
                type: listItem_gu.type,
                subcategory: listItem_gu.subcategory,
                title: listItem_gu.title,
                shortDescription: listItem_gu.shortDescription,
                description: listItem_gu.description,
                seo: listItem_gu.seo,
                status, DisplayTime,
                //  file
            }
        })

        await model.collection("news_mr").updateOne({ _id: response_mr._id }, {
            $set: {
                type: listItem_mr.type,
                subcategory: listItem_mr.subcategory,
                title: listItem_mr.title,
                shortDescription: listItem_mr.shortDescription,
                description: listItem_mr.description,
                seo: listItem_mr.seo,
                status, DisplayTime,
                //  file
            }
        })

        res.status(200).json({ message: 'News updated successfully ✅' });

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Failed to Update ❌' });
    }

}

const updateOneNews = async (req, res) => {
    const { id, target_language } = req.params;
    let { title, shortDescription, description, status, DisplayTime, image } = req.body;

    image = {
        filename: req.file.filename || image.filename,
        type: req.file.mimetype || image.type,
        size: req.file.size || file.size,
        path: req.file.path || file.path,
    }


    try {

        const model = await connectDB();
        await model.collection(target_language).updateOne({ _id: new ObjectId(id) }, {
            $set: {
                title, shortDescription, description, status, DisplayTime, image
            }
        })
        res.status(200).json({ message: 'News updated successfully ✅' });

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Failed to Update ❌' });
    }

}

const updateSensorship = async (req, res) => {
    const { id } = req.params; // Extract the ID from the route parameter
    try {
        const dbo = await connectDB(); // Connect to the database

        // Update the main content and subtypes
        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_hi").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_bn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_gu").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_kn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_mr").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_or").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_ta").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_te").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );
        await dbo.collection("news_ml").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "pending", feedback: null }
                },
            }
        );

        res.status(200).json({ message: 'Sent for approval ✅' });
    } catch (error) {
        // console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to send for approval ❌' });
    }
};

const suggestUpdate = async (req, res) => {
    const { id } = req.params;
    const { suggestion } = req.body; // Getting suggestion from the request body

    try {
        const dbo = await connectDB(); // Connect to the database
        // Find the news item by ID

        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: suggestion }
                },
            }
        );
        await dbo.collection("news_hi").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_bn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_gu").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_kn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_mr").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_or").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_ta").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_te").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );
        await dbo.collection("news_ml").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "review", feedback: null }
                },
            }
        );

        res.status(200).json({ message: 'Suggestion updated successfully ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update suggestion ❌' });
    }
};
const approvedUpdate = async (req, res) => {
    const { id } = req.params;
    const { suggestion } = req.body; // Getting suggestion from the request body

    try {
        const dbo = await connectDB(); // Connect to the database
        // Find the news item by ID

        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_hi").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_bn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_gu").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_kn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_mr").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_or").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_ta").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_te").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );
        await dbo.collection("news_ml").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "approved", feedback: null }
                },
            }
        );


        res.status(200).json({ message: 'Suggestion updated successfully ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update suggestion ❌' });
    }
};
const rejectedUpdate = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body; // Getting suggestion from the request body

    try {
        const dbo = await connectDB(); // Connect to the database
        // Find the news item by ID

        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: reason }

                },
            }
        );
        await dbo.collection("news_hi").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_bn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_gu").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_kn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_mr").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_or").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_ta").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_te").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );
        await dbo.collection("news_ml").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    sensorship: { stage: "rejected", feedback: null }
                },
            }
        );

        res.status(200).json({ message: 'Suggestion updated successfully ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update suggestion ❌' });
    }
};


const deleteEnglishNews = async (req, res) => {
    const { id } = req.params;
    try {
        const dbo = await connectDB()
        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_bn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_gu").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_hi").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_kn").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_ml").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_mr").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_or").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_ta").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        await dbo.collection("news_te").updateOne(
            { news: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );

        return res.status(200).json({ message: "Status changed successfully ✅" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to change Status ❌" })
    }

}

const deleteTargetLanguageNews = async (req, res) => {
    const { id, target_language } = req.params;
    try {
        const dbo = await connectDB()
        await dbo.collection(target_language).updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );
        return res.status(200).json({ message: "Status changed successfully ✅" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to change Status ❌" })
    }

}

const ActiveToInactiveReadyQueue = async (req, res) => {
    const { id } = req.params;

    try {
        const dbo = await connectDB(); // Connect to the database
        // Find the news item by ID

        await dbo.collection("news").updateOne(
            { _id: new ObjectId(id) }, // Match the document by ID
            {
                $set: {
                    status: false,
                },
            }
        );

        res.status(200).json({ message: 'Succesfully changed status to inactive ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update status to inactive ❌' });
    }
}
module.exports = { fetchAllNews, viewListItem, deleteTargetLanguageNews, getFiles, updateAllNews, updateOneNews, deleteEnglishNews, addNews, updateSensorship, suggestUpdate, approvedUpdate, rejectedUpdate, ActiveToInactiveReadyQueue }
