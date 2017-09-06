'use strict';

/* Initialize electron API */
var remote = require('electron').remote;

/* 
    Splash Effect on setup
    Seperate from script cycle
*/
$(document).ready(function() {
    if (window.location.hash == '#!/setup') {
        $('body').css({ 'opacity': 0 });
        setTimeout(function() {
            $('body').animate({
                'opacity': 1,
                'transition': '2s ease-in'
            }, 5000);
        }, 1000);
    }
});

setInterval(function() {

    /* Include all your jQuery code here */
    jQuery(document).ready(function() {

        /* Assure that the side script has been loaded succesfully */
        console.log('Script running on background mode . . .');

        /* Add effects on circle buttons */
        $('.btn-circle').on('click', function() {
            $(this).addClass('btn-dash');
            setTimeout(function() {
                $('.btn-circle').removeClass('btn-dash');
            }, 100);
        });

        /*  Event listener for adding class on selected on side menu */
        $('a.menu-link').on('click', function() {
            $('a.menu-link').removeClass('active-menu');
            $(this).addClass('active-menu');
        });

        /*  Event listener for adding class on selected on active tab */
        // $('div.tab').click(function() { });

        /* Attendance Form Button event listener */
        $('.attendance-form button').click(function() {
            $(this).css('background-color', 'black');
            setTimeout(function() {
                $('.attendance-form button').css('background-color', '#444');
            }, 100);
        });

        /* Resize Left and Right Container on inital setup */
        if (window.location.hash == '#!/setup') {
            $('div.left-container').remove();
            $('div.right-container').css('width', '100vw');
        }

        /* Reload browser window temporarily */
        if (JSON.parse(window.localStorage.getItem('reload')) == 'true') {
            window.localStorage.removeItem('reload');
            window.localStorage.setItem('default', 'dashboard');
            location.reload();
        }

        /* Remaximized widow */
        if (remote.getCurrentWindow().isMinimized() == true) {
            remote.getCurrentWindow().maximize();
        }

        /* Turn of click event for modal */
        $('.modal').off('click');

        /* Rotate Sync Effect */
        $('.sync-btn').on('click', function() {
            var element = $(this);
            element.addClass('rotate');
        });

        /* Remove rotate class all over DOM element if backdrop is hidden */
        if ($('.custom-backdrop').css('visibility') == 'hidden') {
            $('.sync-btn').removeClass('rotate');
        }

        /* Adjusted loader margin on setup container */
        if ($('div.setup').length != 0) {
            $('.loader').css({ 'margin-left': '47.5vw' });
        }
    });

}, 1000);