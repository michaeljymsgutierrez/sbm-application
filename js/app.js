'use strict';

/*  Main application module */
var app = angular.module('bms', ['ui.router', 'ngResource']);
/* Initialize mysql driver */
var mysql = require('mysql');
/* Intialize connection  database connection */
var connection = null;

/* Put all your configuration here */
app.run(function($state) {

    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bms_db'
    });

    /* Intialize database */
    connection.query('CREATE DATABASE IF NOT EXISTS bms_db', function(err, res, fields) {
        if (err) {
            console.error(err);
        } else {
            console.info('Database succesfully created');
        }
    });

});