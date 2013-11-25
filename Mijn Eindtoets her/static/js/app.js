    /* Technische breakdown 
        - FRISBEE
                - startApp
                        - init()
                                - router.init()
                                - gestures.init()
                                - game.init()
                - router
                        - init ()
                                - game: game_id
                                - schedule
                                - Ranking
                                - *
                - gestures
                        - init()
                - game
                        - init()
                                - FetchAll()
                                - Post(url,uploadScore)
                                        - page.schedule()
                - directives
                        - schedule
                - page
                        - game: game_id
                        - schedule
                        - Ranking
                                - Get(url)
                                - render
                - Loader
    */

// Global namespace
var FRISBEE = FRISBEE || {};

// Self-invoking anonymous function
(function () {
    // Returns HTML class element named bubblingG, which contains the loader
    var loader = document.getElementsByClassName('bubblingG')[0];

    // Start, render application when DOM is ready // Execute init method's inside 'router', 'gestures' and 'game'
    FRISBEE.startApp = {
        init: function(){
            FRISBEE.router.init();
            FRISBEE.gestures.init();
            FRISBEE.game.init();
        }
    };

    // Router
    FRISBEE.router = {
        init: function () {
            console.log("router.init ", FRISBEE.router);
            // Routie is a JavaScript hash routing library
            routie({
                '/game/:game_id': function(game_id) {
                    FRISBEE.page.game(game_id);
                },
            
                '/schedule': function() {
                    FRISBEE.page.schedule();
                },

                '/Ranking': function() {
                    FRISBEE.page.Ranking();
                },

                '*': function() {
                    FRISBEE.page.schedule();
                } 

            });
        },

        change: function (router) {
        // Qwery is a Javascript engine to select DOM elements
            var route = router,
                sections = qwery('section[data-route]'),
                section = qwery('[data-route=' + route + ']')[0];  

            // Show active section, hide all other (for loop)
            if (section) {
                for (var i=0; i < sections.length; i++){
                    sections[i].classList.remove('active');
                }
                $$('[data-route='+router+']')[0].classList.add('active');
            }

            // Default route (no route, go default state)
            if (!route) {
                sections[0].classList.add('active');
            }
        }
    };

    // Swipe method performed by Quo
    FRISBEE.gestures = {
        init: function(){
            $$('section.swipeLeft').swipeLeft(function() {
                window.location.href = "#/ranking"; 
            });

            $$('section.swipeRight').swipeRight(function() {
                window.location.href = "#/schedule"; 
            });
        }
    }

    // Game object (get and post score)
    FRISBEE.game = {
        init: function () {
                
            // Post finalScore
            document.getElementById('finalScore').onclick = function () {
                var type =  'POST',
                url  =  'https://api.leaguevine.com/v1/game_scores/',
                    // Convert value to JSON
                    uploadScore = JSON.stringify({
                        game_id: FRISBEE.page.game.scoreData.id,
                        team_1_score: FRISBEE.game.getScore1(),
                        team_2_score: FRISBEE.game.getScore2(),
                        is_final: 'True'
                    });

            // Create request Xml Http Request
            var xhr = new XMLHttpRequest();

            // Open request, asynchronous (synchronous blocks the execution of code)
            xhr.open(type,url,true);

            // Set request headers, adds HTTP headers to the request (header, value)
            xhr.setRequestHeader('Content-type','application/json');
            xhr.setRequestHeader('Authorization','bearer 82996312dc');

            // Send request (with data as a json string)
            xhr.send(uploadScore);
            
            // onreadystatechange stores a function to be called automatically each time the readyState property changes
            // readyState holds the status of XMLHttpRequest
            // Check for response: 4 = request finished and response is ready
            // 200 = OK, in case of Leaguevine's API it is 201
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    FRISBEE.page.schedule();
                }
            };
        }
        
            // Math function, parseInt parses a string argument and returns an integer of the specified radix or base
            score1 = parseInt(document.getElementById('addScore1').innerHTML);
            score2 = parseInt(document.getElementById('addScore2').innerHTML);

            // onclick: Event occurs when user clicks on an element
            document.getElementById('plus1').onclick = function () {
                score1++;
                document.getElementById('addScore1').innerHTML = score1;
                console.log(score1);
            };

            document.getElementById('min1').onclick = function () {
                score1--;
                document.getElementById('addScore1').innerHTML = score1;
                console.log(score1);
            };
    
            document.getElementById('plus2').onclick = function () {
                score2++;
                document.getElementById('addScore2').innerHTML = score2;
                console.log(score2);
            };

            document.getElementById('min2').onclick = function () {
                score2--;
                document.getElementById('addScore2').innerHTML = score2;
                console.log(score2);
            };
        },

        getScore1: function() {
            return score1;
        },

        getScore2: function() {
            return score2; 
        },
    
        reset: function () {
            score1 = FRISBEE.page.game.scoreData.team_1_score;
            score2 = FRISBEE.page.game.scoreData.team_2_score;
            document.getElementById('addScore1').innerHTML = score1;
            document.getElementById('addScore2').innerHTML = score2;
        }
    }

    // Two-dimensional object literal, performed by Transparency while rendering the template
    // Als track_score in de code wordt aangeroepen - return gamepagina + game_id
    FRISBEE.directives = {
        schedule: {
            objects: {
                track_score: {
                    href: function() {
                        return '#/game/' + this.id;
                    }
                }
            }
        }
    }

    // Pages
    FRISBEE.page = {
    
        game: function (game_id) {
            //Show the loader
            loader.style.display = 'block';
            $$.get('https://api.leaguevine.com/v1/games/'+game_id+'/?access_token=ab86750dfd',{}, function(data){
                
                // Create object scoreData, store results AJAX call here 
                FRISBEE.page.game.scoreData = data;
                
                // Bind object scoreData with div 'data-route=game'
                Transparency.render(qwery('[data-route=game]')[0], FRISBEE.page.game.scoreData);
                
                FRISBEE.game.reset();
                console.log(FRISBEE.page.game.scoreData);
                
                //Hide the loader
                loader.style.display = 'none';
                FRISBEE.router.change('game');
                });
        },

        schedule: function () {
            //Show the loader
            loader.style.display = 'block';
            $$.get('https://api.leaguevine.com/v1/games/?pool_id=19219&access_token=1402975c1b',{}, function(data){
                var directives = FRISBEE.directives.schedule;

                // Create object scoreData, store results AJAX call here 
                FRISBEE.page.schedule.poolData = data;

                // Bind object poolData with div 'data-route=schedule'
                Transparency.render(qwery('[data-route=schedule]')[0], FRISBEE.page.schedule.poolData, directives);
                console.log(FRISBEE.page.schedule.poolData);
                
                //Hide the loader
                loader.style.display = 'none';
                FRISBEE.router.change('schedule');
                });
        },

        Ranking: function () {
            //Show the loader
            loader.style.display = 'block';
            $$.get('https://api.leaguevine.com/v1/pools/?tournament_id=19389&name=a&access_token=1402975c1b',{}, function(data){
                Transparency.render(qwery('[data-route=Ranking]')[0], data);
                //Hide the loader
                loader.style.display = 'none';
                FRISBEE.router.change('Ranking');
                });
        }
    }

    // When DOM is ready, initialize - start the application 
    domready(function () {
        FRISBEE.startApp.init();
    });

})();