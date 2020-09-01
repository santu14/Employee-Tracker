// Set up inquirer mysq and tables npm
const mysql = require("mysql");
const inquirer = require("inquirer");

// set up my sql connection
const connection = mysql.createConnection({
    host: "localhost",
    
    port: 8080,
    
    // Your username
    user: "root",
    
    // Your password
    password: "mysqlpassword",
    database: "employeesbd",
});



connection.connect(function () {
  console.log("connected as id " + connection.threadId + "\n");
  start();
});
