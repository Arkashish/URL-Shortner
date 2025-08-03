const express = require('express');
const { connectDB } = require('./connect')
const app = express();
const URL = require('./models/url')
const PORT = 3001;
const urlRoute = require('./routes/url');
const path = require('path')
const staticRoute = require('./routes/staticRouter')
connectDB('mongodb://localhost:27017/urlShortner').then(() => {
    console.log('MongoDb Connected')
});

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls
    })
})
app.use('/url', urlRoute);

app.use("/", staticRoute)


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