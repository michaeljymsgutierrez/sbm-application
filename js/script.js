'use strict';

jQuery(document).ready(function() {
    // $(document).ready(function() {

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

            // Event listener for adding class on selected on side menu
            $('a.menu-link').on('click', function() {
                $('a.menu-link').removeClass('active-menu');
                $(this).addClass('active-menu');
            });


            // Add effects on button click
            $('.btn-animate').on('click', function() {
                $('.btn-animate').addClass('btn-animate-click');
                setTimeout(function() {
                    $('.btn-animate').removeClass('btn-animate-click')
                }, 300);
            });

        }, 500);
    });
});