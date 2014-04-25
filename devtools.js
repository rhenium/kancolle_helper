var send_data = function() {
    chrome.extension.sendRequest({
        decks: mydata.decks,
    });
};

var send_error = function(e) {
    chrome.extension.sendRequest({
        error: e.toString(),
    });
};

var master = {
    stypes: JSON.parse(localStorage["master.stypes"] || "{}"),
    ships: JSON.parse(localStorage["master.ships"] || "{}"),
    slotitems: JSON.parse(localStorage["master.slotitems"] || "{}"),
};

var mydata = {
    decks: [],
    ships: {},
    slotitems: {},
    update_decks: function(decks) {
        mydata.decks = decks.map(function(deck) {
            return {
                name: deck.api_name,
                ships: deck.api_ship.map(function(id) { return mydata.ships[id]; })
            };
        });
    },
    update_ships: function(ships) {
        if (mydata.ships.length - ships.length <= 1) mydata.ships = {};

        ships.forEach(function(ship) {
            mydata.ships[ship.api_id] = {
                cond: ship.api_cond,
                lv: ship.api_lv,
                next_exp: ship.api_exp[1], // api_exp: [total_exp, for_next, next_level]
                hp: [ship.api_nowhp, ship.api_maxhp],
                slotitems: ship.api_slot.filter(function(id) { return id >= 0; }).map(function(id) {
                    return (mydata.slotitems[id] || { name: "undefined" }).name; }),
                name: master.ships[ship.api_ship_id].name,
                type: master.stypes[master.ships[ship.api_ship_id].stype_id],
            };
        });
    },
    update_slotitems: function(slotitems) {
        mydata.slotitems = {};
        slotitems.forEach(function(slotitem) {
            mydata.slotitems[slotitem.api_id] = {
                name: master.slotitems[slotitem.api_slotitem_id],
                type: null,
            };
        });
    },
};

var fms = [
    {
        match: /kcsapi\/api_start2$/,
        callback: function(json, request) {
            // ships (master)
            master.ships = [];
            json.api_data.api_mst_ship.forEach(function(ship) {
                master.ships[ship.api_id] = {
                    name: ship.api_name,
                    stype_id: ship.api_stype,
                };
            });
            localStorage["master.ships"] = JSON.stringify(master.ships);

            // ship types (master)
            master.stypes = [];
            json.api_data.api_mst_stype.forEach(function(stype) {
                master.stypes[stype.api_id] = stype.api_name;
            });
            localStorage["master.stypes"] = JSON.stringify(master.stypes);

            // slotitems (master)
            master.slotitems = [];
            json.api_data.api_mst_slotitem.forEach(function(slotitem) {
                master.slotitems[slotitem.api_id] = slotitem.api_name;
            });
            localStorage["master.slotitems"] = JSON.stringify(master.slotitems);
        }
    },
    {
        match: /kcsapi\/api_get_member\/slot_item$/,
        callback: function(json, request) {
            mydata.update_slotitems(json.api_data);
        }
    },
    {
        match: /kcsapi\/api_port\/port$/,
        callback: function(json, request) {
            mydata.update_ships(json.api_data.api_ship);
            mydata.update_decks(json.api_data.api_deck_port);

            send_data();
        }
    },
    {
        match: /kcsapi\/api_get_member\/ship2$/,
        callback: function(json, request) {
            mydata.update_ships(json.api_data);
            mydata.update_decks(json.api_data_deck);

            send_data();
        }
    },
    {
        match: /kcsapi\/api_get_member\/ship3$/,
        callback: function(json, request) {
            mydata.update_ships(json.api_data.api_ship_data);
            mydata.update_decks(json.api_data.api_deck_data);

            send_data();
        }
    },
];

chrome.devtools.network.onRequestFinished.addListener(function(request) {
    fms.forEach(function(fm) {
        if (fm.match.test(request.request.url)) {
            request.getContent(function(content) {
                var json = JSON.parse(content.replace(/^svdata=/, ""));
                try {
                    fm.callback(json, request);
                } catch (e) {
                    send_error(e);
                }
            });
        }
    });
});

