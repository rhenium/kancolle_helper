var stypes = JSON.parse(localStorage["stypes"] || null);
var ships = JSON.parse(localStorage["ships"] || null);
var slotitems = JSON.parse(localStorage["slotitems"] || null);

var my_slotitems = {};

var fms = [
    {
        match: /kcsapi\/api_start2$/,
        callback: function(json, request) {
            // ships (master)
            ships = [];
            json.api_data.api_mst_ship.forEach(function(ship) {
                ships[ship.api_id] = {
                    "name": ship.api_name,
                    "stype_id": ship.api_stype,
                };
            });
            localStorage["ships"] = JSON.stringify(ships);

            // ship types (master)
            stypes = [];
            json.api_data.api_mst_stype.forEach(function(stype) {
                stypes[stype.api_id] = stype.api_name;
            });
            localStorage["stypes"] = JSON.stringify(stypes);

            // slotitems (master)
            slotitems = [];
            json.api_data.api_mst_slotitem.forEach(function(slotitem) {
                slotitems[slotitem.api_id] = slotitem.api_name;
            });
            localStorage["slotitems"] = JSON.stringify(slotitems);
        }
    },
    {
        match: /kcsapi\/api_get_member\/slot_item$/,
        callback: function(json, request) {
            my_slotitems = {};
            json.api_data.forEach(function(slotitem) {
                my_slotitems[slotitem.api_id] = slotitems[slotitem.api_slotitem_id];
            });
        }
    },
    {
        match: /kcsapi\/api_port\/port$/,
        callback: function(json, request) {
            if (!stypes || !ships || !slotitems) return;

            var my_ships_data = json.api_data.api_ship;
            var my_deck_data = json.api_data.api_deck_port;

            var my_ships = {};
            my_ships_data.forEach(function(ship) {
                my_ships[ship.api_id] = {
                    "cond": ship.api_cond,
                    "lv": ship.api_lv,
                    "next_exp": ship.api_exp[1], // api_exp: [total_exp, for_next, next_level]
                    "hp": [ship.api_nowhp, ship.api_maxhp],
                    "slotitems": ship.api_slot.map(function(item_id) { return my_slotitems[item_id]; }),
                    "name": ships[ship.api_ship_id].name,
                    "type": stypes[ships[ship.api_ship_id].stype_id],
                };
            });

            var data = {
                "decks": my_deck_data.map(function(deck) { return {
                    "name": deck.api_name,
                    "ships": deck.api_ship.map(function(id) { return my_ships[id]; })
                };})
            };
            
            chrome.extension.sendRequest(data);
        }
    },
    {
        match: /kcsapi\/api_get_member\/ship3$/,
        callback: function(json, request) {
            if (!stypes || !ships || !slotitems) return;

            var my_ships_data = json.api_data.api_ship_data;
            var my_decks_data = json.api_data.api_deck_data;

            var my_ships = {};
            my_ships_data.forEach(function(ship) {
                my_ships[ship.api_id] = {
                    "cond": ship.api_cond,
                    "lv": ship.api_lv,
                    "next_exp": ship.api_exp[1], // api_exp: [total_exp, for_next, next_level]
                    "hp": [ship.api_nowhp, ship.api_maxhp],
                    "slotitems": ship.api_slot.map(function(item_id) { return my_slotitems[item_id]; }),
                    "name": ships[ship.api_ship_id].name,
                    "type": stypes[ships[ship.api_ship_id].stype_id],
                };
            });

            var data = {
                "decks": my_decks_data.map(function(deck) { return {
                    "name": deck.api_name,
                    "ships": deck.api_ship.map(function(id) { return my_ships[id]; })
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

