const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")
const turf=require("turf")
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


// stores cases per neighborhood data response
var cases = {}

// stores neighborhood by tract data response

var tracts = {}

//stores census median incomes by tract data response

var census = {}

//stores population data by tract data response

var population = {}

// stores relative population vaccinated
var vaccinated = [
    20.87, 20.69, 10.52, 24.37, 15.12, 13.65, 11.86, 21.85, 18.13, 0.43, 
    14.65, 19.24, 11.0, 18.21, 11.64, 0.0, 0.0, 14.8, 15.86, 9.6,
    15.96, 11.22, 19.52, 16.17, 18.72, 9.11, 14.93, 10.16, 22.2, 9.29,
    20.69, 9.54, 20.31, 15.18, 10.68, 6.87, 14.02, 11.08, 13.63, 16.31,
    22.54, 18.62, 17.74, 15.59, 14.42, 18.6, 18.78, 8.07, 29.67, 16.98, 
    16.89, 0.0
]

var centroids = {
    type: "FeatureCollection",
    features: []
}

var vaccinations = {
	"N51": "1,736",
	"N50": "2,733",
	"N49": "575",
	"N48": "4,494",
	"N47": "3,016",
	"N46": "2,430",
	"N45": "2,125",
	"N44": "3,802",
	"N43": "3,867",
	"N42": "12",
	"N41": "1,431",
	"N40": "1,755",
	"N39": "768",
	"N38": "2,606",
	"N37": "2,040",
    "N36": "0",
    "N35": "0",
	"N34": "1,754",
	"N33": "2,253",
	"N32": "1,645",
	"N31": "4,583",
	"N30": "1,826",
	"N29": "2,344",
	"N28": "2,685",
	"N27": "3,622",
	"N26": "1,154",
	"N25": "1,657",
	"N24": "1,524",
	"N23": "3,131",
	"N22": "802",
	"N21": "1,965",
	"N20": "1,569",
	"N19": "2,336",
	"N18": "1,434",
	"N17": "1,121",
	"N16": "774",
	"N15": "226",
	"N14": "1,119",
	"N13": "3,565",
	"N12": "3,419",
	"N11": "1,584",
	"N10": "3,495",
	"N9": "2,669",
	"N8": "1,745",
	"N7": "2,565",
	"N6": "1,841",
	"N5": "2,833",
	"N4": "1,348",
	"N3": "1,808",
	"N2": "4,046",
	"N1": "3,533",
    "N0": "0"
}

axios.get(base_cases).then((res) => {
    cases = res.data
    return axios.get(neighborhood_tract)
}).then((res) => { // get tracts by each neighborhood
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
        var center=turf.centroid(feature.geometry)
        feature.properties["CENTER"]=center.geometry.coordinates
        // console.log(center)
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

        var index = vaccinated.length - parseInt(feature.properties["CODE"].substring(1, feature.properties["CODE"].length), 10) - 1

        var casesForNeighborhood = cases.features.filter(point => point.properties["NEIGHBORHOOD"].split(":")[0] === feature.properties["CODE"])

        var dates = []

        casesForNeighborhood.forEach(incident => {
            var date = incident.properties["DATE_REPORTED"]
            dates.push(date)
        })

        dates.sort()
        var latest = {}
        if (dates.length > 0) {
            latest = casesForNeighborhood.filter(incident => incident.properties["DATE_REPORTED"] === dates[dates.length-1])
        }

        // if (Object.entries(latest[0]).length > 0) {
        //     feature.properties["POSITIVE_CASES"] = latest[0].properties["TOTAL_POSITIVES"]
        // } else {
        //     feature.properties["POSITIVE_CASES"] = 0
        // }
        // console.log(latest[0].properties)
        if (latest[0]) {
            feature.properties["POSITIVE_CASES"] = latest[0].properties["TOTAL_POSITIVES"]
        } else {
            feature.properties["POSITIVE_CASES"] = 0
        }

        // feature.properties["POSITIVE_CASES"] = latest[0].properties["TOTAL_POSITIVES"]
        feature.properties["TOTAL_VACCINATED"] = vaccinations[feature.properties["CODE"]]
        feature.properties["AVERAGE_INCOME"] = averageIncome
        feature.properties["TOTAL_POPULATION"] = totalPopulation
        feature.properties["RELATIVE_VACCINATED"] = vaccinated[index]

        center.properties = feature.properties
        centroids.features.push(center)
        
        master.features.push(feature)
    })

    fs.writeFileSync(path.join(outputPath, "health_neighborhoods1.geojson"), JSON.stringify(master))
    fs.writeFileSync(path.join(outputPath, "centroids.geojson"), JSON.stringify(centroids))
})
