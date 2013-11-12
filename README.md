# Fraternity Point of Sale system
[![Build Status](https://travis-ci.org/v3rm0n/fratpos.png)](https://travis-ci.org/v3rm0n/fratpos)
[![Dependency Status](https://gemnasium.com/v3rm0n/fratpos.png)](https://gemnasium.com/v3rm0n/fratpos)

## Description

Very simple and primitive point of sale system for student fraternities (can be use elsewhere).

## Features
The system has two main views: **PoS** and **admin**.

### Point of Sale
Point of Sale has following features:

* Read the manual
* Choose the client
* Add products to the transaction
* Choose the type of the payment

After choosing the payment type the transaction is complete and the transaction is shown in the **Latest transactions** table.

### Admin
Admin has following features:

* Manage users
* Manage transactions
* Manage payment types
* Manage user statuses
* Manage product quantities
* Stocktaking

#### What does stocktaking mean?
When you press the button ***Stocktaking*** the following happens:

* All the users with nonzero balance
* Al the transaction
* All the products

are saved to a new structure called stocktaking and:

* Balances are reset
* Transactions are removed

Stocktaking can be seen as a ***HTML*** or downloades as a ***CSV*** file.

## PoS setup
To setup the Point of Sale system you will need to install [Node.js](http://nodejs.org/) and [MongoDB](http://www.mongodb.org/).
The configuration of the system is in the  **config.json** file.

### config.json
**config.json** file contains following configuration:

```
{
  //Server configuration
  "server": {
  	//Server port
    "port": 3000
  },
  //Database configuration
  "database": {
    "name": "posdb",
    "host": "localhost",
    "port": 27017,
    "username": "",
    "password": ""
  },
  //Admin user info
  "admin": {
  	//If authenticate is true then the admin interface needs authentication
    "authenticate": true,
    "realm": "admin",
    "username": "admin",
    "password": ""
  },
  //PoS user info
  "posuser": {
    "authenticate": false,
    "realm": "pos",
    "username": "posuser",
    "password": ""
  },
  //Time is seconds during which the client can delete the transaction.
  "timeout": 300
}
```

**NB!** If the PoS system is accessible over the internet you should always turn on authentication!

If the configuration is done, the dependencies can be downloaded using `npm install` and then `npm start` will start the application.
Alternatively use [node-supervisor](https://github.com/isaacs/node-supervisor) plugin `npm install supervisor -g` then run `supervisor app.js` or in Linux background `nohup supervisor app.js &`.


## Technologies
This project contains the following technologies.

### Backend
* Node.js <http://nodejs.org/>
* MongoDB <http://www.mongodb.org/>
* Express <http://expressjs.com/>
* Jade <http://jade-lang.com/>

### Frontend
* Bootstrap <http://twitter.github.io/bootstrap/>
* AngularJS <http://angularjs.org/>
* AngularUI Bootstrap <http://angular-ui.github.io/bootstrap/>
* Intro.js <http://usablica.github.io/intro.js/>
* Flat UI <http://designmodo.github.io/Flat-UI/>
