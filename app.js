var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table")

var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tacos",
  database: "employee_db"
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  startUp()
});

function startUp() {
  inquirer.prompt([
    {
      type: "list",
      name: "initial",
      message: "What would you like to do?",
      choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "End",
      ],
    }
  ]).then((answer) => {
    switch (answer.initial) {
      case "View All Departments":
        viewDepts();
        break;

      case "View All Roles":
        viewRoles();
        break;

      case "View All Employees":
        viewEmps();
        break;

      case "Add Department":
        addDept();
        break;

      case "Add Role":
        addRole();
        break;

      case "Add Employee":
        addEmp();
        break;

      case "Update Employee Role":
        updateEmp();
        break;

      case "End":
        connection.end();
        break;
    }
  });
}

function viewDepts() {
  let query = "SELECT * FROM employee_db.department;"

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    startUp()
  })
}

function viewRoles() {
  let query = "SELECT * FROM employee_db.role;"

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    startUp()
  })
}

function viewEmps() {
  let query = "SELECT * FROM employee_db.employee;"

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    startUp()
  })
}