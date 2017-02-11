(function() {
		// Initialize the AsyncLoader  
    var asyncLoader = new AsyncLoader();

    $('a.async-link').on('click', function(e){
    	e.preventDefault();

    	// Define the settings
    	var settings = {
          link: $(this),
         	partial: true
      };

      // Call the loader
    	asyncLoader.load(settings); 
    });
}());