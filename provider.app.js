/*
npm install express
npm install body-parser
npm install morgan
*/

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const thingies = [
  {
    id: "456",
    name: "schmilblick"
  }
]

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/thingies/:thingyId', (req, res) => {
  const thingyId = req.params.thingyId
  const thingy = thingies.filter( thingy => thingy.id == thingyId)[0]
  if (thingy == undefined) {
    res.status(404).end()
    return
  }
  res.status(200).json(thingy)
})

app.post('/', (req, res) => {
  console.log(req.body)
  const providerState = req.body.state
  switch(providerState) {
    case "has one thingy with '123' as an thingyId":
      thingies.push({
        id: "123",
        name: "stuff"
      })
      break
    default:
      res.status(404).end()
      return
  }
  res.status(201).end()
})

app.listen(3000, () => {
  console.log(`Provider service is running at localhost:${port}...`)
})
