const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")

// const base = "https://opendata.arcgis.com/datasets/271e8b7972ce46f99ce3eb7eb100fe37_47.geojson"

const base_tests = "https://opendata.arcgis.com/datasets/f4c31910102448ffa57c5506ea1d4de4_29.geojson"
const base_cases = "https://opendata.arcgis.com/datasets/62f6f28dbfc74ae489fa3dcda9e94744_28.geojson"
const neighborhood_tract = "https://opendata.arcgis.com/datasets/1d586a67d5ce4eceb5d51bec653d6774_14.geojson"
const median_income_by_tract = "https://opendata.arcgis.com/datasets/6969dd63c5cb4d6aa32f15effb8311f3_8.geojson"
const base_neighborhoods = "https://opendata.arcgis.com/datasets/de63a68eb7674548ae0ac01867123f7e_13.geojson" // polygon for each neighborhood

const outputPath = path.join(__dirname, "../data")

fs.ensureDirSync(outputPath)

var codes = []

var master = {
    "points": []
}

var casesMaster = {
  "cases": []
}

// stores neighborhood by tract data response

var tracts = {}

//stores census median incomes by tract data response

var census = {}

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
        
// axios.get(neighborhood_tract).then((res) => {
//         fs.writeFileSync(path.join(outputPath, "neighborhoods_to_censustracts.geojson"), JSON.stringify(res.data))
// })

// //feature.properties["DC_HPN_NAME"]
            
// axios.get("https://opendata.arcgis.com/datasets/de63a68eb7674548ae0ac01867123f7e_13.geojson").then((res) => {
// fs.writeFileSync(path.join(outputPath, "health_neighborhoods.geojson"), JSON.stringify(res.data))
// })


// get tracts by each neighborhood
axios.get(neighborhood_tract).then((res) => {
    tracts = res.data
})


axios.get(median_income_by_tract).then((res) => { // gets median income
    console.log(res.data.features[0].properties)
    //FAGI_MEDIAN_2015
    census = res.data
    //fs.writeFileSync(path.join(outputPath, "census2010.geojson"), JSON.stringify(res.data))
})


axios.get(base_neighborhoods).then((res) => {
    res.data.features.forEach(feature => {
        var toWrite = {}
        var tractsInArea = []
        //get census tracts for given feature
        tracts.features.forEach(tract => {
            if (feature.properties["NAME"].replace(":", "") === tract.properties["HPN_LABEL"] && feature.properties["NAME"].replace(":", "") != "Unknown") {
                tractsInArea.push(tract.properties["GEOID"])
            }
        })

        var incomes = []

        tractsInArea.forEach(geoid => {

        })

        console.log(tractsInArea)

        // master.push()
    })
})



// get a health neighborhood from the geojson - DONE
// get the census tracts for given neighborhood using neighborhoods_to_censustracts.geojson - DONE
// average the FAGI_MEDIAN_2015 for all census tracts in a given neighborhood
// add the median income property to the neighborhood feature
// push the feature to the master collection
// write the file