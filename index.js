require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const contentType = require('./routers/content-type-router');
const categoryType = require('./routers/category-type-router');
// const fileUploadRouter = require('./routers/file-upload-router');
const newsRouter = require('./routers/news-router');
const regionalNewsRouter = require('./routers/regional-news-router');
const searchRouter = require('./routers/search-router');
const sensorshipRouter = require('./routers/sensorship-router');
const indexingRouter = require('./routers/indexing-router');
const countryStateRouter = require('./routers/countrystate-router');
const AuthRouter = require('./routers/auth-router');

const path = require('path');
// const vidRouter = require('./routers/Videorouter');
const vidRouter = require('./routers/Videouploadrouter');
const cors = require('cors');
// const connectDb = require('./utils/db');
const corsOption = {
    origin: "http://localhost:3000",
    method: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}
app.use(cors(corsOption));
app.use(express.json())
app.use(cookieParser())
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads', 'videos')));
app.use('/api/content-type', contentType)
// app.use('/api/file', fileUploadRouter);
app.use('/api/category-type', categoryType)
app.use('/api/news', newsRouter)
app.use('/api/regional-news', regionalNewsRouter)
app.use('/api/search', searchRouter)
app.use('/api/sensorship-news', sensorshipRouter)
app.use('/api/news-indexing', indexingRouter)
app.use('/api/country-state-city', countryStateRouter)
app.use('/api/auth', AuthRouter);



app.use('/api/search', searchRouter);
// app.use('/api/upload', videoRouter);
app.use('/api/videos', vidRouter);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads', 'videos')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server is running at port:', PORT);
})

