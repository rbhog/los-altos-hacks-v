const fs = require('fs');
const path = require('path');

var health_neighborhoods1=JSON.parse(fs.readFileSync(path.join(__dirname, "../data/health_neighborhoods1.geojson"), 'utf8'));
var minIncome=100000
var maxIncome=0
var minPopdens=100000
var maxPopdens=0
var mincovid=100000
var maxcovid=0
var minvax=10000
var maxvax=0
health_neighborhoods1.features.forEach(hood =>{
    if (hood.properties["RELATIVE_VACCINATED"]>maxvax){
        maxvax=hood.properties["RELATIVE_VACCINATED"]
    }
    if (hood.properties["RELATIVE_VACCINATED"]<minvax && hood.properties["RELATIVE_VACCINATED"]!=0 && hood.properties["RELATIVE_VACCINATED"]!=.43){
        minvax=hood.properties["RELATIVE_VACCINATED"]
    }
    if (hood.properties["AVERAGE_INCOME"]>maxIncome){
        maxIncome=hood.properties["AVERAGE_INCOME"]
    }
    if (hood.properties["AVERAGE_INCOME"]<minIncome && hood.properties["AVERAGE_INCOME"]!=0){
        minIncome=hood.properties["AVERAGE_INCOME"]
    }
    if (hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]>maxcovid && hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]!=Infinity){
        maxcovid=hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]
    }
    if (hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]<mincovid && hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]!=0){
        mincovid=hood.properties["POSITIVE_CASES"]/hood.properties["TOTAL_POPULATION"]
    }
    if (hood.properties["TOTAL_POPULATION"]/hood.properties["SHAPEAREA"]>maxPopdens){
        maxPopdens=hood.properties["TOTAL_POPULATION"]/hood.properties["SHAPEAREA"]
    }
    if (hood.properties["TOTAL_POPULATION"]/hood.properties["SHAPEAREA"]<minPopdens && hood.properties["TOTAL_POPULATION"]/hood.properties["SHAPEAREA"]!=0){
        minPopdens=hood.properties["TOTAL_POPULATION"]/hood.properties["SHAPEAREA"]
    }

})
console.log(minIncome,maxIncome,minPopdens,maxPopdens,mincovid,maxcovid,minvax,maxvax)