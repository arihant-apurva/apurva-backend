const multer = require('multer');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectDb = require('../utils/db');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/videos'));  // Path to 'uploads/videos'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const uploadVideoMiddleware = upload.single('video');

const uploadVideo = async (req, res) => {
  try {
    const { title, description, displayAt, status } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!title || !description || !displayAt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const statusBoolean = (status === 'true' || status === true);

    const dbo = await connectDb();
    const displayAtDate = new Date(displayAt);

    const videoData = {
      title,
      description,
      displayAt: displayAtDate,
      status: statusBoolean,
      fileName: file.filename,  // Filename from multer
      filePath: `uploads/videos/${file.filename}`,  // Relative path
      createdDate: new Date(),
    };

    const result = await dbo.collection('videos').insertOne(videoData);
    res.status(200).json({
      message: 'Video uploaded successfully',
      videoData: { _id: result.insertedId, ...videoData },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadVideoLink = async (req, res) => {
  try {
    const { videoLink, title, description, displayAt, status } = req.body;

    if (!videoLink || !videoLink.startsWith('http')) {
      return res.status(400).json({ message: 'Invalid video link' });
    }

    if (!title || !description || !displayAt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const dbo = await connectDb();

    const statusBoolean = (status === 'true' || status === true);

    const videoData = {
      title,
      videoLink,
      description,
      displayAt: new Date(displayAt),
      status: statusBoolean,
      createdDate: new Date(),
    };

    const result = await dbo.collection('videos').insertOne(videoData);

    res.status(200).json({
      message: 'Video link submitted successfully',
      videoData: { _id: result.insertedId, ...videoData },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const fetchAllContentType = async (req, res) => {
  const dbo = await connectDb();
  const data = await dbo.collection('videos').find().toArray();
  res.send(data);
};

const viewListItem = async (req, res) => {
  const { id } = req.params;
  try {
    const dbo = await connectDb();
    const video = await dbo.collection('videos').findOne({ _id: new ObjectId(id) });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error ❌' });
  }
};

// const updateList = async (req, res) => {
//   const { id } = req.params;
//   const { title, status, description, videoLink, displayAt } = req.body;

//   try {
//     const dbo = await connectDb();

//     const updatedVideo = await dbo.collection('videos').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { title, status, description, videoLink, displayAt } }
//     );

//     if (!updatedVideo.matchedCount) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     res.json({ message: 'Successfully Updated ✅', data: updatedVideo });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error ❌' });
//   }
// };
const updateList = async (req, res) => {
  
  const { id } = req.params;
  console.log("req.body is---",req.body);

  const { title, status, description, videoLink, displayAt , fileName , filePath} = req.body;
    // Check if a file was uploaded
    const file= req.file;

  try {
    const dbo = await connectDb();

    // Prepare the data to update
    const updateData = {
      title,
      description,
      displayAt: new Date(displayAt),
      status: (status === 'true' || status === true),  // Convert status to boolean
    };

    if (file) {
      updateData.fileName = file.filename;
      updateData.filePath = `uploads/videos/${file.filename}`;
    } 
    
    // if (!file) {
    //   updateData.fileName = fileName;
    //   updateData.filePath = filePath;
    // } 
   
    else if (videoLink && videoLink.startsWith('http')) {
      updateData.videoLink = videoLink;
    }
    //  else {
    //   return res.status(400).json({ message: 'Invalid video link' });
    // }

    // Perform the update in the database
    const updatedVideo = await dbo.collection('videos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // If no video was found, return a 404 error
    if (!updatedVideo.matchedCount) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Respond with the updated video data
    res.json({ message: 'Successfully Updated ✅', data: updatedVideo });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error ❌', error: error.message });
  }
};


const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const dbo = await connectDb();
    const response = await dbo.collection('videos').findOne({ _id: new ObjectId(id) });

    if (!response || !response.status) {
      return res.status(404).json({ message: 'Video not found or already inactive' });
    }

    const updatedVideo = await dbo.collection('videos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: false } }
    );

    res.status(200).json({ message: 'Status changed to Inactive ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing status ❌' });
  }
};

module.exports = {
  uploadVideoMiddleware,
  uploadVideo,
  uploadVideoLink,
  fetchAllContentType,
  deleteItem,
  updateList,
  viewListItem
};
