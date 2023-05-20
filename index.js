const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
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

function init() {
  startMenu();
}

// Start menu (display on start)
function startMenu() {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'startMenu',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
      }
    ]);
}