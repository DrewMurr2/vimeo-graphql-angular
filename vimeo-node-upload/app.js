const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const multer = require('multer');
const port = 3000
var fs = require('fs');
var dir = './uploads';
var CLIENT_ID = '7929982d78c5e20f0f70c917a502263fc831b084';
var CLIENT_SECRET = 'niDFeFtJOl/YZDaGvZJ7UU9wPZid1aE54d5KikDWUGWEq7LHAOIu9gNlqCnn12IfgNChkxkggcp/h9PQJbNDllwdWyLJkEqxgFm3DhTCvO1gXA1WaEYWCHOZEcmmPeKi';
var ACCESS_TOKEN = 'c4cc0f251eed8d22bb65d0741477321b';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, dir);
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage })
var Vimeo = require('vimeo').Vimeo;
var client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//video upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  const uploadedFile = dir + "/" + req.file.originalname; //the path where the file exists
  client.upload(
    uploadedFile, {
      name: req.body.fileName,
      description: req.body.fileDescription
    },
    function(uri) {
      fs.unlinkSync(uploadedFile);
      console.log('File upload completed. Your Vimeo URI is:', uri)
      res.json({ "videoUri": uri });
    },
    function(bytesUploaded, bytesTotal) {
      var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
      console.log("progress in", percentage);
    },
    function(error) {
      console.log('Failed because: ' + error)
    }
  )
});
//getting video list you uploaded
app.get('/api/videolist', (req, res) => {
  client.request({
      path: '/users/107605898/videos'
        /*107605898 is your userid 
          reference https://developer.vimeo.com/api/reference/videos#get_videos
        */
    },
    function(error, body, status_code, headers) {
      if (error) {
        res.json({ "error": "getting videolist error" });
      } else {
        res.json({ body });
      }
    });
});
//deleting vimeo video
app.delete('/api/delete/:id', (req, res) => {
  client.request({
    method: 'DELETE',
    path: '/videos/' + req.params.id
      /*deleting by videoid 
        reference https://developer.vimeo.com/api/reference/videos#delete_video
      */
  }, function(error, body, status_code, headers) {
    if (error) {
      res.json({ "error": "getting delete error" });
    } else {
      res.json({ "success": "deleted successfully" });
    }

  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))