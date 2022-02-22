const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')

const JWT_SECRET = "this is supper secret...";

app.get('/', (req, res) => {
  res.send("Api is running")
})

// temp data
const user = {
  id: '1',
  email: 'ddd@gmail.com',
  password: '54s56df4s56d4fs6df56s4df'
}

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password.ejs')
})
app.post('/forgot-password', (req, res) => {
  // check user is exist
  if(user.email !== req.body.email){
    res.send('User not found')
    return;
  }

  //User exist and now create a one time link valid for 15minutes
  const secret = JWT_SECRET + user.password; // create new unique secret
  const payload = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: '1m'
  })
  const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
  console.log(link);
  res.send('Password reset link has been sent to your email...')

})

app.get('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params;
  //check user is valid
  if(id !== user.id){
    res.send('User not valid')
    return
  }

  // check jwt validity
  const secret = JWT_SECRET + user.password // for create-token and match-token secret should be same 
  try {
    const payload = jwt.verify(token, secret)
    res.render('reset-password.ejs', {email: user.email})
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
  res.send(req.params)
})

// action="" //will be hit same url
app.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params;
  const {password, confirmPassword} = req.body;

  //check user is valid
  if(id !== user.id){
    res.send('User not valid')
    return
  }

  // check jwt validity
  const secret = JWT_SECRET + user.password // for create-token and match-token secret should be same 
  try {
    const payload = jwt.verify(token, secret)
    //1. validate password and confirmPassword
    //2. we can find the user with the payload email and id
    //3. always hash the new password before save

    user.password = password

    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
  res.send(req.params)
})


/*
  note:
  this token is one time because we create secret base on unique password 
  (password is unique because password always hashed in db)
  once user change the password using generate link.
  after changes password secret will be change because password has changed.
  so, this generate link will not work
*/
app.listen(5000, () => {
  console.log("Server is running on 5000");
})