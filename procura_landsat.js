//Eliana Lima da Fonseca
//Universidade Federal do Rio Grande do Sul


//Choose the Landsat images over the AOI 

// Selecionar Bagé diretamente com um único filtro combinado
var AOI = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.and(
  ee.Filter.eq('ADM0_NAME', 'Brazil'),
  ee.Filter.eq('ADM1_NAME', 'Rio Grande Do Sul'),
  ee.Filter.eq('ADM2_NAME', 'Bage')
));

//Desenha o contorno da área de interesse (AOI)
var empty = ee.Image().byte();

var outline = empty.paint({
  featureCollection: AOI,
  color: 1,
  width: 1});
Map.addLayer(outline, {palette: 'FF0000'}, 'AOI', false);

//Center the map
Map.centerObject(AOI, 7);
Map.setOptions('satellite');

//Selected the entire image collection 
var LC09 = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
var LC08 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')

var col = LC09.merge(LC08)

// https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_TOA

// filters
var col = col
 .filterBounds(AOI)
 .filter(ee.Filter.lt('CLOUD_COVER', 5))
 .filterDate('2025-07-01','2025-08-31')
 
// Get the number of filtered images
var count = col.size()
print('Number of images',count );
// Get the list of images.
var imgList = col.toList(count);
print(imgList);


//snippet to visualize the images
var rgbVis = {min: 0.0, max: 0.3, bands: ['B4', 'B3', 'B2']};

function addImage(image) { // display each image
  var id = image.id;
  var iMage = ee.Image(image.id);
  Map.addLayer(iMage, rgbVis, id, false);
}

col.evaluate(function(desenha) {  //evaluate the collection  
  desenha.features.map(addImage);  // map 'addImage' over the imagecollection
});


//snippet to get a list of the selected layers

var buttonShowSelected = ui.Button('List selected layers')

buttonShowSelected.onClick(function() {
  var layers = Map.layers()
  var selected = []
  var selectedObjects = []
  for(var i=0; i<layers.length(); i++) {
    var l = layers.get(i)
    if(l.getShown()) {
      selected.push(ui.Label(l.getName()))
      selectedObjects.push(l.getEeObject())}
  }
print('Selected layers:',selectedObjects)

  
//cria uma coleção com as propriedades dos selecionados
 var features = ee.FeatureCollection(selectedObjects).select("system:id", "DATE_ACQUIRED"); 
//8888 muito importante...selecionar apenas imagens.....


// Export the FeatureCollection.
Export.table.toDrive({
  collection: features,
  description: 'export_selected',
  fileFormat: 'CSV'});
  
}) // end of the function
Map.add(buttonShowSelected) //end of the snippet




