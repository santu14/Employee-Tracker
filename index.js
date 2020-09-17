// Set up inquirer mysq and tables npm
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const boxen = require('boxen');



// set up my sql connection
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  // Your username
  user: "root",


  // Your password
  password: "mysqlpassword",
  database: "employeedb",
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
      ]
    })
    .then((answers) => {
      
  

      // switch case for each option available that runs our functions
      switch (answers.selection) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add employee":
          

          break;
        case "Add department":
          break;
        case "Add role":
          break;
        default:
          console.log(answers.selection + "  still default");

          break;


      }
    });
};

// Functions needed
//  - Individial view all functions for employees departments and roles
//      - Use department, role, and manager ids to display correponding data from all 3 tables as our view all employees

const viewAllEmployees = () => {

  console.log(`
**********************************************************************
*                        -  EMPLOYEES  -                             *
**********************************************************************
`)
  const query = `SELECT 
  employees.id AS "ID",
  first_name AS "First Name",
  last_name AS "Last Name",
  title AS "Title",
  salary AS "Salary",
  departments.dep_name AS "Department"
  FROM employees
  JOIN manager ON employees.manager_id = manager.id
  JOIN roles ON employees.role_id = roles.id
  JOIN departments ON departments.id = roles.dep_id
  ORDER BY employees.id`
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`**********************************************************************
    `)
    start();
  });
}
const viewAllDepartments = () => {
  console.log(`
****************************************
*         -  DEPARTMENTS -             *
****************************************
  `)
  const query = `SELECT 
  departments.id AS "ID",
  dep_name AS "Department Name"
  FROM departments
  ORDER BY departments.id`
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`****************************************
    `)
    start();
  });
};
const viewAllRoles = () => {
  console.log(`
****************************************************
*                  -  ROLES -                      *
****************************************************
`)
  const query = `SELECT 
  roles.id AS "ID",
  title AS "Role Title",
  salary AS "Salary",
  dep_name AS "Department"
  FROM roles
  JOIN departments ON roles.dep_id = departments.id
  ORDER BY roles.id`
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`****************************************************
    `)
    start();
  });
};

//  - Individial add functions for employees departments and roles
//      - add function contains a subset of inquirer questions for entering information



//  - Individial delete functions for employees departments and roles

connection.connect(function () {
  console.log("connected as id " + connection.threadId + "\n");

  console.log(boxen("EMPLOYEE MANAGER", {padding: 4, borderStyle: 'double'}));
  start();
});
