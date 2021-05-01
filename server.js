require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const UrlShortener = require('./urlModel');
const {isValidUrl} = require('./utils');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', function (req,res,next) {
  const url = req.body.url;
  try {
    if(isValidUrl(url)){
      let objUrl = new UrlShortener({original_url:url});
      objUrl.save(function (err,obj) {
        if(err) throw err;
        res.status(200).json(
          {original_url:obj.original_url,
            short_url:obj.short_url});
          next();
      });
    }else{
      res.status(500).json({"error":'invalid url'});
      next();
    }
  } catch (error) {
    res.status(500).json({"error": error});
    next();
  }

});

app.get('/api/shorturl/:urlId', async function (req,res,next) {
  const urlId = req.params.urlId;
  try {
    let urlObj = await UrlShortener.findOne({short_url: urlId});
    if(urlObj){
      console.log(urlObj);
      res.status(301).redirect(urlObj.original_url);
    }
  } catch (error) {
    res.status(500).json({'error':error});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
