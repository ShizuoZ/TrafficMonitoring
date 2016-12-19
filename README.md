# TrafficMonitoring

A website to retrieve historic traffic pattern over certain areas, provide statistics about traffic severity levels and offering detour suggestion to user choosen driving route based on A* algorithm using historic traffic pattern as heuristic.


## Before Starting
This application is implemented in MongoDB, Node.js, Express and AngularJS. For running this project, we recommend using macOS or Linux which can take advantage of powerful tools like: homebrew.


## Installation
To keep the project running in a good organized manner, there's some suggestion for tools to pick up:
- [brew](http://brew.sh): package manager application for maxOS.
- [npm](https://www.npmjs.com/): node package manager.
- [mongodb](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/): MongoDB database.


## Quick Setup
* Use brew to install [npm](https://docs.npmjs.com/getting-started/installing-node):
``` 
brew install npm
````

* Installing [MongoDB](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/):
```
brew install mongodb
````

* Go to project directory, installing dependencies via npm: 
```
npm install
````


## Begin Traffic Monitoring 

Please type all commands at root directory of project files.

- Clone project file
```
mkdir demo
cd demo
git init
git clone https://github.com/ShizuoZ/TrafficMonitoring.git
````

- Import example data, make sure go to parent folder of dump folder before typing commends
```
mongorestore
````

- Start mongodb
```
mongod
````

- Start Server
```
npm start
````

- Open a browser window, type url: "localhost:3000" and the application will show up.


## Data Collection
Go to the directory of "scripts", type:
```
node getTraffic.js
````

To run two data collector simultenously, open another tab window, go to the directory of "scripts"
```
node getWeather.js
````

**Tips:** Traffic scripts refresh every 2 minutes and weather scripts collect data in the second half of every hour, if it start before x:30, it will pause for 30 minutes.

The dump folder contains example traffic and weather dataset over one month in New Jersey.


## Dependencies
Please check Package.json. It list all node package dependencies and usually more up to date than this readme file!
Here provide a list of current major dependencies: 
- [angular](https://github.com/angular/angular.js)
- [chart.js](https://github.com/jtblin/angular-chart.js)
- [angular-google-map](https://github.com/angular-ui/angular-google-maps)
- [mongoose](https://github.com/Automattic/mongoose)
- [express](http://expressjs.com/)


## Application Structure and Organization
This project follows a typical structure for Angular Application ([Example](https://scotch.io/tutorials/node-and-angular-to-do-app-application-organization-and-structure)), here's the skeleton for reference:
```
- app               // holds all our files for node components (routes, models)
    -- models       // all mongodb schema
    -- route.js     // router for REST services   
- server.js         // node configuration & main entry for this application
- public            // holds all our files for frontend angular applications
    -- images
    -- index.html   // base template for rendering
    -- javascripts  // holds main angular application and controllers
    -- partials     // html templates
    -- stylesheets  // css files
- scripts           // scripts to collect traffic data periodically
- bin               // system configuration
- data              // database configuration               
- node_modules      // node packages installed by npm
- dump              // example data dump for demo
- package.json      // npm configuration to install dependencies/modules
- README.md
````

## Sample testing
- To test REST API, [POSTMAN](https://www.getpostman.com/) is recommended

    1. To execute a HTTP get request, simply choose a get method on left of url blank and click "send" button.

    2. For HTTP POST, type the exact json object in body, like: 
    ```
    {
        "ori": "New Brunswick",
        "des": "Edison",
        "Time": 1
    }
    ````
    A full list of history object will be returned after POST finished.

- To do integration testing, please go to homepage and just browse as other website!

- To check the correctness of database objects, please use visualization tools like [robomongo](https://robomongo.org/)

