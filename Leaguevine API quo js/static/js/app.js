// Global namespace
var FRISBEE = FRISBEE || {};

// Self-invoking anonymous function
(function () {
    var loader = document.getElementsByClassName('bubblingG')[0];

// Data objecten
FRISBEE.game = {
    init: function () {
        score1 = parseInt(document.getElementById('addScore1').innerHTML);
        score2 = parseInt(document.getElementById('addScore2').innerHTML);
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

    score: function () {
        score1 = 0;
        score2 = 0;
        document.getElementById('addScore1').innerHTML = score1;
        document.getElementById('addScore2').innerHTML = score2;
        FRISBEE.game.init();
    }
};

// Initialize JS - start application (when DOM is ready)
FRISBEE.startApp = {
    init: function(){
        FRISBEE.gestures.init();

        document.getElementById('finalScore').onclick = function () {
            var type = 'POST',
            url = 'https://api.leaguevine.com/v1/game_scores/',
// Convert value to JSON
postData = JSON.stringify({
    game_id: '127236',
    team_1_score: FRISBEE.game.getScore1(),
    team_2_score: FRISBEE.game.getScore2(),
    is_final: 'True'

});

// Create request - retrieve data from a URL without having to do a full page refresh
var xhr = new XMLHttpRequest();

// Open request
xhr.open(type,url,true);

// Set request headers - header, value
xhr.setRequestHeader('Content-type','application/json');
xhr.setRequestHeader('Authorization','bearer 82996312dc');

// Send request (with data as a json string)
xhr.send(postData);

console.log("verzonden");
};
FRISBEE.router.init();  
}
};

// Router
FRISBEE.router = {
    init: function () {
        console.log("router.init ", FRISBEE.router);
//checked je URL.
routie({
    '/game/:game_id': function(game_id) {
//alert('game id =' + id);
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

change: function (pageName) {
//qwery selector engine, selecteerd elementen uit DOM
var route = pageName,
sections = qwery('section[data-route]'),
section = qwery('[data-route=' + route + ']')[0];  

// Zorgt ervoor dat je de actieve sectie kan zien, de overige niet
if (section) {
    for (var i=0; i < sections.length; i++){
        sections[i].classList.remove('active');
    }
    $$('[data-route='+pageName+']')[0].classList.add('active');
}

// Default route (no route, go default state)
if (!route) {
    sections[0].classList.add('active');
}
}
};

//Directives
FRISBEE.directives = {
    schedule: {
        objects: {
            track_score: {
                href: function() {
                    return '#/game/' + this.game_id;
                }
            }
        }
    }
}

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

// Pages
FRISBEE.page = {
    game: function (game_id) {
//Show the loader
loader.style.display = 'block';
schemaData: $$.json('https://api.leaguevine.com/v1/games/'+game_id+'/?access_token=ab86750dfd',{}, function(data){
    FRISBEE.page.score = data;
    Transparency.render(qwery('[data-route=game/'+game_id)[0], FRISBEE.page.score);
    console.log(FRISBEE.page.score);
//Hide the loader
loader.style.display = 'none';
});

FRISBEE.game.score();
FRISBEE.router.change('game');
},
schedule: function () {
//Show the loader
loader.style.display = 'block';
schemaData: $$.json('https://api.leaguevine.com/v1/game_scores/?tournament_id=19389&access_token=4675792b56',{}, function(data){
    FRISBEE.page.pools = data;
    Transparency.render(qwery('[data-route=schedule]')[0], FRISBEE.page.pools, FRISBEE.directives.schedule);
    console.log(FRISBEE.page.pools);
//Hide the loader
loader.style.display = 'none';
});

FRISBEE.router.change('schedule');
},

Ranking: function () {
//Show the loader
loader.style.display = 'block';
//console.log("FRISBEE.Ranking.pools" + FRISBEE.Ranking.pools);
poolData: $$.json('https://api.leaguevine.com/v1/pools/?tournament_id=19389&access_token=e6c8dbf9f2',{}, function(data){
    Transparency.render(qwery('[data-route=Ranking]')[0], data);
//Hide the loader
loader.style.display = 'none';
});
FRISBEE.router.change('Ranking');
}
}
// When DOM is ready, initialize - start the application 
domready(function () {
    FRISBEE.startApp.init();
});

})();