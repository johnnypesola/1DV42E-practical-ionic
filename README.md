[![Build Status](https://travis-ci.org/johnnypesola/1DV42E-practical-ionic.svg?branch=master)](https://travis-ci.org/johnnypesola/1DV42E-practical-ionic)

# 1DV42E-practical-ionic

### Latest working demo

http://johnnypesola.github.io/1DV42E-practical-ionic
   
Accounts to test with:   
   
**Administrator**   
Username: administrator   
Password: superpassword
   
**User**   
Username: user   
Password: password

### What is this?

This is a booking system app for the course 1DV42E at the Linnaeus University. This app is being developed for a customer whom has set the terms for the used technology.
   
In booking system users will be able to book resources, locations with different furnishing, food/meals for customers or them selves.
   
The goal is to create an Android app with a user interface that also should work well in all major browsers on desktop computers.
   
### Tech used

#### Frontend
At the time beeing we are using the [Ionic 1](http://ionic.io/) framework with Angular 1.X. We are coding in ES2015 with [babel](https://babeljs.io/) in some extent. As Ionic 2 gets more stable we will be looking into converting this project into it. We use a set of [ESLINT](http://eslint.org/) rules to keep the code nice and fresh.

#### Backend
The backend is built using [ASP.NET webapi 2](http://www.asp.net/web-api) with ADO.NET. All data is stored in a MS SQL database. Manipulation to the data is done through a set of MS SQL stored procedures.
   
Check out the [backend branch with authentication](https://github.com/johnnypesola/1DV42E-practical-ionic/tree/backend-auth-new)

#### Authentication
##### ASP.NET Identity 2 (Storing user credentials)
The backend implements Identity 2 with custom storage providers for storing user credentials. ADO.NET is implemented instead of the standard Entity Framework that comes with it as standard. More info about the solution [here](http://www.asp.net/identity/overview/extensibility/overview-of-custom-storage-providers-for-aspnet-identity)

##### Web API 2, Owin bearer tokens
The backend also implements bear tokens with the use of Owin middleware. When the frontend app sucessfully authenticates login credentials to the backend through a POST to Web API 2, it will recieve a session token from the backend. This token is then used by the frontend app until the session expires or the user chooses to log out trough the GUI.

More technical info can be found  [here](http://www.asp.net/web-api/overview/security/individual-accounts-in-web-api)

