/*
  REMOVE COMMENTS BEFORE SUBMITTING YOUR HOMEWORK
*/

// Import inquirer
// Optional: import asciiart-logo
// import your database module
const { default: inquirer } = require("inquirer");
const db = require("./db");

require("console.table");

// Call startup function
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
});



const mainPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'actioncall',
            message: 'Please select your desierd action',
            choices: [
                'View all Employees',
                'View all Departments',
                'View all Roles',
                'Add new Role',
                'Add new Department',
                'Add new employee',// done up to here
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",//extra credit 
                'Delete exsiting role',
                'Delete exsisting department',
                'Delete exsiting employee',
                'View  budgets by department',
                'Exit']

        }
    ])
        .then((selected) => {
            const { userChioce } = selected;
            if (userChioce === "View all Employees") {
                viewEmployees();
            }
            if (userChioce === "View all Departments") {
                viewDepartments();
            }
            if (userChioce === "View all Roles") {
                viewRoles();
            }
            if (userChioce === "Add new Role") {
                addRole();
            }
            if (userChioce === "Add new Department") {
                addDepartment();
            }
            if (userChioce === "Add new employee") {
                addEmployee();
            }
            if (userChioce === "Update an employee role") {
                updateRole();
            }
            if (userChioce === "Update an employee manager") {
                updateManager();
            }
            if (userChioce === "View employees by department") {
                employeeDepartment();
            }
            if (userChioce === "Delete exsiting role") {
                deleteRole();
            }
            if (userChioce === "Delete exsiting department") {
                deleteDepartment();
            }
            if (userChioce === "Delete exsiting employee") {
                deleteEmployee();
            }
            if (userChioce === "View  budgets by department") {
                showBudgets();
            }
            if (userChioce === "Exit") {
                connection.end()
            };



        });
};

const viewEmployees = () => {
    const dis = 'SELECT * FROM employee';
    connection.dis(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}

const viewDepartments = () => {
    const dis = "SELECT * FROM department";
    connection.dis(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}
const viewRoles = () => {
    const dis = "SELECT * FROM role";
    connection.dis(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}
const addRole = () => {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'Enter title for new role'
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter salary of new role',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Enter department of new role...',
                    choices: departments,
                },
            ])
            .then((data) => {
                connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: data.role,
                        salary: data.roleSalary,
                        department_id: data.departmentId,
                    },
                    function (err) {
                        if (err) throw err;
                    }
                );
                console.log('New employee role has been added')
                mainPrompt();
            });

    });

};
const addNewDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: 'Enter the name for new Department'
            },
        ])
        .then((data) => {
            connection.query('INSERT INTO department SET ?',
                {
                    name: data.addDepartment,
                },
                function (err) {
                    if (err) throw err;
                }
            );
            console.log('New department has been created');
            mainPrompt();
        });
};
const addEmployee = () => {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter new employees first name'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter new employees last name'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the role of new employee',
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'managersId',
                    message: 'Select new employees mangager id',
                    choices: [1, 4, 7,]
                }
            ])
            .then((data) => {
                console.log(data.role);
                connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: data.role,
                        manager_id: data.managersId
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('New employee has been added to Database');
                        mainPrompt()

                    }
                );
            });

    });

};



// function - Update an employee's role
//  1. call function to find all employees on database connection
//      - in .then callback, take first name, last name, and id from the returned database data and create an array
//        of new employee objects with .map().
//      - new objects have two properties, name and value
//        name consists of first name and last name from the returned database data
//        value has id from the returned database data
//  2. prompt the list of choices from the new array of employee objects
//      - in .then callback, store employee id to a variable from the returned user choice
//  3. call function to find all roles on database connection
//      - in .then callback, create a new array of new role objects using .map on the returned database role data
//      - for the new role objects, assign title from returned database data to the name property and assign id to the value property
//  4. prompt user with the list of choices from the new array of new role objects
//      - in .then callback, assign returned user choice to a role id variable
//  5. call function to update employee role, passing employee id variable and role id variable as input arguments
//  6. call fucntion to load main prompt of questions


// function - Exit the application

// ========================
//  OPTIONAL
// ========================

// fuction - View all employees that belong to a department

// function - View all employees that report to a specific manager

// function - Update an employee's manager

// function - View all departments and show their total utilized department budget

// function - Delete an employee

// function - Delete a department

// function - Delete a role

