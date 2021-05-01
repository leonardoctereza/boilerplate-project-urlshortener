require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const UrlShortener = require('./urlModel');
const dns = require('dns');

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
  const originalUrl = req.body.url;
  const url = new URL(originalUrl);
  try{
    dns.lookup(url.hostname,function (err,address) {
      if(err || !originalUrl.includes("http")) {
        res.json({ error: 'invalid url' });
      }
      let objUrl = new UrlShortener({original_url:originalUrl});
      objUrl.save(function (err,obj) {
        if(err){
          throw err;
        } 
        res.status(200).json(
          {original_url:obj.original_url,
            short_url:obj.short_url});
          });
        return;
    })
    }catch(error){
      res.status(500).json({"error":'invalid url'});
      return;
    }
  });

app.get('/api/shorturl/:urlId', async function (req,res,next) {
  const urlId = req.params.urlId;
  try {
    let urlObj = await UrlShortener.findOne({short_url: urlId});
    if(urlObj){
      res.status(301).redirect(urlObj.original_url);
    }else{
      res.status(500).json({'error':'url not found'});
    }
  } catch (error) {
    res.status(500).json({'error':error});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
