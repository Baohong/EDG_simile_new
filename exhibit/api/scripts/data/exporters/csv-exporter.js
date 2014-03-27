/*==================================================
 *  Exhibit.CSVExporter
 *==================================================
 */
 
Exhibit.CSVExporter = {
    getLabel: function() {
        return "CSV Exporter";
    }
};

Exhibit.CSVExporter.exportOne = function(itemID, database) {
    return Exhibit.CSVExporter._wrap(
        Exhibit.CSVExporter._exportOne(itemID, database), database);
};

Exhibit.CSVExporter.exportMany = function(set, database, heading) {
    
    var s = "";
    var allProperties=new Array();
    allProperties = Exhibit.CSVExporter._filterProperties(database,heading);
    set.visit(function(itemID) {
        s += Exhibit.CSVExporter._exportOne(itemID, database,allProperties) + "\n";
    });
    
    return Exhibit.CSVExporter._wrap(s, allProperties,heading);
};

Exhibit.CSVExporter._filterProperties = function(database,heading){
    var returnArray=new Array();
    var allProperties = database.getAllProperties();
    if(!heading){
        return allProperties;
    }
    for(key in heading) {
        if(Exhibit.CSVExporter._inJsonKeys(key,allProperties)){
            returnArray[returnArray.length] = key;
        }
        else
            continue;
    }
    
    
    return returnArray;
}

Exhibit.CSVExporter._cleanData = function (valStr){
    valStr = valStr.replace(/"/g,'""');
    valStr = valStr.replace(/&quot;/g,'""');
    valStr = valStr.replace(/&lt;/g,'<');
    valStr = valStr.replace(/&gt;/g,'>');
    valStr = valStr.replace("\n",'');
    valStr = valStr.replace("\r",'');
    return valStr;
}

Exhibit.CSVExporter._exportOne = function(itemID, database,allProperties) {
    var s = "";
    
    for (var i = 0; i < allProperties.length; i++) {
        var propertyID = allProperties[i];
        var values = database.getObjects(itemID, propertyID);
       
        var valStr = values.toArray().join(",");
        s += ',"'+Exhibit.CSVExporter._cleanData(valStr)+'"';
        
    }
    return s.toString().substr(1);
};

Exhibit.CSVExporter._wrap = function(s,allProperties,heading) {
    var header = "";
    
    for (var i = 0; i < allProperties.length; i++) {
        var propertyID = allProperties[i];
        if(heading)
            header += ","+heading[propertyID];
        else
            header += ","+propertyID;
    }
    
    return header.toString().substr(1)+"\n"+ s;
}

Exhibit.CSVExporter._inJsonKeys = function(needle, hayStack){
    var hayStackLength = hayStack.length;
    for (var i = 0; i < hayStackLength; i++) {
        if(hayStack[i]==needle){
            return true;
        }
    }
    return false;
}