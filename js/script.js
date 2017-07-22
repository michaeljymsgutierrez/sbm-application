'use strict';

$(document).ready(function() {

    // Assure that the side script has been loaded succesfully
    console.log('Script has been loaded . . .');

    $(window).load(function() {
        // Insert all your misc codes inside this block
        setInterval(function() {

            // Add effects on circle buttons
            $('.btn-circle').on('click', function() {
                $(this).addClass('btn-dash');
                setTimeout(function() {
                    $('.btn-circle').removeClass('btn-dash');
                }, 100);
            });

        }, 500);
    });
});