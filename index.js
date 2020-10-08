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
        "Update employee role",
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
        case "Update employee role":
          updateEmployeeRoles();
          break;
        case "Delete employee":
          deleteEmployee();
          break;
        default:
          console.log(answers.selection + "  still default");

          break;
      }
    });
};

// Individial view all functions for employees departments and roles
const viewAllEmployees = () => {
  console.log(
    boxen(
      "                            - EMPLOYEES -                             ",
      { padding: 1, borderStyle: "double" }
    )
  );
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
    console.log(
      `-------------------------------------------------------------------------------`
    );
    start();
  });
};

const viewAllDepartments = () => {
  console.log(
    boxen("       - DEPARTMENTS -        ", {
      padding: 1,
      borderStyle: "double",
    })
  );
  const query = `SELECT 
  departments.id AS "ID",
  dep_name AS "Department Name"
  FROM departments
  ORDER BY departments.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    console.log(`------------------------------`);
    start();
  });
};

const viewAllRoles = () => {
  console.log(
    boxen("                  - ROLES -                   ", {
      padding: 1,
      borderStyle: "double",
    })
  );
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
    console.log(`------------------------------------------------------`);
    start();
  });
};

//  - Individial add functions for employees departments and roles
const addEmployee = () => {
  console.log(
    boxen("           - ADD NEW EMPLOYEE -            ", {
      padding: 1,
      borderStyle: "double",
    })
  );

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
          console.log(
            boxen(
              `     -  ${newEmployee.firstName} ${newEmployee.lastName} has been added -      `,
              { padding: 1, borderStyle: "double" }
            )
          );
          start();
        }
      );
    });
};

const addDepartment = () => {
  console.log(
    boxen("           - ADD NEW DEPARTMENT -            ", {
      padding: 1,
      borderStyle: "double",
    })
  );
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

      var query = "INSERT INTO departments (dep_name) Value (?)";
      connection.query(query, [newDep.depName], (err) => {
        if (err) throw err;
        console.log(
          boxen(`      -  ${newDep.depName} has been added -       `, {
            padding: 1,
            borderStyle: "double",
          })
        );
        start();
      });
    });
};

const addRole = () => {
  console.log(
    boxen("           - ADD NEW ROLE -            ", {
      padding: 1,
      borderStyle: "double",
    })
  );
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the new role's title",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter corresponding salary",
      },
      {
        name: "depId",
        type: "number",
        message: "Enter corresponding department id",
      },
    ])
    .then((answers) => {
      const newRole = {
        roleTitle: answers.roleTitle,
        salary: answers.salary,
        depId: answers.depId,
      };

      var query = "INSERT INTO roles (title, salary, dep_id) Values (?,?,?)";
      connection.query(
        query,
        [newRole.roleTitle, newRole.salary, newRole.depId],
        (err) => {
          if (err) throw err;
          console.log(
            boxen(`      -  ${newRole.roleTitle} has been added -       `, {
              padding: 1,
              borderStyle: "double",
            })
          );
          start();
        }
      );
    });
};

// Update function
const updateEmployeeRoles = () => {
  console.log(
    boxen("           - UPDATE EMPLOYEE ROLE -            ", {
      padding: 1,
      borderStyle: "double",
    })
  );
  // Query our employees
  connection.query(
    "SELECT id, first_name, last_name FROM employees",
    (err, res) => {
      if (err) throw err;

      // Create array of employees
      let employeesArray = [];
      res.forEach(employee => {
        employeesArray.push({
          name: `${employee.first_name} ${employee.last_name}`,
          id: employee.id,
        });
      });
     

      // Inqure as to which employee to update
      inquirer
        .prompt([
          {
            name: "selectedEmployee",
            type: "list",
            message: "Which Employee would you like to update?",
            choices: employeesArray,
          },
        ])
        .then((answers) => {
          // Store selected employee and corresponding id
          const selectedEmployee = answers.selectedEmployee;
          let employeeId;
          for (i = 0; i < employeesArray.length; i++) {
            if (employeesArray[i].name === selectedEmployee) {
              employeeId = employeesArray[i].id;
            }
          }

          // Query roles
          connection.query("SELECT id, title FROM roles", (err, res) => {
            if (err) throw err;
            // create array of exsisting roles
            let roles = [];
            res.forEach(role => {
              roles.push({ name: role.title, id: role.id });
            });
            
            // Inqure new role to update
            inquirer
              .prompt([
                {
                  name: "newRole",
                  type: "list",
                  message: "Select new role",
                  choices: roles,
                },
              ])
              .then((answers) => {
                // Store selected role and corresponding id
                const selectedRole = answers.newRole;
                let roleId;
                for (i = 0; i < roles.length; i++) {
                  if (roles[i].name === selectedRole) {
                    roleId = roles[i].id;
                  }
                }

                // Update query using role and employee id
                connection.query(
                  "UPDATE employees SET role_id =? WHERE id = ?",
                  [roleId, employeeId],
                  (err) => {
                    if (err) throw err;

                    console.log(
                      boxen(
                        `     -  ${selectedEmployee.toUpperCase()}'S ROLE HAS BEEN UPDATED TO ${selectedRole.toUpperCase()}  -      `,
                        {
                          padding: 1,
                          borderStyle: "double",
                        }
                      )
                    );

                    start();
                  }
                );
              });
          });
        });
    }
  );
};

//  Individial delete functions for employees
const deleteEmployee = () => {
  console.log(
    boxen("           - DELETE EMPLOYEE -            ", {
      padding: 1,
      borderStyle: "double",
    })
  );
  // Query our employees
  connection.query(
    "SELECT id, first_name, last_name FROM employees",
    (err, res) => {
      if (err) throw err;

      // Create array of employees
      let employeesArray = [];
      for (i = 0; i < res.length; i++) {
        employeesArray.push({
          name: `${res[i].first_name} ${res[i].last_name}`,
          id: res[i].id,
        });
      }

      // Inqure as to which employee to Delete
      inquirer
        .prompt([
          {
            name: "selectedEmployee",
            type: "list",
            message: "Which Employee would you like to delete?",
            choices: employeesArray,
          },
          {
            message: "Are you sure you want to delete this employee?",
            type: "confirm",
            name: "confirm",
            default: false,
          },
        ])
        .then((answers) => {
          if (answers.confirm) {
            const selectedEmployee = answers.selectedEmployee;
            let employeeId;
            for (i = 0; i < employeesArray.length; i++) {
              if (employeesArray[i].name === selectedEmployee) {
                employeeId = employeesArray[i].id;
              }
            }

            connection.query(
              "DELETE FROM employees WHERE id = ?",
              [employeeId],
              function (err) {
                if (err) throw err;
                console.log(
                  boxen(
                    `     -  ${selectedEmployee.toUpperCase()} HAS BEEN DELETED  -      `,
                    {
                      padding: 1,
                      borderStyle: "double",
                    }
                  )
                );
                start();
              }
            );
          } else {
            start();
          };
          // Store selected employee and corresponding id
        });
    }
  );
};

connection.connect(() => {
  console.log("connected as id " + connection.threadId + "\n");

  console.log(
    boxen("              - EMPLOYEE MANAGER -                ", {
      padding: 1,
      borderStyle: "double",
    })
  );
  start();
});
