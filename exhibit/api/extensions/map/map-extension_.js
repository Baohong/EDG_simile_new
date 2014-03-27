/*==================================================
 *  Simile Exhibit Map Extension
 *==================================================
 */

(function() {
    var isCompiled = ("Exhibit_MapExtension_isCompiled" in window) && 
    window.Exhibit_MapExtension_isCompiled;
                    
    Exhibit.MapExtension = {
        params: {
            bundle:     true,
            service:    "google"
        } 
    };

    var javascriptFiles = [
    "map-view.js",
    "vemap-view.js",
    "olmap-view.js"
    ];
    var cssFiles = [
    "map-view.css",
    "olmap-view.css"
    ];
    
    var paramTypes = {
        bundle: Boolean
    };
    if (typeof Exhibit_MapExtension_urlPrefix == "string") {
        Exhibit.MapExtension.urlPrefix = Exhibit_MapExtension_urlPrefix;
        if ("Exhibit_MapExtension_parameters" in window) {
            SimileAjax.parseURLParameters(Exhibit_MapExtension_parameters,
                Exhibit.MapExtension.params,
                paramTypes);
        }
    } else {
        var url = SimileAjax.findScript(document, "/map-extension.js");
        if (url == null) {
            SimileAjax.Debug.exception(new Error("Failed to derive URL prefix for Simile Exhibit Map Extension code files"));
            return;
        }
        Exhibit.MapExtension.urlPrefix = url.substr(0, url.indexOf("map-extension.js"));
        
        SimileAjax.parseURLParameters(url, Exhibit.MapExtension.params, paramTypes);
    }
    
    var scriptURLs = [];
    var cssURLs = [];
        
    if (Exhibit.MapExtension.params.service == "google") {
        if (Exhibit.params.gmapkey) {
            //AE scriptURLs.push("http://maps.google.com/maps?file=api&v=2&key=" + Exhibit.params.gmapkey);
            scriptURLs.push("https://maps-api-ssl.google.com/maps?file=api&v=3&key=" + Exhibit.params.gmapkey);
        } else if (Exhibit.MapExtension.params.gmapkey) {
            //AE scriptURLs.push("http://maps.google.com/maps?file=api&v=2&key=" + Exhibit.MapExtension.params.gmapkey);
            scriptURLs.push("https://maps-api-ssl.google.com/maps?file=api&v=3&key=" + Exhibit.MapExtension.params.gmapkey);
        } else if (!("GMap2" in window)) {
            //AE scriptURLs.push("http://maps.google.com/maps?file=api&v=2");
            scriptURLs.push("https://maps-api-ssl.google.com/maps?file=api&v=3&sensor=false&client=gme-epa");
        }
    } else if (Exhibit.MapExtension.params.service == "openlayers") {
        //AE scriptURLs.push("http://www.openlayers.org/dev/OpenLayers.js");
        scriptURLs.push("http://dev.innovateteam.com/OpenLayers/lib/OpenLayers.js");
        scriptURLs.push("http://www.openstreetmap.org/openlayers/OpenStreetMap.js");
    } else {
        scriptURLs.push("http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=5");
    }
    
    if (Exhibit.MapExtension.params.bundle) {
        scriptURLs.push(Exhibit.MapExtension.urlPrefix + "map-extension-bundle.js");
        cssURLs.push(Exhibit.MapExtension.urlPrefix + "map-extension-bundle.css");
    } else {
        SimileAjax.prefixURLs(scriptURLs, Exhibit.MapExtension.urlPrefix + "scripts/", javascriptFiles);
        SimileAjax.prefixURLs(cssURLs, Exhibit.MapExtension.urlPrefix + "styles/", cssFiles);
    }
    
    for (var i = 0; i < Exhibit.locales.length; i++) {
        scriptURLs.push(Exhibit.MapExtension.urlPrefix + "locales/" + Exhibit.locales[i] + "/map-locale.js");
    };
    
    if (!isCompiled) {
        SimileAjax.includeJavascriptFiles(document, "", scriptURLs);
        SimileAjax.includeCssFiles(document, "", cssURLs);
    }
})();
