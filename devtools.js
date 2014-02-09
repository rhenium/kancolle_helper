var stypes = JSON.parse(localStorage["stypes"] || null);
var ships = JSON.parse(localStorage["ships"] || null);
var slotitems = JSON.parse(localStorage["slotitems"] || null);

var fms = [
    {
        match: /kcsapi\/api_get_master\/ship$/,
        callback: function(json, request) {
            ships = {};
            json.api_data.forEach(function(ship) {
                ships[ship.api_id.toString()] = {
                    "name": ship.api_name,
                    "stype_id": ship.api_stype,
                };
            });
            localStorage["ships"] = JSON.stringify(ships);
        }
    },
    {
        match: /kcsapi\/api_get_master\/stype$/,
        callback: function(json, request) {
            stypes = {};
            json.api_data.forEach(function(stype) {
                stypes[stype.api_id.toString()] = stype.api_name;
            });
            localStorage["stypes"] = JSON.stringify(stypes);
        }
    },
    {
        match: /kcsapi\/api_get_member\/slotitem$/,
        callback: function(json, request) {
            slotitems = {};
            json.api_data.forEach(function(slotitem) {
                slotitems[slotitem.api_id.toString()] = slotitem.api_name;
            });
            localStorage["slotitems"] = JSON.stringify(slotitems);
        }
    },
    {
        match: /kcsapi\/api_get_member\/ship[23]$/,
        callback: function(json, request) {
            if (!stypes || !ships || !slotitems) return;

            if (json.api_data_deck) {
                // ship2
                var my_ships_data = json.api_data;
                var my_decks_data = json.api_data_deck;
            } else {
                // ship3
                var my_ships_data = json.api_data.api_ship_data;
                var my_decks_data = json.api_data.api_deck_data;
            }

            var my_ships = {};
            my_ships_data.forEach(function(ship) {
                my_ships[ship.api_id.toString()] = {
                    "cond": ship.api_cond,
                    "lv": ship.api_lv,
                    "next_exp": ship.api_exp[1], // api_exp: [total_exp, for_next, next_level]
                    "hp": [ship.api_nowhp, ship.api_maxhp],
                    "slotitems": ship.api_slot.map(function(item_id) { return slotitems[item_id.toString()]; }),
                    "name": ships[ship.api_ship_id.toString()].name,
                    "type": stypes[ships[ship.api_ship_id.toString()].stype_id.toString()],
                };
            });

            var data = {
                "decks": my_decks_data.map(function(deck) { return {
                    "name": deck.api_name,
                    "ships": deck.api_ship.map(function(id) { return my_ships[id.toString()]; })
                };})
            };

            chrome.extension.sendRequest(data);
        }
    },
];

chrome.devtools.network.onRequestFinished.addListener(function(request) {
    fms.forEach(function(fm) {
        if (fm.match.test(request.request.url)) {
            request.getContent(function(content) {
                var json = JSON.parse(content.replace(/^svdata=/, ""));
                fm.callback(json, request);
            });
        }
    });
});

