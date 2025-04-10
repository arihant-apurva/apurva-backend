const {MongoClient} =require('mongodb');

const URI = process.env.MONGODB_URI;
let dbo;

const connectDb = async () => {
    if(dbo)return dbo;
    try {
        const client = await MongoClient.connect(URI);
        dbo = client.db("arihantjain");
        return dbo;

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb;