INSERT INTO department(name)
VALUES ("Feild Tech"),
("Cutomer service and billing"),
("scheduling department");

INSERT INTO ROLE (title, salary, department_id)
VALUES ("feild tech manager",80000,1),
("Journeyman tech", 65000,1),
("Apprentice tech",40000,1),
("Customer service & billing manager",70000,2),
("Customer service & biling tech",25000,2),
("Scheduling dpartment manager",70000,3),
("Scheduling department assitant manager",50000,3),
("Scheduling department tech",25000,3);

INSERT INTO employee(first_name, last_name, role_id,manager_id)
VALUES ("Mike","Mikels",1,null),
("james","jamison",2,1),
("chris","pizano",3,1),
("Richie","Valzi",4,null),
("Andrew","Mcmikles",5,4),
("Dillon","Pickels",5,4),
("Andrew","Mcmikles",6,null),
("Tom","Mandion",7,7),
("Jerry","Rightford",8,7);
