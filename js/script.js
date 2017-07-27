'use strict';

/* Initialize electron API */
var remote = require('electron').remote;

/* Include all your jQuery code here */
jQuery(document).ready(function() {
    /* Assure that the side script has been loaded succesfully */
    console.log('Script has been loaded . . .');

    /* Put all your codes here */
    $("body").on('DOMSubtreeModified', ".right-container", function() {

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
        if (remote.getCurrentWindow().isMaximized() == true) {
            remote.getCurrentWindow().maximize();
        }

        /* Initial Backdrop */
        $('.custom-backdrop').hide();
    });
});