const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")

// const base = "https://opendata.arcgis.com/datasets/271e8b7972ce46f99ce3eb7eb100fe37_47.geojson"

const base_tests = "https://opendata.arcgis.com/datasets/f4c31910102448ffa57c5506ea1d4de4_29.geojson"
const base_cases = "https://opendata.arcgis.com/datasets/62f6f28dbfc74ae489fa3dcda9e94744_28.geojson"
const neighborhood_tract = "https://opendata.arcgis.com/datasets/1d586a67d5ce4eceb5d51bec653d6774_14.geojson"
const median_income_by_tract = "https://opendata.arcgis.com/datasets/6969dd63c5cb4d6aa32f15effb8311f3_8.geojson"
const base_neighborhoods = "https://opendata.arcgis.com/datasets/de63a68eb7674548ae0ac01867123f7e_13.geojson" // polygon for each neighborhood
const base_population = "https://opendata.arcgis.com/datasets/faea4d66e7134e57bf8566197f25b3a8_0.geojson"

const outputPath = path.join(__dirname, "../data")

let average = (array) => array.reduce((a, b) => a + b) / array.length;

fs.ensureDirSync(outputPath)

var codes = []

var master = {
    type: "FeatureCollection",
    features: []
}

var casesMaster = {
  "cases": []
}

// stores neighborhood by tract data response

var tracts = {}

//stores census median incomes by tract data response

var census = {}

//stores population data by tract data response

var population = {}

// axios.get(base_tests).then((res) => {
//     res.data.features.forEach(point => {
//         if (!codes.includes(point.properties["NEIGHBORHOOD"])) {
//             codes.push(point.properties["NEIGHBORHOOD"])
//         }
//         master.points.push(point.properties)
//     })
//     console.log(codes)
//     fs.writeFileSync(path.join(outputPath, "total_tests.json"), JSON.stringify(master))
// })


// axios.get(base_cases).then((res) => {
//     res.data.features.forEach(feature => {
//         casesMaster.cases.push(feature.properties)
//     })
//     fs.writeFileSync(path.join(outputPath, "total_cases.json"), JSON.stringify(casesMaster))
// })
        

// get tracts by each neighborhood
axios.get(neighborhood_tract).then((res) => {
    tracts = res.data
    return axios.get(median_income_by_tract)
}).then((res) => {
    //FAGI_MEDIAN_2015
    census = res.data
    fs.writeFileSync(path.join(outputPath, "census2010.geojson"), JSON.stringify(res.data))
    return axios.get(base_population)
}).then((res) => {
    population = res.data

    return axios.get(base_neighborhoods)
}).then((res) => {
    res.data.features.forEach(feature => {
        var tractsInArea = []
        //get census tracts for given feature
        tracts.features.forEach(tract => {
            if (feature.properties["NAME"].replace(":", "") === tract.properties["HPN_LABEL"] && feature.properties["NAME"].replace(":", "") != "Unknown") {
                tractsInArea.push(tract.properties["GEOID"])
            }
        })

        var validIncome = []
        tractsInArea.forEach(geoid => { // get the census data for each of the tracts
            validIncome = validIncome.concat(census.features.filter(census_feature => census_feature.properties["GEOID"] === geoid))
        })

        var medianIncomes = validIncome.map(
            function(element) { return element.properties["FAGI_MEDIAN_2015"] }
        )

        var validPopulation = []

        tractsInArea.forEach(geoid => {
            validPopulation = validPopulation.concat(population.features.filter(pop_feature => pop_feature.properties["GEOID"] === geoid))
        })

        var populations = validPopulation.map(
            function(element) { return element.properties["B01001_001E"] }
        )

        var averageIncome = 0

        if (medianIncomes.length > 0) {
            averageIncome = average(medianIncomes)
        }

        var totalPopulation = 0
        if (populations.length > 0) {
            totalPopulation = populations.reduce((a, b) => a + b)
        }

        feature.properties["AVERAGE_INCOME"] = averageIncome
        feature.properties["TOTAL_POPULATION"] = totalPopulation
        
        master.features.push(feature)
    })

    fs.writeFileSync(path.join(outputPath, "health_neighborhoods1.geojson"), JSON.stringify(master))
})
