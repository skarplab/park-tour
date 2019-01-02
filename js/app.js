//////////////////////////////
// CREATE PARKS DATA QUERY //
////////////////////////////
let parksServiceUrl = "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Parks_with_Analysis_Tiers/FeatureServer/0";
let parksQueryProperties = {
  "where": "LEVEL_OF_SERVICE=1",
  "outSR": 4326,
  "outFields": "PARKID,NAME,PARK_TYPE,DEVELOPED,ADDRESS,ZIP_CODE",
  "f": "geojson"
}
let parksQueryUrl = `${parksServiceUrl}/query?${queryString(parksQueryProperties)}`

/////////////////
// Set up map //
///////////////
const map = L.map('map', {
  center: [35.798532, -78.644599],
  zoom: 12,
  zoomControl: false
});

// Disable interaction
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
if (map.tap) map.tap.disable();
document.getElementById('map').style.cursor = 'default';

const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);



Promise.all([
  d3.json('./data/parks.geojson'),
  d3.json('./data/mask.geojson')
  // d3.json(parksQueryUrl)
]).then(([parksData, maskData]) => {

  let parkIdArray = valuesOfCommonPropertyArray(parksData.features, 'properties', 'PARKID')
  let parkFeatureGroup = L.featureGroup().addTo(map)
  parkFeatureGroup.setStyle({
    fillOpacity: 0,
    opacity: 0,
    color: 'yellow',
    weight: 2
  })

  goToRandomPark(parkFeatureGroup, parkIdArray, parksData, maskData, 10000)

})

function goToRandomPark(featureGroup, uniqueValueArray, parksData, maskData, delay) {
  let timer = setTimeout(function moveToNewPark() {
    featureGroup.clearLayers()
    featureGroup.setStyle({
      opacity: 0
    })
    let randomParkId = uniqueValueArray[Math.floor(Math.random() * uniqueValueArray.length)]
    let randomParkLayer = L.geoJson(parksData, {
      filter: function (feature) {
        if (feature.properties.PARKID === randomParkId) {
          return true
        }
      }
    });

    let randomParkJson = randomParkLayer.toGeoJSON()
    let randomParkProperties = randomParkJson.features[0].properties

    let randomParkNameElement = document.getElementById("info-park-name")
    randomParkNameElement.innerHTML = randomParkProperties.NAME

    map.flyToBounds(randomParkLayer.getBounds(), {
      duration: 5,
      easeLinearity: 0.1
    })
    randomParkLayer.addTo(featureGroup)
    featureGroup.setStyle({
      fillOpacity: 0,
      opacity: 1,
      color: 'yellow',
      weight: 2
    })
    timer = setTimeout(moveToNewPark, delay)
  }, delay)
}
