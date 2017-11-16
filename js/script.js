'use strict';

/*
    Script Cycle Function
    Function for reinitializing assynchronously misc codes
*/
function scriptCycle() {

    /* Include all your jQuery code here */
    jQuery(window).load(function() {

        /* Assure that the side script has been loaded succesfully */
        console.log('Successfully executed script cycle . . .');

        var body = jQuery('body');

        /* Add effects on circle buttons */
        body.on('click', '.btn-circle', function() {
            $(this).addClass('btn-dash');
            setTimeout(function() {
                $('.btn-circle').removeClass('btn-dash');
            }, 100);
        });

        /*  Event listener for adding class on selected on side menu */
        body.on('click', 'a.menu-link', function() {
            $('a.menu-link').removeClass('active-menu');
            $(this).addClass('active-menu');
        });


        /* Attendance Form Button event listener */
        body.on('click', '.attendance-form button', function() {
            $(this).css('background-color', 'black');
            setTimeout(function() {
                $('.attendance-form button').css('background-color', '#444');
            }, 100);
        });


        /* Rotate Sync Effect */
        body.on('click', '.sync-btn', function() {
            var element = $(this);
            element.addClass('rotate');
        });


        /* Add active class for category */
        body.on('click', 'button.category', function() {
            var element = $(this);
            $('button.category').removeClass('active-category');
            element.addClass('active-category');
        });


        /* Remove drag element and select */
        $('*').attr('ondragstart', 'return false');
        $(document.body).attr('onselectstart', 'return false');
        $('input').attr('ondragstart', 'return true');
        $('input').attr('onselectstart', 'return true');

        /*
            Add here all non event listener
        */
        setInterval(function() {

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

            /* Remove rotate class all over DOM element if backdrop is hidden */
            if ($('.custom-backdrop').css('visibility') == 'hidden') {
                $('.sync-btn').removeClass('rotate');
            }

            /* Adjusted loader margin on setup container */
            if ($('div.setup').length != 0) {
                $('.loader').css({ 'margin-left': '47.5vw' });
            }

            /* Turn off click event for modal */
            $('.modal').off('click');

        }, 100);

    });
}

scriptCycle();