/* npm i express */

const express = require('express')
const app = express()
const port = 3000

app.get('/thingies/456', (req, res) => {
  res.status(200).json({
    id: "456",
    name: "schmilblick"
  })
})

app.listen(3000, () => {
  console.log(`Provider service is running at localhost:${port}...`)
})