const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use

app.get('/', (req, res) => {
  res.send("Api is running")
})

app.listen(5000, () => {
  console.log("Server is running on 5000");
})