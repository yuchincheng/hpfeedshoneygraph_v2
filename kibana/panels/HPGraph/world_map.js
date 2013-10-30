function World_Map(json){

var map;
// svg path for target icon
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    map = new AmCharts.AmMap();
    map.pathToImages = "http://www.ammap.com/lib/images/";
    //map.panEventsEnabled = true; // this line enables pinch-zooming and dragging on touch devices
    map.imagesSettings = {
        //color:"#666700",
        rollOverColor: "#ffcc00",
        rollOverScale: 3,
        selectedScale: 3,
        selectedColor: "#ffcc00"
    };
    
    map.areasSettings = {
        unlistedAreasColor:"#c1c670"
    };
    
    map.zoomControl.buttonFillColor = "#8a9028";
    map.zoomControl.buttonRollOverColor= "#ffcc00";
// translate data from json
    var node_location =[];
    for(i=0;i<json.length;i++){
            var  node={ 
            svgPath:targetSVG,
            zoomLevel: 5,
            scale: 0.8,
            title: json[i]['title'],
            latitude: json[i]['latitude'],
            longitude:json[i]['longitude'],
            color:json[i]['color']
                      };
            node_location.push(node);          
 }                                


    var data = { mapVar: AmCharts.maps.worldLow,
                 images:node_location
               }; 
    console.log(data);
    var dataProvider =data;
   
    map.dataProvider = dataProvider;

    map.objectList = new AmCharts.ObjectList("listdiv");
    map.showImagesInList = true;

    map.write("mapdiv");


}



