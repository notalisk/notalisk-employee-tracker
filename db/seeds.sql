INSERT INTO department (name)
VALUES 
    ("Sales"),
    ("Legal"),
    ("Human Resources"),
    ("Development");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Salesperson", 68000, 1),
    ("Lawyer", 125000, 2),
    ("Junior Lawyer", 100000, 2),
    ("HR Agent", 85000, 3),
    ("Software Engineer", 130000, 4),
    ("Junior Software Engineer", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Robert", "Frost", 2, null),
    ("Charles", "Dickens", 5, null),
    ("Edgar Allen", "Poe", 3, 1),
    ("Sarah J", "Maas", 6, 2),
    ("Nathaniel", "Hawthorne", 1, null),
    ("Steven", "King", 1, 5),
    ("Terry", "Pratchett", 4, null),
    ("Dan", "Brown", 4, 7);