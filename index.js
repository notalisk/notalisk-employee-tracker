const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company_db'
  },
);

// Connect to the database
db.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the company database.');
    init();
  }
});

// Set menu options
const startMenuOptions = ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'];

async function init() {
  let response = await startMenu();

  // Decide what to do based on response
  switch (response.startMenu) {
    case startMenuOptions[0]:
      console.log('Viewing departments');
      await viewDepartments();
      cont();
      break;
    case startMenuOptions[1]:
      console.log('Viewing roles');
      await viewRoles();
      cont();
      break;
    case startMenuOptions[2]:
      console.log('Viewing employees');
      await viewEmployees();
      cont();
      break;
    case startMenuOptions[3]:
      console.log('Adding a new department');
      await addDepartment();
      cont();
      break;
    case startMenuOptions[4]:
      console.log('Adding a new role');
      await addRole();
      cont();
      break;
    case startMenuOptions[5]:
      console.log('Adding a new employee');
      await addEmployee();
      cont();
      break;
    case startMenuOptions[6]:
      console.log('Updating employee role');
      await updateEmployeeRole();
      cont();
      break;
  }

  return;
}

function cont() {
  inquirer.prompt([
    {
      type: 'confirm',
      message: 'Return to main menu? (y = main menu, n = exit app)\n',
      name: 'contPrompt'
    }
  ]).then((response) => {
    if (response.contPrompt) {
      init();
    } else {
      return;
    }
  });
}

// Start menu (display on start)
function startMenu() {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'startMenu',
        choices: startMenuOptions
      }
    ]);
}

// View departments
function viewDepartments() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
  });
  return;
}

// View roles (and departments as a left join)
function viewRoles() {
  db.query(`SELECT role.id, title, salary, name AS department FROM role INNER JOIN department ON role.department_id = department.id`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
  });
  return;
}

// View employees (and roles and departments and managers)
function viewEmployees() {
  db.query(`SELECT A.id, A.first_name, A.last_name, role.title, department.name AS department, role.salary, A.manager_id, B.first_name AS manager_first_name, B.last_name AS manager_last_name
  FROM company_db.employee A
  LEFT JOIN company_db.employee B ON A.manager_id = B.id
  LEFT JOIN role ON A.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
  });
  return;
}

// Add department
async function addDepartment() {
  let response = await inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the name of the new department:',
      name: 'newDepartment'
    }
  ]);

  db.query(`INSERT INTO company_db.department (name) VALUES ('${response.newDepartment}');`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log('Department successfully added!');
  });

  return;
}

async function addRole() {
  let response = await inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the title of the new role:',
      name: 'title'
    },
    {
      type: 'number',
      message: 'What is the salary?',
      name: 'salary'
    },
    {
      type: 'input',
      message: 'Enter the ID number of the corresponding department:',
      name: 'departmentId'
    }
  ]);

  db.query(`INSERT INTO company_db.role (title, salary, department_id) VALUES ('${response.title}', '${response.salary}', '${response.departmentId}');`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log('Role successfully added!');
  });

  return;
}

async function addEmployee() {
  let response = await inquirer.prompt([
    {
      type: 'input',
      message: 'First name:',
      name: 'firstName'
    },
    {
      type: 'input',
      message: 'Last name:',
      name: 'lastName'
    },
    {
      type: 'number',
      message: 'Enter the ID number of the employees role:',
      name: 'roleId'
    },
    {
      type: 'number',
      message: 'Enter the ID of the employee manager:',
      name: 'managerId'
    }
  ]);

  db.query(`INSERT INTO company_db.employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', '${response.roleId}', '${response.managerId}');`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log('Role successfully added!');
  });

  return;
}

async function updateEmployeeRole() {

  // Get employees and map to array (first and last name)
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) {
      console.log(err);
    }
    
    let employees = results.map((data) => {
      return [data.first_name, data.last_name].join(' ');
    });

    // Get roles and map to array (title)
    db.query(`SELECT * FROM role`, (err, results) => {
      if (err) {
        console.log(err);
      }

      let roles = results.map((data) => {
        return data.title;
      });

      // Prompt
      inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee would you like to update?',
          name: 'employeeToUpdate',
          choices: employees
        }, 
        {
          type: 'list',
          message: 'Select their new role:',
          name: 'newRole',
          choices: roles
        }
      ])
      .then((response) => {

        // Get role_id from role name
        let roleId = roles.findIndex((roles) => {
          return roles == response.newRole;
        });

        let employeeId = employees.findIndex((employees) => {
          return employees == response.employeeToUpdate;
        });

        // Update database
        db.query(`UPDATE company_db.employee
          SET role_id = '${roleId + 1}'
          WHERE id = '${employeeId + 1}';`, (err, results) => {
          if (err) {
            console.log(err);
          }

          console.log('Successfully updated!');
        });
      });
    });
  });
}