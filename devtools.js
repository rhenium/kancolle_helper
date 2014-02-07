var prev_my_ships = {};
var ships = null;
var stypes = null;
(function() {
    var _sm = localStorage["ships"];
    if (_sm) { ships = JSON.parse(_sm); }
    var _ss = localStorage["stypes"];
    if (_ss) { stypes = JSON.parse(_ss); }
})();

chrome.devtools.network.onRequestFinished.addListener(function(request) {
    if (!/kcsapi\/api_get_member\/ship[23]$/.test(request.request.url) &&
        !/kcsapi\/api_get_master\/ship$/.test(request.request.url) &&
        !/kcsapi\/api_get_master\/stype$/.test(request.request.url)) {
        return; // unknown url
    }

    request.getContent(function(content) {
        if (!content) return;

        var json = JSON.parse(content.replace(/^svdata=/, ""));

        if (/kcsapi\/api_get_master\/ship$/.test(request.request.url)) {
            var _ships = {};
            json.api_data.forEach(function(ship) {
                _ships[ship.api_id.toString()] = {
                    "name": ship.api_name,
                    "stype_id": ship.api_stype,
                };
            });
            localStorage["ships"] = JSON.stringify(_ships);
        } else if (/kcsapi\/api_get_master\/stype$/.test(request.request.url)) {
            var _stypes = {};
            json.api_data.forEach(function(stype) {
                _stypes[stype.api_id.toString()] = stype.api_name;
            });
            localStorage["stypes"] = JSON.stringify(_stypes);
        } else {
            if (!ships || !stypes) return;

            if (/kcsapi\/api_get_member\/ship2$/.test(request.request.url)) {
                var my_ships_data = json.api_data;
                var my_decks_data = json.api_data_deck;
            } else if (/kcsapi\/api_get_member\/ship3$/.test(request.request.url)) {
                var my_ships_data = json.api_data.api_ship_data;
                var my_decks_data = json.api_data.api_deck_data;
            } else {
                return; // unknown url: mustn't reach here
            }

            var my_ships = {};
            my_ships_data.forEach(function(ship) {
                var prev = prev_my_ships[ship.api_id.toString()] || {};
                my_ships[ship.api_id.toString()] = {
                    "cond": ship.api_cond,
                    "prev_cond": prev.cond,
                    "lv": ship.api_lv,
                    "next_exp": ship.api_exp[1], // api_exp: [total_exp, for_next, next_level]
                    "hp": [ship.api_nowhp, ship.api_maxhp],
                    "name": ships[ship.api_ship_id.toString()].name,
                    "type": stypes[ships[ship.api_ship_id.toString()].stype_id.toString()],
                };
            });
            prev_my_ships = JSON.stringify(my_ships);

            var data = {
                "decks": my_decks_data.map(function(deck) { return {
                    "name": deck.api_name,
                    "ships": deck.api_ship.map(function(id) { return my_ships[id.toString()]; })
                };})
            };

            chrome.extension.sendRequest(data);
        }
    });
});

