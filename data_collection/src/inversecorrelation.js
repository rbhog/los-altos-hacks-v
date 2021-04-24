//npm install calculate-correlation
var fs = require('fs');
const calculateCorrelation = require("calculate-correlation");

var correlations = []
var hoodsinward = JSON.parse(fs.readFileSync('./hoodsinward.json', 'utf8'));
var health_neighborhoods1=JSON.parse(fs.readFileSync('C:/Users/rober/Documents/los-altos-hacks-v/data_collection/data/health_neighborhoods1.geojson', 'utf8'));
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
    console.log(incomes)
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
}   
)

    
//i need x=median income per hood, y=total cases per hood
