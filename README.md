Example to save service avahi in table mysql

1) Install mysql

```
sudo apt-get install mysql-server
```
Install nodejs from sources (from https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
```
sudo apt-get install python g++ make checkinstall
mkdir ~/src && cd $_
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd node-v*
./configure
sudo checkinstall -y --install=no --pkgversion 0.10.24  # Replace with current version number.
sudo dpkg -i node_*
```

2) Create Database

```
echo "create database avahiservices;" | mysql -u root -p
```

3) Create User + permissions

```
echo "grant usage on *.* to avahi@localhost identified by 'avahipassword';" | mysql -u root -p
echo "grant all privileges on avahiservices.* to avahi ;" | mysql -u root -p
```

4) Create Table

```
cat << EOF | mysql -u root -p
use avahiservices
create table services (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,	
md5num varchar(32),
type varchar(150),
description varchar(150),
hostname varchar(150),
ip varchar(15),
port varchar(5),
txt text
);
EOF
```

5) Install need modules in node.js

```
npm install
```

6) run app

```
node app.js
```