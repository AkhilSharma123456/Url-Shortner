const express = require('express');
const mongoose = require('mongoose');
const ShortId = require('shortid');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortId: String
});

const Url = mongoose.model('Url', urlSchema);

// Create short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortId = ShortId.generate();

    const newUrl = new Url({ originalUrl, shortId });
    await newUrl.save();

    res.json({ shortUrl: `http://localhost:5000/${shortId}` });
});

// Redirect to original URL
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (url) {
        return res.redirect(url.originalUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
