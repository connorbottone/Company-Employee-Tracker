--If there is a db with the same naming convention it will be dropeed and a new db will be created--
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
--department table that has peramiters of an id and a name--
USE employees_db;

CREATE TABLE department (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) UNIQUE NOT NULL
);
-- role table that has the peramiters of id title salary and department id that will refernece primary key in department--
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
--employee table that has the peramitors of if first and last name role id and manager id the role id will refernce role and the manger id to set the managers 1 4 7 of each employee--
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT,

  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);