

var empty = ee.Image().byte();
var outline = empty.paint({featureCollection: table, width: 1});
  
Map.addLayer(outline, {palette: 'red'}, 'área de estudo', false); 
  
Map.centerObject(geometry, 9)


var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filter(ee.Filter.calendarRange(2025,2025,'year'))
  .filter(ee.Filter.calendarRange(7,8,'month'))
   .filterBounds(geometry);

var sel = s2.filterMetadata('CLOUD_COVERAGE_ASSESSMENT', 'less_than', 5)


  var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
};

function addImage(image) { // display each image in collection
  var id = image.id;
  var iMage = ee.Image(image.id);
  Map.addLayer(iMage, rgbVis, id, false);
}

sel.evaluate(function(desenha) {  // atualiza a imagecollection (evaluate)
  desenha.features.map(addImage);
});


// Get the number of images in the collection.
var count = sel.size()
print('Number of images',count );

// Get the list of images.

var imgList = sel.toList(count);
print(imgList);

//Get selected layers
var buttonShowSelected = ui.Button('Get selected layers')
var panelSelected = ui.Panel()

buttonShowSelected.onClick(function() {
  var layers = Map.layers()
  var selected = []
  var selectedObjects = []
  for(var i=0; i<layers.length(); i++) {
    var l = layers.get(i)
    if(l.getShown()) {
      selected.push(ui.Label(l.getName()))
      selectedObjects.push(l.getEeObject())
    }
  }
  panelSelected.widgets().reset(selected)
  print(selectedObjects)
  
//cria uma coleção com as propriedades dos selecionados
 var features = ee.FeatureCollection(selectedObjects).select("system:id", "DATE_ACQUIRED"); 

// Export the FeatureCollection.
Export.table.toDrive({
  collection: features,
  description: 'export_selected',
  fileFormat: 'CSV'});
  
}) //aqui acaba a função



Map.add(buttonShowSelected)
Map.add(panelSelected)


