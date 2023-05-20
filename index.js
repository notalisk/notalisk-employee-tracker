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
      break;
    case startMenuOptions[1]:
      // code
      break;
    case startMenuOptions[2]:
      // code
      break;
    case startMenuOptions[3]:
      // code
      break;
    case startMenuOptions[4]:
      // code
      break;
    case startMenuOptions[5]:
      // code
      break;
    case startMenuOptions[6]:
      // code
      break;
  }
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

function viewDepartments() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log(results);
  });
  return;
}