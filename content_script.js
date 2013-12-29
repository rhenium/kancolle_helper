var addCss = function(url) {
    $("head").append(
        $("<link />")
            .attr("rel", "stylesheet")
            .attr("type", "text/css")
            .attr("href", url)
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
            var table = $("<table />").appendTo($("#deck-" + i).empty());

            deck.ships.forEach(function(ship, i) {
                var hs = ship ? (ship.hp[0] / ship.hp[1]) : -1;
                var cl = hs < 0 ? "none" :
                         hs <= 0.25 ? "large" :
                         hs <= 0.50 ? "medium" : 
                         hs <= 0.75 ? "small" : "zero";
                table.append(
                    $("<tr />").addClass("damage-" + cl)
                        .append($("<td />").addClass("type").text(ship ? ship.type : " "))
                        .append($("<td />").addClass("name").text(ship ? ship.name : " "))
                        .append($("<td />").addClass("lv").text(ship ? ship.lv : " "))
                        .append($("<td />").addClass("hp").text(ship ? ship.hp.join("/") : " "))
                        .append($("<td />").addClass("cond").text(ship ? ship.cond : " "))
                        .append($("<td />").addClass("slots"))
                    );
            });
        });
    });
};

addCss(chrome.extension.getURL("content_script.css"));
addCss(chrome.extension.getURL("jquery.ui.core.css"));
addCss(chrome.extension.getURL("jquery.ui.tabs.css"));
setup();

