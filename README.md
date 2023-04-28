# week09-m46-rest-api

Program Sequence for the Images

Register
========

register-1.jpg         database empty
register-2.jpg         execute 'users/register' to add a new user, shows success message
register-3.jpg         database show one record entered  (note  that email address is 'idris@elb.com'

Update
======

update-1.jpg          execute 'users/update' to change email address on 'Idris Elba' entry to 'idris@elba.com'
update-2.jpg          database entry shows change of email address

Delete
=======

delete-1.jpg          execute 'users/delete' to delete user 'Idris Elba' from the table users
delete-2.jpg          database shows that user 'Idris Elba' has been deleted (table is empty)

Get All Users
=============

all-users-1.jpg       execute of 'users/login' for user to get authorisation token
all-users-2.jpg       using token in Authorization header to execute 'users/all' to get all users  


