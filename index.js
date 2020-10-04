// Set up inquirer mysq and tables npm
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const boxen = require("boxen");

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
      ],
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
          addEmployee();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
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
`);
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
  ORDER BY employees.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`**********************************************************************
    `);
    start();
  });
};

const viewAllDepartments = () => {
  console.log(`
***************************************************
*               -  DEPARTMENTS -                  *
***************************************************
  `);
  const query = `SELECT 
  departments.id AS "ID",
  dep_name AS "Department Name"
  FROM departments
  ORDER BY departments.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`****************************************
    `);
    start();
  });
};

const viewAllRoles = () => {
  console.log(`
****************************************************
*                  -  ROLES -                      *
****************************************************
`);
  const query = `SELECT 
  roles.id AS "ID",
  title AS "Role Title",
  salary AS "Salary",
  dep_name AS "Department"
  FROM roles
  JOIN departments ON roles.dep_id = departments.id
  ORDER BY roles.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`****************************************************
    `);
    start();
  });
};

//  - Individial add functions for employees departments and roles
//      - add function contains a subset of inquirer questions for entering information

const addEmployee = () => {
  console.log(`
****************************************************
*             -  ADD NEW EMPLOYEE -                *
****************************************************
  `);

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee's first name",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee's last name?",
      },
      {
        name: "employeeRole",
        type: "number",
        message: "Enter employee's role id number",
      },
      {
        name: "employeeManager",
        type: "number",
        message: "Enter employee's manager id number",
      },
    ])
    .then((answers) => {
      const newEmployee = {
        firstName: answers.firstName,
        lastName: answers.lastName,
        role: answers.employeeRole,
        manager: answers.employeeManager,
      };
      const query =
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) Values (?, ?, ?, ?)";
      connection.query(
        query,
        [
          newEmployee.firstName,
          newEmployee.lastName,
          newEmployee.role,
          newEmployee.manager,
        ],
        (err) => {
          if (err) throw err;
          console.log(`
*****************************************************
         -  ${newEmployee.firstName} ${newEmployee.lastName} has been added -               
*****************************************************
          `);
          start();
        }
      );
    });
};
const addDepartment = () => {
  console.log(`
****************************************************
*            -  ADD NEW DEPARTMENT -               *
****************************************************
    `);
  inquirer
    .prompt([
      {
        name: "depName",
        type: "input",
        message: "Enter department name",
      },
    ])
    .then((answers) => {

      const newDep = { depName: answers.depName };

      var query ="INSERT INTO departments (dep_name) Value (?)";
      connection.query( query, [newDep.depName], (err) => {
          if (err) throw err;
          console.log(`
*****************************************************
       -  ${newDep.depName} has been added -               
*****************************************************
    `);
          start();
        }
      );
    });
};
const addRole = () => {
  console.log(`
****************************************************
*               -  ADD NEW ROLE -                  *
****************************************************
      `);
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Enter the new role's title"
        },
        {
          name: "salary",
          type: "number",
          message: "Enter corresponding salary"
        },
        {
          name: "depId",
          type: "number",
          message: "Enter corresponding department id"
        },
      ])
      .then((answers) => {
  
        const newRole = { 
          roleTitle: answers.roleTitle,
          salary: answers.salary,
          depId: answers.depId
        };
  
        var query ="INSERT INTO roles (title, salary, dep_id) Values (?,?,?)";
        connection.query( 
          query, [
            newRole.roleTitle,
            newRole.salary,
            newRole.depId
          ], 
          (err) => {
            if (err) throw err;
            console.log(`
  *******************************************************
              -  ${newRole.roleTitle} has been added -               
  *******************************************************
      `);
            start();
          }
        );
      });
};

//  - Individial delete functions for employees departments and roles

connection.connect(function () {
  console.log("connected as id " + connection.threadId + "\n");

  console.log(boxen("EMPLOYEE MANAGER", { padding: 4, borderStyle: "double" }));
  start();
});
