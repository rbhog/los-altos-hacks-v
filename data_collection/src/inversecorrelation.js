//npm install calculate-correlation
const axios = require("axios")
const fs = require('fs');
const path = require('path');
const calculateCorrelation = require("calculate-correlation");
const warddata="https://opendata.arcgis.com/datasets/0ef47379cbae44e88267c01eaec2ff6e_31.geojson"
const outputPath = path.join(__dirname, "../data")
const turf=require("turf")

axios.get(warddata).then((res)=>{
    warddata.forEach
})

var centroids = {
    type: "FeatureCollection",
    features: []
}

var correlations = []
var correlationArray = []
var vaxArray = []
var hoodsinward = JSON.parse(fs.readFileSync('./hoodsinward.json', 'utf8'));
var health_neighborhoods1=JSON.parse(fs.readFileSync(path.join(__dirname, "../data/health_neighborhoods1.geojson"), 'utf8'));
var i = 0;
hoodsinward.forEach(ward =>{
    //make list of incomes of neighborhood in ward
    var incomes=[]
    var key = Object.keys(ward)[0]
    
    ward[key].hoods.forEach(hood =>{
        health_neighborhoods1.features.forEach(neighbor =>{
            if(neighbor.properties.DC_HPN_NAME==hood){
                incomes.push(neighbor.properties.AVERAGE_INCOME)
            }
        })
        
    })
    //make list of case rate for each neighborhood in ward
    var cases=[]
    var vaccines = []
    ward[key].hoods.forEach(hood =>{
        health_neighborhoods1.features.forEach(neighbor =>{
            if(neighbor.properties.DC_HPN_NAME==hood){
                var caserate=100*(neighbor.properties.POSITIVE_CASES)/(neighbor.properties.TOTAL_POPULATION)
                cases.push(caserate)
                var vaxrate = (neighbor.properties.RELATIVE_VACCINATED)/(neighbor.properties.TOTAL_POPULATION)
                vaccines.push(vaxrate)
            }
        })
        
    })
    //calculate correlation for ward, add to correlations
    var correlation=calculateCorrelation(incomes,cases)
    var vaxCorrelation = calculateCorrelation(vaccines, incomes)
    correlations.push({key:ward,value:correlation})
    correlationArray.push(correlation)
    vaxArray.push(vaxCorrelation)
    console.log(correlation)
    // fs.writeFileSync(path.join(outputPath,"wardcorrelations.geojson"), JSON.stringify(correlations))
})

axios.get("https://opendata.arcgis.com/datasets/0ef47379cbae44e88267c01eaec2ff6e_31.geojson").then((res) => {
    var collection = res.data
    collection.features.forEach(feature => {
        var index = parseInt(feature.properties["WARD"]) - 1
        feature.properties["CORRELATION_VALUE"] = correlationArray[index]
        feature.properties["VAX_CORRELATION"] = vaxArray[index]
        var center=turf.centroid(feature.geometry)
        feature.properties["CENTER"]=center.geometry.coordinates
    })

    fs.writeFileSync(path.join(outputPath, "wards.geojson"), JSON.stringify(collection))
})

    
//i need x=median income per hood, y=total cases per hood
