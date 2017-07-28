'use strict';

/* Initialize electron API */
var electron = require('electron');
/* Initialize electron application */
var { app } = electron;
/* Initialize the Browser window Form */
var { BrowserWindow } = electron;

/* Form Rady */
app.on('ready', function() {
    /* Get device screen resolution */
    var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    var win = new BrowserWindow({
        width,
        height,
        icon: __dirname + "/img/icon.png"
    });

    /*  Initialize main view */
    win.loadURL('file://' + __dirname + '/index.html');

    /* Load web console 
        Uncomment Line to open devtools on start
    */
    /* win.webContents.openDevTools();*/

});