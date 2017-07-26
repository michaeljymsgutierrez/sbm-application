'use strict';

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

        /* Add effects on button click */
        $('.btn-animate').on('click', function() {
            $('.btn-animate').addClass('btn-animate-click');
            setTimeout(function() {
                $('.btn-animate').removeClass('btn-animate-click')
            }, 600);
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

        /* Initial Backdrop */
        $('.custom-backdrop').hide();
    });
});