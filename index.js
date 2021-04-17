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
const cookieParser = require("cookie-parser");
const uploadDirectory = __dirname + path.sep + "uploaded";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use(express.static("uploaded"));
app.use(express.static("public"));
app.use(cookieParser());

let caches = {};



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
//
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

app.post("/files", (request, response) => {
  console.log("**********");
  console.log("What should happen: Upload");
  console.log("Received this data from: HTML document");
  console.log("This should go: to the /files route");
  console.log("What is happening: ");
  console.log("**********");
  console.log(request.files);
  caches["hi"] = request.files;
  console.log(caches);
  if (request.files.upload instanceof Array) {
    console.log("this is an array ");
    for (let i = 0; i < request.files.upload.length; i++) {
      console.log(request.files.upload[i]);
      let fileName = request.files.upload[i].name;
      let fileData = request.files.upload[i].data;
      caches[fileName] = writeFile(fileName, fileData);

      caches[fileName]
        .then(() => {
          console.log("File Name: ", fileName);
          console.log("File Data: ", caches[fileName]);
          console.log("Setting Cookie Here!");
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
function getCookie(request) {
  let cookie = request.headers.cookie;
  let value = request.headers.cookie.indexOf("=");
  let newCookie = cookie.slice(value + 1);
  console.log("Cookie key: ", request.params.name);
  console.log("Cookie value: ", newCookie);
  return cookie.split(" ");
}

app.get("/cookie/:name", (request, response) => {
  console.log("Params name: ", request.params.name);
  let cookie = getCookie(request);
  response.sendFile(
    __dirname + `/uploaded/${request.params.name}`
  );
});
console.log(caches["memes.png"]);

app.get("/uploaded/:name", (request, response) => {
  console.log("Params name: ", request.params.name);
  console.log("Uploaded/name function");
  response.sendFile(
    __dirname + `/uploaded/${request.params.name}`
  );
  //   if (caches[request.params.name] == null) {
  //     console.log("reading from file");
  //     caches[request.params.name] = readFile(
  //       request.params.name
  //     );
  //     caches[request.params.name]
  //       .then((body) => {
  //         console.log(body);
  //         response.send(body);
  //       })
  //       .catch((error) => {
  //         response.status(500).send(error.message);
  //       });
  //   }
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

/**********************************************
 *
 * ==================================
 ***********************************************/
app.listen(3000, () => {
  console.log(`Application Listening to port: ${3000}`);
});
