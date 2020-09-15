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

// Initial inquirer questions
const start = () => {
  inquirer
    .prompt({
      type: "list",
      name: "selection",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add employee",
        "Add department",
        "Add role",
        "Delete employee",
      ],
    })
    .then((answers) => {
      console.log(answers);

      // switch case for each option available that runs our functions
      switch (answers.selection) {
        case "view all employees":
          break;
        case "View all departments":
          break;
        case "View all roles":
          break;
        case "Add employee":
          break;
        case "Add department":
          break;
        case "Add role":
          break;
      }
    });
};

// Functions needed
//  - Individial view all functions for employees departments and roles
//      - Use department, role, and manager ids to display correponding data from all 3 tables as our view all employees

const viewAllEmployees = () => {

}
const viewAllDepartment = () => {
  
}
const viewAllRoles = () => {
  
}
//  - Individial add functions for employees departments and roles
//      - add function contains a subset of inquirer questions for entering information
//  - Individial delete functions for employees departments and roles

connection.connect(function () {
  console.log("connected as id " + connection.threadId + "\n");
  start();
});
