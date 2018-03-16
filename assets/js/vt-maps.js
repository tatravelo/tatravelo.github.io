/*
 * TV Mpas
 *
 * Copyright 2017, Szymon Mentel
 */

const TATRAS_COORDINATES = [19.95, 49.25];
const KML_SOURCE = 'assets/kml/routes.kml';
const DAY_TO_COLOR = new Map([
    ['1', 'yellow'],
    ['2', 'green'],
    ['3', 'red'],
    ['4', 'purple'],
    ['5', 'orange'],
    // C is the first letter of "Cycling Route..."
    ['C', 'azure']
]);

var name_to_link = new Map([
    ['1/5: Zakopane - Bešeňová',
     "/route#day-15-tatravelo-goulash"],
    ['2/5: Bešeňová - Štrbské Pleso',
     "/route#day-25-the-sunny-side"],
    ['3/5: Štrbské Pleso - Tatranská Lomnica',
     "/route#day-35-the-land-of-7-cultures"],
    ['4/5: Tatranská Lomnica - Sromowce Niżne',
     "/route#day-45-through-the-depths-of-the-valleys"],
    ['5/5: Sromowce Niżne - Zakopane',
     "/route#day-55-back-and-up-to-zakopane"],
    ['Cycling Route Around The Tatras',
     "/cycling-route-around-the-tatras"]
]);

const URL_PREFIX = '/vt';
const NAME_TO_LINK = new Map(Array.from(name_to_link).map(
    // ([key, url]) => [key, URL_PREFIX + url]
    function(val) {
        return [val[0], URL_PREFIX + val[1]];
    }
));



// MAIN SCRIPT

$(document).ready(function() {

    // Elements that make up the popup.
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var ov = setup_overlay(container, content, closer);
    var ml = map_layer();
    var rl = routes_layer(KML_SOURCE);
    var ints = interactions(ov, content, closer);

    new ol.Map({
        target: 'map',
        interactions: ints,
        layers: [ml, rl],
        overlays: [ov],
        view: new ol.View({
            center: ol.proj.fromLonLat(TATRAS_COORDINATES),
            zoom: 9
        })
    });
});

// FUNCTIONS

// * POPUP

function setup_overlay(container, content, closer) {
    var overlay = create_overlay(container);
    set_overlay_closer(overlay, closer);
    return overlay;
}

/**
 * Create an overlay to anchor the popup to the map.
 */
function create_overlay(container) {
    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    return overlay;
}

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
function set_overlay_closer(overlay, closer) {
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
}

/**
 * Wrap the original closer listener into a function
 * that deselects a feature.
 */
function extend_closer_listener(select_interaction, closer) {
    closer.onclick = (function (current_onclick) {
        return function(oEvent) {
            oEvent  = oEvent || event;
            if (current_onclick)
                current_onclick(oEvent);
            select_interaction.getFeatures().clear();
        };
    })(closer.onclick);
}


// * LAYERS

function map_layer() {
    return new ol.layer.Tile({
        source: new ol.source.OSM()
    });
}

function routes_layer(kml_source) {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            url: kml_source,
            format: new ol.format.KML({
                extractStyles: false
            })
        })
        , style: default_route_style
    });
}

// * STYLING

function route_style(color) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({color: color, width: 5})
    });
}

function default_route_style(feature, resolution) {
    var day = feature.get('name').charAt(0);
    return route_style(DAY_TO_COLOR.get(day));
}

function selected_route_style() {
    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                lineCap: 'round',
                width: 7})
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'lime',
                linceCap: 'round',
                width: 5
            })
        })
    ];
}

// * INTERACTIONS

function interactions(overlay, content, closer) {
    select = select_interaction(overlay, content, closer);
    hover = hover_interaction();
    return ol.interaction.defaults({mouseWheelZoom: false}).extend([select, hover]);
}

function hover_interaction() {
    var hover = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        style: selected_route_style()
    });
    return hover;
}

function select_interaction(overlay, content, closer) {
    var select = new ol.interaction.Select({style: selected_route_style()});
    select.on('select', function(evt) {
        // ol.interaction.Select.Event
        var selected_f = evt.selected[0];
        var deselected_f = evt.deselected[0];
        // a feature is selected regardless if any other has been selected
        // at the time or not
        if (selected_f) {
            var f_name = selected_f.get('name');
            content.innerHTML = route_desc_link(f_name);
            overlay.setPosition(evt.mapBrowserEvent.coordinate);
        }
        // a feature is deselected but any other is not selected
        if (!selected_f && deselected_f) {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });
    extend_closer_listener(select, closer);
    return select;
}

function route_desc_link(name) {
    return '<a href=' + NAME_TO_LINK.get(name) + '>' + name + '</a>';
};

// * UTILITIES
