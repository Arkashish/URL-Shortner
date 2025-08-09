const express = require('express');
const { connectDB } = require('./connect')
const URL = require('./models/url')
const path = require('path')
const cookieParser = require('cookie-parser');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth')

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express();
const PORT = 3001;

connectDB('mongodb://localhost:27017/urlShortner').then(() => {
    console.log('MongoDb Connected')
});



app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls
    })
})
app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/",checkAuth, staticRoute);



app.get('/url/:shortID', async (req, res) => {
    const shortId = req.params.shortID; // Also corrected: match param name 'shortID'
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // optional: returns the updated document
        );

        if (!entry) {
            return res.status(404).send('Short URL not found');
        }

        res.redirect(entry.redirectUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(PORT, () => {
    console.log(`Server running on PORT :  ${PORT}`)
})