const mongoose = require('mongoose');
const shortId = require('shortid');
mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true,useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
    original_url: {type: String, unique: true},
    short_url: {type: String, unique: true, default: shortId.generate}
});
const UrlShortener = mongoose.model('UrlShort',urlSchema);
module.exports = UrlShortener;