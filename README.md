# Fraternity Point of Sale system
[![Build Status](https://travis-ci.org/v3rm0n/fratpos.png)](https://travis-ci.org/v3rm0n/fratpos)
[![Stories in Ready](https://badge.waffle.io/v3rm0n/fratpos.png?label=ready&title=Ready)](https://waffle.io/v3rm0n/fratpos)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fv3rm0n%2Ffratpos.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fv3rm0n%2Ffratpos?ref=badge_shield)

## Description

Very simple and primitive point of sale system designed for student fraternities.

## Features
The system has two main views: **PoS** and **Admin**.

### Point of Sale
Point of Sale has following features:

* Choose the client
* Add products to the shopping cart
* Choose the type of the payment
* Leave feedback

After choosing the payment type the transaction is complete and the transaction is shown in the **Latest transactions** table.

### Admin
Admin has following features:

* Manage users
* Manage transactions
* Manage payment types
* Manage user statuses
* Manage product quantities
* Stocktaking
* Manage feedback

#### What does stocktaking mean?
When you press the button ***Stocktaking*** the following happens:

* All the users with nonzero balance
* Al the transaction
* All the products

are saved to a new structure called stocktaking and:

* Balances are reset
* Transactions are removed

Stocktaking can be seen as a ***HTML*** or downloaded as a ***CSV*** file.

## Technologies
This project contains the following technologies.

### Backend
* Spring Boot <http://projects.spring.io/spring-boot/>
* Jade <http://jade-lang.com/>

### Frontend
* Bootstrap <http://twitter.github.io/bootstrap/>
* AngularJS <http://angularjs.org/>


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fv3rm0n%2Ffratpos.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fv3rm0n%2Ffratpos?ref=badge_large)