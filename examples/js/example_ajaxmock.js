$(function(){
    $.mockjax(function(settings) {
        var service = settings.url.match(/\/ajaxtest\/(.*)$/);
        if ( service ) {
            if (service[1] == 'get') {
                return {
                    url: '/ajaxtest/get',
                    contentType: 'text/json',
                    response: function(sent) {
                        var data = sent.data;
                        if (data.id == 'user123') {
                            this.responseText = {
                                assignedTags: [ 'Administration', 'Human Resources'] ,
                                availableTags: [ 'Marketing Group', 'Sales Team', 'Administration', 'Management', 'Human Resources', 'IT Department' ]
                            };
                        } else if (data.id == 'user234') {
                            this.responseText = {
                                assignedTags: [ 'Management', 'IT Department', 'Administration' ] ,
                                availableTags: [ 'Marketing Group', 'Sales Team', 'Administration', 'Management', 'Human Resources', 'IT Department' ]
                            };
                        }
                    }
                }
            } else if (service[1] == 'update') {
                return {
                    url: '/ajaxtest/update',
                    contentType: 'text/json',
                    response: function(sent) {
                        var data = sent.data;
                        if (data.id == 'user123' || data.id == 'user234') {
                            this.responseText = { status: "ok" };
                        } else {
                            this.responseText = { status: "not found" };
                        }
                    }
                }
            } else if (service[1] == 'search') {
                return {
                    url: '/ajaxtest/search',
                    contentType: 'text/json',
                    response: function(sent) {
                        var data = sent.data;
                        var drinkTags = [
                            "Alabama Slammer",
                            "Anejo Highball",
                            "Appletini",
                            "Bay Breeze",
                            "Bellini",
                            "Black & Tan",
                            "Bloody Mary",
                            "Bocce Ball",
                            "Bourbon & Water",
                            "Brown Cow",
                            "Campari & Soda",
                            "Cape Codder",
                            "Cherry Hooker",
                            "Creamsicle",
                            "Cuba Libre",
                            "Dark & Stormy",
                            "Freddie Fuddpucker (Cactus Banger)",
                            "Fuzzy Navel",
                            "Gin & Tonic",
                            "Gin Buck",
                            "Gin Rickey",
                            "Greyhound",
                            "Hairy Navel",
                            "Harvey Wallbanger",
                            "Highball",
                            "Hollywood",
                            "Horny Bull",
                            "Madras",
                            "Manhattan",
                            "Martini",
                            "Melon Ball",
                            "Moscow Mule",
                            "Orange Blossom",
                            "Rum & Coke",
                            "Salty Dog",
                            "Sea Breeze",
                            "Scarlet O'Hara",
                            "Scotch & Soda",
                            "Screwdriver",
                            "Seven & Seven",
                            "Sloe Screw",
                            "Smith & Kearns",
                            "Smith & Wesson",
                            "Tequila Sunrise",
                            "Vodka Red Bull",
                            "Vodka Tonic"
                        ];
                        var foundTags = [];
                        for (var i = 0; i < drinkTags.length; i++) {
                            var pattern = new RegExp(data.q, "gi");
                            if ( pattern.test(drinkTags[i]) ) {
                                foundTags.push(drinkTags[i]);
                            }
                        }
                        this.responseText = {
                            availableTags: foundTags
                        };
                    }
                }
            }
        }
        return;
    });
});