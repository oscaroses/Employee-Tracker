//Required modules.
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table")

//Default port and default enviroment port.
var PORT = process.env.PORT || 8080;

//Connection login
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tacos",
  database: "employee_db"
});

//Function used to connect, also calls initial startup function that runs the app.
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  startUp()
});

//Default function that shows main menu.
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

//Functions used to grab requested data by user.
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
  let query = "SELECT * FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id) ORDER BY employee.id ASC;"


  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    startUp()
  })
}

//Functions used to add to database.
function addDept() {
  let query = "SELECT * FROM employee_db.department;"
  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
  })
  inquirer.prompt([
    {
      type: "input",
      name: "addDept",
      message: "What will the name of the department be?"
    }
  ]).then((answer) => {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.addDept
      },
      function (err, res) {
        if (err) throw err;
        console.log("Department added.\n");
        console.table(res);
        startUp();
      })
  })
}

function addRole() {
  let query = "SELECT * FROM department;"
  connection.query(query, function (err, res) {
    if (err) return err;
    let deptChoice = res.map(({ id, name }) => ({
      name: name,
      value: id
    }))
    inquirer.prompt([
      {
        type: "input",
        name: "Title",
        message: "Enter employee title:"
      },
      {
        type: "input",
        name: "Salary",
        message: "Enter employee salary:"
      },
      {
        type: "list",
        name: "Dept_ID",
        message: "Choose department for employee:",
        choices: deptChoice
      }
    ]).then((answer) => {
      connection.query("INSERT INTO role SET ?",
        {
          title: answer.Title,
          salary: answer.Salary,
          department_id: answer.Dept_ID
        },
        function (err, res) {
          if (err) throw err;
          console.log("Role added.\n");
          console.table(answer);
          startUp();
        })
    })
  })
}

function addEmp() {
  inquirer.prompt([
    {
      type: "input",
      name: "First",
      message: "Enter employee first name:"
    },
    {
      type: "input",
      name: "Last",
      message: "Enter employee last name:"
    },
  ]).then((answer) => {
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: answer.First,
        last_name: answer.Last
      },
      function (err, res) {
        if (err) throw err;
        console.log("Employee added.\n");
        console.table(answer);
        startUp();
      })
  })
}

function updateEmp() {

}