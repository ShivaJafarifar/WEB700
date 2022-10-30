app.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE')
  next()
})

app.get('/user/:id', function (req, res, next) {
  console.log('although this matches')
  next()
})

app.get('/user/:id', function (req, res) {
  console.log('and this matches too')
  res.end()
})