# webspeedtesting
Web application for website auditing using Lighthouse API. Built on MERN stack.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
What things you need installed on your machine to run the application locally.
* Node.JS (https://nodejs.org/en/)

### Installing
A step by step series of instructions that tell you how to get a development environment running.

1. Download the repository.

2. Unpack the zip file.

3. Open Terminal and locate to the project folder.

```
$ cd path/to/folder/webspeedtesting-master
```

4. Install the dependencies.

```
$ npm i
```

5. Locate to the client folder and install the dependencies.

```
$ cd client && npm i
```

6. Locate to the project folder and run the server.

```
$ cd .. && npm start
```

## Built with

* [React](https://reactjs.org/) - The JavaScript framework used
* [Express](https://expressjs.com/) - The Node server framework used
* [MongoDB](https://www.mongodb.com/) - The database used
* [Mongoose](https://mongoosejs.com/) - The object modelling library used for MongoDB
* [Lighthouse API](https://developers.google.com/web/tools/lighthouse/) - The auditing API used

## Author
- **Steven Siht** - [Github](https://github.com/cthrustev)

## Deployment
This project is hosted on [Heroku](https://webspeedtesting.herokuapp.com/) but due to the request timeout limit of Heroku, auditing large pages will throw an error (H12). This will be fixed in future updates where the auditing request will be done by background jobs.
