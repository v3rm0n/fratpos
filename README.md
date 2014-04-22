# Fraternity Point of Sale system
[![Build Status](https://travis-ci.org/v3rm0n/fratpos.png)](https://travis-ci.org/v3rm0n/fratpos)

## Description

Very simple and primitive point of sale system for student fraternities (can be use elsewhere).

## Features
The system has two main views: **PoS** and **admin**.

### Point of Sale
Point of Sale has following features:

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
TODO

## Technologies
This project contains the following technologies.

### Backend
TODO

### Frontend
* Bootstrap <http://twitter.github.io/bootstrap/>
* AngularJS <http://angularjs.org/>
