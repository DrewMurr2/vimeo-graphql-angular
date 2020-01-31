var CLIENT_ID = '7929982d78c5e20f0f70c917a502263fc831b084';
var CLIENT_SECRET = 'niDFeFtJOl/YZDaGvZJ7UU9wPZid1aE54d5KikDWUGWEq7LHAOIu9gNlqCnn12IfgNChkxkggcp/h9PQJbNDllwdWyLJkEqxgFm3DhTCvO1gXA1WaEYWCHOZEcmmPeKi';
var ACCESS_TOKEN = 'c4cc0f251eed8d22bb65d0741477321b';
var Vimeo = require('vimeo').Vimeo;
var client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);
var fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storeFS = ({ stream, filename }) => {
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
    .on('error', error => {
      if (stream.truncated)
      // delete the truncated file
        fs.unlinkSync(path);
      reject(error);
    })
    .pipe(fs.createWriteStream(path))
    .on('error', error => reject(error))
    .on('finish', () => resolve({ path }))
  );
}

const createVideo = async(args) => {
  const { videoName, videoDescription } = args;
  const { filename, mimetype, createReadStream } = await args.file;
  const stream = createReadStream();
  const pathObj = await storeFS({ stream, filename });
  const fileLocation = pathObj.path;
  return new Promise(function(resolve, reject) {
    client.upload(
      fileLocation, {
        name: videoName,
        description: videoDescription
      },
      function(uri) {
        fs.unlinkSync(fileLocation);
        console.log('File upload completed. Your Vimeo URI is:', uri)
        resolve({ response: uri });
      },
      function(bytesUploaded, bytesTotal) {
        var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
        console.log("progress in", percentage);
      },
      function(error) {
        reject({ respose: error });
      }
    );
  });
}

const updateVideo = async(args) => {
  const { videoURI } = args;
  const { filename, mimetype, createReadStream } = await args.file;
  const stream = createReadStream();
  const pathObj = await storeFS({ stream, filename });
  const fileLocation = pathObj.path;
  return new Promise(function(resolve, reject) {
    client.replace(
      fileLocation,
      videoURI,
      function(uri) {
        fs.unlinkSync(fileLocation);
        console.log('File upload completed. Your Vimeo URI is:', uri)
        resolve({ response: uri });
      },
      function(bytesUploaded, bytesTotal) {
        var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
        console.log("progress in", percentage);
      },
      function(error) {
        reject({ respose: error });
      }
    );
  });
}

const getVideoList = async() => {
  return new Promise(function(resolve, reject) {
    client.request({
        path: '/users/107605898/videos'
          /*107605898 is your userid 
            reference https://developer.vimeo.com/api/reference/videos#get_videos
          */
      },
      function(error, body, status_code, headers) {
        if (error) {
          reject(error);
        } else {
          // return videos;
          resolve(body.data);
        }
      });
  });
}

const deleteVideo = ({ uri }) => {
  return new Promise(function(resolve, reject) {
    client.request({
      method: 'DELETE',
      path: '/videos/' + uri
        /*deleting by videoid 
          reference https://developer.vimeo.com/api/reference/videos#delete_video
        */
    }, function(error, body, status_code, headers) {
      if (error) {
        reject({ response: "getting delete error" });
      } else {
        resolve({ response: "deleted successfully" });
      }

    });
  });
}

module.exports = {
  Query: {
    videos: () => { return getVideoList().then(res => { return res; }) }
  },
  Mutation: {
    createVideo: (_, { file, videoName, videoDescription }) => { return createVideo({ file, videoName, videoDescription }).then(res => { return res; }) },
    deleteVideo: (_, { videoURI }) => { return deleteVideo({ uri: videoURI }).then(res => { return res; }) },
    updateVideo: (_, { file, videoURI }) => { return updateVideo({ file, videoURI }).then(res => { return res; }) }
  }
};