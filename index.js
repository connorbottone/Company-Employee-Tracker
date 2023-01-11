

// Imports inquire
// Imports your database module
const inquirer = require("inquirer");
const db = require("./db");

require("console.table");

// Call startup function
const mysql = require("mysql2");
//creating connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
});


//inital prompt that will be ran at the launch of program
const mainPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChioce',
            message: 'Please select your desierd action',
            choices: [
                'View all Employees',
                'View all Departments',
                'View all Roles',
                'Add new Role',
                'Add new Department',
                'Add new employee',
                'Update an employee role',
                'Exit']

        }
    ])//Taking the value of what the user selected and comparing it to out options to see what function needs to be called
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
            if (userChioce === "Exit") {
                connection.end()
            };



        });
};
//displaying all of our employees within the database, then mainprompt will be initiaed again where user can make a new choice of what they want to do
const viewEmployees = () => {
    const dis= 'SELECT * FROM employee';
    connection.query(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}
//displaying all of our Departments within the database, then mainprompt will be initiaed again where user can make a new choice of what they want to do
const viewDepartments = () => {
    const dis = "SELECT * FROM department";
    connection.query(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}
//displaying all of our Roles within the database, then mainprompt will be initiaed again where user can make a new choice of what they want to do
const viewRoles = () => {
    const dis = "SELECT * FROM role";
    connection.query(dis, (err, res) => {
        if (err) throw err;
        console.table(res)
    })
    mainPrompt()
}
//selecting all from departments so user can specify what department they want to create a new role within
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
            //Adding our new role to the database
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

};//User will input fileds for a new dep and then it will be inserted into our database
const addDepartment = () => {
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
};//we are grabing all roles from db so user can define the role of the newlt created employee
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
                {//1,4,7, our our 3 manager ids refrence seeds.sql
                    type: 'list',
                    name: 'managersId',
                    message: 'Select new employees mangager id',
                    choices: [1, 4, 7,]
                }
            ])//adds our new employee to the db
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

};//this function will chnage the role of an already exsisting employee in out database then the user will chose the role they want to reassign to the employee
const updateRole =() =>{
    connection.query('SELECT * FROM employee', (err, employed) => {
        if (err) console.log(err);
        employed = employed.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) console.log(err);
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'Employee',
                        message: 'Select the employee you want to reassign role',
                        choices: employed,
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'What role do you want to assign to this employee?',
                        choices: roles,
                    },
                ])
                .then((data) => {
                    connection.query('UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: data.newRole,
                            },
                            {
                                id: data.Employee,
                            },
                        ],
                        function (err) {
                            if (err) throw err;
                        }
                    );
                    console.log('Employee role updated');
                mainPrompt()
                });

        });
    });
};
//Initiate our program
mainPrompt();




