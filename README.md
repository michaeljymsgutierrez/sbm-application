# BMS - Desktop Edition
------
###### 1. Development Requirements
- NodeJS 
- Bower
- NVM - Node Version Manager
###### 2. Run Set Up
- cd in to directory and  run this command in terminal to install 
  dependencies / devDependecies  
- ``` npm install ```
- ``` npm install -g electron ```
- ``` npm install -g electron-prebuilt ```
#####  Inlcuded commands on script
###### Note: This commands are all custom by me on `package.json` and `gulpfile.js`
- ``` npm start ``` - start the application on  dev-mode
- ``` gulp watch``` - minify and compile SASS on watch mode
- ``` gulp sass```  - minify and compile SASS for prod
- ``` npm run build-linux ``` - build linux executable
- ``` npm run build-macOs ``` - build macOs executable
- ``` npm run build-windows ``` - build windows executable
###### I do not included yet the installer build script because of high resource usage 
###### Note: Relase build can all done on any platfom which generate the executable file for corresponding OS wether it is mac , linux, windows

