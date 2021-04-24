const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")

// const base = "https://opendata.arcgis.com/datasets/271e8b7972ce46f99ce3eb7eb100fe37_47.geojson"

const base = "https://opendata.arcgis.com/datasets/f4c31910102448ffa57c5506ea1d4de4_29.geojson"

const outputPath = path.join(__dirname, "../data")

fs.ensureDirSync(outputPath)

var codes = []

var master = {
    "points": []
}

// axios.get(base).then((res) => {
//     res.data.features.forEach(point => {
//         if (!codes.includes(point.properties["NEIGHBORHOOD"])) {
//             codes.push(point.properties["NEIGHBORHOOD"])
//         }
//         master.points.push(point.properties)
//     })
//     console.log(codes)
//     fs.writeFileSync(path.join(outputPath, "total_tests.json"), JSON.stringify(master))
// })

axios.get("https://opendata.arcgis.com/datasets/de63a68eb7674548ae0ac01867123f7e_13.geojson").then((res) => {
    fs.writeFileSync(path.join(outputPath, "health_neighborhoods.geojson"), JSON.stringify(res.data))
})
