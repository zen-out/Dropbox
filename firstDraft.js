/**********************************************
 * Upload Profile
 * ==================================
 ***********************************************/
/** # 
 * Being able to read, understand and utilize libraries is a key skill for any developer
 * 
 * Please read the documentation of express fileupload here: 
 * https://www.npmjs.com/package/express-fileupload
 *  #
/*  ====================== */
/**  */
const express = require("express");
// These are the node modules that we installed
const bodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");
// These are the native modules that node already has
const fs = require("fs");
const path = require("path");
const uploadDirectory = __dirname + path.sep + "uploaded";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use(express.static("uploaded"));
app.use(express.static("public"));

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

let caches = {};

/**********************************************
 * Read File Function
 * ==================================
 * Given file name
 * It will return file
 ***********************************************/
function readFile(file) {
  console.log("Read file function running");
  // promise
  return new Promise((resolve, reject) => {
    fs.readFile(
      //
      uploadDirectory + path.sep + file,
      (err, body) => {
        if (err) {
          console.log("Error: ", err);
          return reject(err);
        } else {
          console.log("Body: ", body);
          resolve(body);
        }
      }
    );
  });
}

/**********************************************
 * Write File Function
 * ==================================
 * Given name and body
 * It will upload the file into the upload directory
 ***********************************************/
function writeFile(name, body) {
  console.log("Write file function running");
  return new Promise((resolve, reject) => {
    fs.writeFile(
      uploadDirectory + path.sep + name,
      body,
      (err) => {
        if (err) {
          return reject(err);
        } else {
          resolve(name);
        }
      }
    );
    // then read the file
  }).then(readFile);
}

app.post("/postform", (request, response) => {
  console.log(request.body);
  console.log("post");
  response.send("got the post request");
});

/**********************************************
 * Handle post route
 * ==================================
 * If it's an array (user uploaded more than one file), then write file for each one
 * Otherwise, just write file for that one
 ***********************************************/
app.post("/files", (request, response) => {
  console.log(request.files);
  console.log(caches);
  // if user uploaded more than one file
  if (request.files.upload instanceof Array) {
    console.log("this is an array ");
    // loop through the array
    for (let i = 0; i < request.files.upload.length; i++) {
      console.log(request.files.upload[i]);
      // get the name
      let fileName = request.files.upload[i].name;
      // get the data
      let fileData = request.files.upload[i].data;
      // write the file into the directory
      // as well as save it in the cahce
      caches[fileName] = writeFile(fileName, fileData);
      caches[fileName]
        .then(() => {
          console.log("File Name: ", fileName);
          console.log("File Data: ", caches[fileName]);
          // set the cookie here
          response.cookie(fileName, caches[fileName]);
          response.end("it works!");
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  } else {
    console.log(
      "Not an instance of an array - let's see if this loads"
    );
    // otherwise
    console.log(request.files);
    let fileName = request.files.upload.name;
    let fileData = request.files.upload.data;
    caches[fileName] = writeFile(fileName, fileData);

    caches[fileName]
      .then(() => {
        console.log("File Name: ", fileName);
        console.log("File Data: ", caches[fileName]);
        console.log("Setting Cookie Here!");
        response.cookie(fileName, caches[fileName]);

        response.send("Saved the uploaded file");
      })
      .catch((error) => {
        response.status(500).send(error.message);
      });
  }
});
// function getCookie(request) {
//   let cookie = request.headers.cookie;
//   let value = request.headers.cookie.indexOf("=");
//   let newCookie = cookie.slice(value + 1);
//   console.log("Cookie key: ", request.params.name);
//   console.log("Cookie value: ", newCookie);
//   return cookie.split(" ");
// }

// app.get("/cookie/:name", (request, response) => {
//   console.log("Params name: ", request.params.name);
//   let cookie = getCookie(request);
//   response.sendFile(
//     __dirname + `/uploaded/${request.params.name}`
//   );
// });
// console.log(caches["memes.png"]);

app.get("/uploaded/:name", (request, response) => {
  console.log("Params name: ", request.params.name);
  console.log("Uploaded/name function");
  response.sendFile(
    __dirname + `/uploaded/${request.params.name}`
  );
});

app.get("/caches/:name", (request, response) => {
  if (caches[request.params.name] == null) {
    console.log("reading from file");
    caches[request.params.name] = readFile(
      request.params.name
    );
    caches[request.params.name]
      .then((body) => {
        console.log(body);
        response.send(body);
      })
      .catch((error) => {
        response.status(500).send(error.message);
      });
  }
});

app.get("/dropbox", (request, response) => {
  response.sendFile(__dirname + "/views/dropbox.html");
});
app.get("/advanced", (request, response) => {
  response.sendFile(__dirname + "/views/advanced.html");
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/planning.html");
});

/**********************************************
 * Listen on port 3000
 * ==================================
 ***********************************************/
app.listen(3000, () => {
  console.log(`Application Listening to port: ${3000}`);
});
