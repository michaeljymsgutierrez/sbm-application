'use strict';

// Load all jquery js codes 
$(document).ready(function(){
	
	setInterval(function(){
		// Add effects on circle buttons
	  	$('.btn-circle').on('click',function(){
	  		$(this).addClass('btn-dash');
	  		setTimeout(function(){
	  			$('.btn-circle').removeClass('btn-dash');
	  		},100);
	  	});
	  	
	},500);

	// Assure that the side script has been loaded succesfully
	console.log('Script has been loaded . . .');
});

