'use strict';

// Initialize electron application
var electron = require('electron');
// Initialize the main electron application 
var { app } = electron;
// Initialize the Browser window Form
var { BrowserWindow } = electron;

// Platform ready
app.on('ready', function(){
	// Initialize browser window and set screen size to full screen
	var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  	var win = new BrowserWindow({ 
  		width, 
  		height,
  		icon: __dirname + "/img/icon.png" 
  	});

	// Initialize main view
	win.loadURL('file://' + __dirname + '/index.html');

	// Load web console
	// win.webContents.openDevTools();

});

