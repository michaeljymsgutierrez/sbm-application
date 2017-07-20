'use strict';

// Initialize electron application
var electron = require('electron');
// Initialize the main electron application 
var { app } = electron;
// Initialize the Browser window Form
var { BrowserWindow } = electron;

// Platform ready
app.on('ready', function(){
	// Initialize browser window
	var win  = new BrowserWindow({
		width: 800,
		height: 600,
		icon: __dirname + "/img/icon.png"
	});

	// Initialize main view
	win.loadURL('file://' + __dirname + '/index.html');

	// Load web console
	// win.webContents.openDevTools();

});

