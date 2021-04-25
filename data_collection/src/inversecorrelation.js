//npm install calculate-correlation
const axios = require("axios")
const fs = require('fs');
const path = require('path');
const calculateCorrelation = require("calculate-correlation");
const warddata="https://opendata.arcgis.com/datasets/0ef47379cbae44e88267c01eaec2ff6e_31.geojson"
const outputPath = path.join(__dirname, "../data")

axios.get(warddata).then((res)=>{
    warddata.forEach
})



var correlations = {}
var hoodsinward = JSON.parse(fs.readFileSync('./hoodsinward.json', 'utf8'));
var health_neighborhoods1=JSON.parse(fs.readFileSync(path.join(__dirname, "../data/health_neighborhoods1.geojson"), 'utf8'));
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
    ward[key].hoods.forEach(hood =>{
        health_neighborhoods1.features.forEach(neighbor =>{
            if(neighbor.properties.DC_HPN_NAME==hood){
                var caserate=100*(neighbor.properties.POSITIVE_CASES)/(neighbor.properties.TOTAL_POPULATION)
                cases.push(caserate)

            }
        })
        
    })
    //calculate correlation for ward, add to correlations
    var correlation=calculateCorrelation(incomes,cases)
    correlations.push({key:ward,value:correlation})
    console.log(correlation)
    fs.writeFileSync(path.join(outputPath,"wardcorrelations.geojson"), JSON.stringify(correlations))
}   
)

    
//i need x=median income per hood, y=total cases per hood
