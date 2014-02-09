var addCss = function(url) {
    $("head").append(
        $("<link />").attr("rel", "stylesheet").attr("type", "text/css").attr("href", url)
    );
};

var setup = function() {
    if (!$("#area-game")) {
        setTimeout(function() { setup(); }, 1000);
        return;
    }

    var container = $("<div />").attr("id", "kch").appendTo($("#area-game"));

    var ul = $("<ul />").appendTo(container);
    for (var i = 0; i < 4; i++) {
        ul.append(
            $("<li />").append(
                $("<a />").attr("href", "#deck-" + i).attr("id", "deck-tab-" + i)));
        container.append(
            $("<div />").attr("id", "deck-" + i).addClass("kch_deck"));
    }

    $("#kch").tabs();

    chrome.runtime.onMessage.addListener(function(data) {
        console.log(data);
        data.decks.forEach(function(deck, i) {
            $("#deck-tab-" + i).text(deck.name);
            var table = $("<ul />").appendTo($("#deck-" + i).empty());

            deck.ships.forEach(function(ship, i) {
                if (ship) {
                    var hs = ship.hp[0] / ship.hp[1];
                    var cl = hs <= 0.25 ? "large" :
                             hs <= 0.50 ? "medium" : 
                             hs <= 0.75 ? "small" : "zero";
                    table.append(
                        $("<li />").addClass("damage-" + cl)
                            .append($("<div />").addClass("lv").text(ship.lv).attr("title", ship.next_exp))
                            .append($("<div />").addClass("name").text(ship.name).attr("data-ship-type", ship.type))
                            .append($("<div />").addClass("hp").text(ship.hp[0]).attr("data-max-hp", ship.hp[1]))
                            .append($("<div />").addClass("cond").text(ship.cond))
                            .append($("<div />").addClass("slots")
                                .append($("<div />").addClass("slotitem").text(ship.slotitems[0] || "").attr("title", ship.slotitems[0] || ""))
                                .append($("<div />").addClass("slotitem").text(ship.slotitems[1] || "").attr("title", ship.slotitems[1] || ""))
                                .append($("<div />").addClass("slotitem").text(ship.slotitems[2] || "").attr("title", ship.slotitems[2] || ""))
                                .append($("<div />").addClass("slotitem").text(ship.slotitems[3] || "").attr("title", ship.slotitems[3] || ""))
                                // .append($("<div />").addClass("slotitem").text(ship.slotitems[4] || "").attr("title", ship.slotitems[4] || ""))
                            )
                        );
                } else {
                    table.append($("<li />").addClass("damage-zero"));
                }
            });
        });
    });
};

addCss(chrome.extension.getURL("content_script.css"));
addCss(chrome.extension.getURL("jquery.ui.core.css"));
addCss(chrome.extension.getURL("jquery.ui.tabs.css"));
setup();

