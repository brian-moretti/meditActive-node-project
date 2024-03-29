# Node.js Project

Welcome to my Node.js project made for the Master in Back-End Development for Start2Impact University

- [Node.js Project](#nodejs-project)
  - [:computer: The project: MeditActive](#computer-the-project-meditactive)
    - [:spiral\_notepad: Notes](#spiral_notepad-notes)
  - [:gear: Instruction](#gear-instruction)
    - [MYSQL Instructions](#mysql-instructions)
    - [MongoDB Instructions](#mongodb-instructions)
  - [:open\_book: Documentation](#open_book-documentation)
    - [:technologist: Project Structure](#technologist-project-structure)
  - [:bookmark\_tabs: REST API](#bookmark_tabs-rest-api)
    - [:information\_source: Routes and Data](#information_source-routes-and-data)
      - [Read Data | GET Method](#read-data--get-method)
      - [Create Data | POST Method](#create-data--post-method)
      - [Update Data | PUT Method](#update-data--put-method)
      - [Delete Data | DELETE Method](#delete-data--delete-method)
  - [:incoming\_envelope: Contact me](#incoming_envelope-contact-me)

## :computer: The project: MeditActive

The project involves a REST API designed for a startup dedicated to help people to achieve their goals. The API is structured to give the possibility of:

- Create, modify and delete users
- Create. modify and delete interval targets linked to a specif user and a specific goal
- Filter the intervals through params of date-start, date-end and goal-title
- Create, modify and delete goals

### :spiral_notepad: Notes

The project has been created with the possibility to use MySql or MongoDB based on the command line run

![Database Schema](./public/database-schema.png)

## :gear: Instruction

- Copy the repository from my Github: `git clone https://github.com/brian-moretti/meditActive-node-project.git`

### MYSQL Instructions

- Open the file `migrations.sql` and copy the code inside the SQL query to create the database, the tables, the columns and the relations between them
- Check the file `config.js` then create an `.env` file or rename `.env.example` in `.env` with the correct data
- Start the web server (Apache, SQL) such as Laragon or similar
- Install the dependencies with `npm install` _(check `package.json`)_ then open the terminal and digit `npm run dev-mysql` or `nodemon app --mysql` to run the app.
- Now use POSTMAN or similiar to test the API
- _If you want to start with a pre-defined list of goals digit the follow command: `node .\Api\importApi.js`_

### MongoDB Instructions

- Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create an Account for free
- Once the Account is created follow these steps:
  - Create a project (if it's not created)
  - Go to Database and create a database with a **SHARED CLUSTER**.
  - In _*Security Quickstart*_ create a **USERNAME** and a **PASSWORD**, then press _*FINISH AND CLOSE*_ at the bottom
  - Once is done, press **CONNECT**, then **DRIVERS** and check the point number 3. Copy the **CONNECTION STRING** in your code:
    - `mongodb+srv://<username>:<password>@<cluster-code>/?retryWrites=true&w=majority&appName=Cluster0`
- Once everything above is done, check the file `config.js` then create an `.env` file or rename `.env.example` in `.env`, based on the _*connection string*_ above, with the correct data
- Install the dependencies with `npm install` _(check `package.json`)_ then open the terminal and digit `npm run dev-mongo` or `nodemon app --mongo` to run the app.
- Now use POSTMAN or similiar to test the API
- _If you want to start with a pre-defined list of goals digit the follow command: `node .\Api\importApi.js`_

## :open_book: Documentation

Take a look a the docs to understand the routes and the fully API

### :technologist: Project Structure

```.
├── Api/
│   ├── goal.json
│   └── importApi.js
├── App/
│   ├── controllers/
│   │   ├── goalsController.js
│   │   ├── intervalTargetsController.js
│   │   └── userController.js
│   └── models/
│       ├── MongoModels/
│       │   ├── MongoGoalModel.js
│       │   ├── MongoIntervalTargetModel.js
│       │   └── MongoUser.js
│       ├── MySqlModels/
│       │   ├── MySqlGoalModel.js
│       │   ├── MySqlIntervalTargetModel.js
│       │   └── MySqlUserModel.js
│       ├── GoalModel.js
│       ├── IntervalTargetModel.js
│       └── UserModel.js
├── Core/
│   ├── routes/
│   │   ├── goalRoute.js
│   │   ├── intervalTargetRoute.js
│   │   └── userRoute.js
│   ├── utilities/
│   │   ├── chooseModel.js
│   │   ├── paginations.js
│   │   └── useDatabase.js
│   ├── Database.js
│   └── Routes.js
├── .env
├── app.js
├── config.js
└── migrations.sql
```

## :bookmark_tabs: REST API

Base Path: `http://localhost:3000`

### :information_source: Routes and Data

`users`:

```json
{
  "id": 1,
  "name": "John",
  "surname": "Doe",
  "email": "johndoe@test.it"
}
```

`goals`

```json
{
  "id": 1,
  "title": "goal",
  "description": "description"
}
```

`interval-targets`

```json
{
  "goal_id": 1,
  "titl": "goal title",
  "description": "goal description",
  "id": 1,
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD",
  "user_id": 1,
  "name": "username",
  "surname": "surname",
  "email": "email"
}
```

#### Read Data | GET Method

`/users`: Return all the users in the database

JSON Response:

```json
[
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "johndoe@test.it"
  }
]
```

`/users/{id}`: Return the user with ID selected

JSON Response:

```json
{
  "id": 1,
  "name": "John",
  "surname": "Doe",
  "email": "johndoe@test.it"
}
```

`/goals`: Return all the goals in the database

JSON Response:

```json
[
  {
    "id": 1,
    "title": "goal",
    "description": "description"
  }
]
```

`/goals/{id}`: Return the goal with ID selected

JSON Response:

```json
{
  "id": 1,
  "title": "goal",
  "description": "description"
}
```

`/interval-targets`: Return all the interval targets in the database

JSON Response:

```json
[
  {
    "goal_id": 1,
    "title": "goal title",
    "description": "goal description",
    "id": 1,
    "date_start": "YYYY-MM-DD",
    "date_end": "YYYY-MM-DD",
    "user_id": 1,
    "name": "username",
    "surname": "surname",
    "email": "email"
  }
]
```

`/interval-targets/{id}`: Return the interval target with ID selected

JSON Response:

```json
{
  "id": 1,
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD",
  "user_id": 1,
  "name": "username",
  "surname": "surname",
  "email": "email",
  "goal_id": 1,
  "title": "goal title",
  "description": "goal description"
}
```

#### Create Data | POST Method

`/users`: Create a new user in the database. The body is required as follow:

```json
{
  "name": "username",
  "surname": "surname",
  "email": "email"
}
```

`/goals`: Create a new goal in the database. The body is required as follow:

```json
{
  "title": "title_goal",
  "description": "goal_description"
}
```

`/interval-targets`: Create a new interval target in the database. The body is required as follow:

```json
{
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD",
  "user_id": 1,
  "goal_id": 1
}
```

#### Update Data | PUT Method

`/users/{id}`: Update an existing user. One of the property is required

```json
{
  "name": "new-name",
  "surname": "new-surname",
  "email": "new-email"
}
```

`/goals/{id}`: Update an existing goal. One of the property is required

```json
{
  "title": "new-goal",
  "description": "new-description"
}
```

`/interval-targets/{id}`: Update an existing interval target. One of the property is required

```json
{
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD",
  "user_id": 1,
  "goal_id": 1
}
```

#### Delete Data | DELETE Method

`/users/{id}`: Delete an existing user

JSON Response:

```json
"User Deleted": [{
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "johndoe@test.it"
}]
```

`/goals/{id}`: Delete an existing goal

JSON Response:

```json
"Goal deleted": [{
    "id":1,
    "title": "goal title",
    "description": "goal description"
}]
```

`/interval-targets/{id}` : Delete an existing interval target
JSON Response:

```json
"Interval Target deleted": [{
    "id": 1,
    "date_start": "YYYY-MM-DD",
    "date_end": "YYYY-MM-DD",
    "user_id": 1,
    "name": "username",
    "surname": "surname",
    "email": "email",
    "goal_id": 1,
    "title": "goal title",
    "description": "goal description",
}]
```

## :incoming_envelope: Contact me

If you find some bugs to fix or simply you want to send me a message please write me at [**brianmoretti2512@gmail.com**](mailto:brianmoretti2512@gmail.com) or [**LinkedIn | Brian Moretti**](https://www.linkedin.com/in/brian-moretti/)
