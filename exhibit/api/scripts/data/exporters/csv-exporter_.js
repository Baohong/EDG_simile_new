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
    set.visit(function(itemID) {
        s += Exhibit.CSVExporter._exportOne(itemID, database,heading) + "\n";
    });
    return Exhibit.CSVExporter._wrap(s, database,heading);
};


Exhibit.CSVExporter._exportOne = function(itemID, database,heading) {
    var s = "";
    var indx=0;
    var allProperties=new Array();
    
    if(heading){
        for(key in heading) {
            allProperties[indx++]=key;
        }
    }else{
        allProperties = database.getAllProperties();
    }
    
    for (var i = 0; i < allProperties.length; i++) {
        var propertyID = allProperties[i];
        var values = database.getObjects(itemID, propertyID);
        
        var valStr = values.toArray().join(",");
        valStr = valStr.replace(/"/g,'""');
        valStr = valStr.replace(/&quot;/g,'""');
        valStr = valStr.replace(/&lt;/g,'<');
        valStr = valStr.replace(/&gt;/g,'>');
        valStr = valStr.replace("\n",'');
        valStr = valStr.replace("\r",'');
        
        s += ',"'+valStr+'"';
    }
    return s.toString().substr(1);
};

Exhibit.CSVExporter._wrap = function(s, database,heading) {
    var header = "";
    
    var allProperties = database.getAllProperties();
    
    for (var i = 0; i < allProperties.length; i++) {
        var propertyID = allProperties[i];

        //CHECK IF THERE IS CUSTOM HEADING TITLE PROVIDED
        if(heading){
            if(Exhibit.CSVExporter._inJsonKeys(propertyID,heading))
                propertyID = heading[propertyID]?heading[propertyID]:propertyID;
            else
                continue;
        }
        header += ","+propertyID;
    }
    
    return header.toString().substr(1)+"\n"+ s;
}

Exhibit.CSVExporter._inJsonKeys = function(needle, hayStack){
    for(key in hayStack) {
        if(key==needle){
            return true;
        }
    }
    return false;
}