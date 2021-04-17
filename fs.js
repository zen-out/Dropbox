/**********************************************
 * The purpose of this file is to practice the filesystem module
 * ==================================
 * -
 ***********************************************/

let fs = require("fs");
let path = require("path");

/**********************************************
 * Reading from a text file
 * ==================================
 ***********************************************/
fs.readFile(
  __dirname + "/sampleData/harryPotter.txt",
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data.toString());
    }
  }
);

/**********************************************
 * Reading from a JSON file
 * ==================================
 ***********************************************/

fs.readFile(
  __dirname + "/sampleData/data.json",
  function (error, data) {
    if (error) {
      console.log("Error", error);
    } else {
      console.log(JSON.parse(data));
    }
  }
);

/**********************************************
 * Writing to a file
 * ==================================
 ***********************************************/

let dog = {
  name: "whiskey",
  age: 11,
  breed: "shiba inu",
};

let stringed = JSON.stringify(dog);

fs.writeFile(
  __dirname + "/sampleData/data.json",
  stringed,
  (error) => {
    if (error) {
      console.log("error");
    } else {
      console.log("data inputted: ", stringed);
    }
  }
);
