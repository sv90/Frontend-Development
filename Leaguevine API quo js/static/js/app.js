// Global namespace :)
var FRISBEE = FRISBEE || {};

// Self-invoking anonymous function
(function () {

	// Initialize JS - start application (when DOM is ready, line 127)
	FRISBEE.startApp = {
		init: function () {
			FRISBEE.router.init();
			var type =  'POST',
                        url  =  'https://api.leaguevine.com/v1/game_scores/',
                        postData  = JSON.stringify({
                        	game_id: '127236',
                                team_1_score: '2',
                                team_2_score: '4',
                                is_final: 'False'
                        });

                        // Create request
                        var xhr = new XMLHttpRequest();
                        
                        // Open request
                        xhr.open(type,url,true);

                        // Set request headers
                        xhr.setRequestHeader('Content-type','application/json');
                        xhr.setRequestHeader('Authorization','bearer 82996312dc');
                        
                        // Send request (with data as a json string)
                        xhr.send(postData);
		}
	};

	FRISBEE.game = {

	};

	// Router
	FRISBEE.router = {
		init: function () {
	  		routie({
			    '/schedule': function() {
			    	FRISBEE.page.schedule();
				},
			    '/game': function() {
			    	FRISBEE.page.game();
			    },
			    '/ranking': function() {
			    	FRISBEE.page.ranking();
			    },
			    '*': function() {
			    	FRISBEE.page.schedule();
			    }
			});
		},

		// Change method
		change: function () {
            var route = window.location.hash.slice(2),
                sections = qwery('section[data-route]'),
                section = qwery('[data-route=' + route + ']')[0];  

            // Show active section, hide all other (for loop)
            if (section) {
            	for (var i=0; i < sections.length; i++){
            		sections[i].classList.remove('active');
            	}
            	section.classList.add('active');
            }

            // Default route (no route, go default state)
            if (!route) {
            	sections[0].classList.add('active');
            }

		}
	};

	// Pages
	FRISBEE.page = {
		schedule: function () {
			poolData: $$.json('https://api.leaguevine.com/v1/game_scores/?tournament_id=19389&access_token=b1b5266e90',{}, function(data){
			Transparency.render(qwery('[data-route=schedule')[0], data);
		})
			FRISBEE.router.change();
		},

		game: function () {
			Transparency.render(qwery('[data-route=game')[0], FRISBEE.game);
			FRISBEE.router.change();
		},

		ranking: function () {
			poolData: $$.json('https://api.leaguevine.com/v1/pools/?tournament_id=19389&access_token=46ac8f7bed',{}, function(data){
			Transparency.render(qwery('[data-route=ranking')[0], data);
		})
			FRISBEE.router.change();
		}


	}
	// When DOM is ready, initialize - start the application (line 7)
	domready(function () {
		FRISBEE.startApp.init();
	});

	
})();
