require('dotenv').config() // reads the .env file
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json');

const app = express();

// log the responses
app.use(morgan('dev'))
// hides how our API is powered in X-Powered-By
// helmet should be before cors
app.use(helmet())
// to allow cores 
app.use(cors())

app.use(validateBearerTokens = (req, res, next) => {
  // const bearerToken = req.get('Authorization').split(' ')[1]
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  console.log('validate bearer token middleware');

  //  If the token isn't present, we want to respond with the same error for when the token is present but invalid
  //  In other words, we want to respond with 401 invalid if either the header isn't present or the token is invalid
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
    }
  // move to the next middleware
  next();
})

// middleware handler, read request or modify response
handleGetTypes = (req, res) => {
  res.json(POKEDEX);
}

app.get('/types', handleGetTypes);

handleGetPokemon = (req, res) => {
// Orginal Attempt
//   const {name = '', type = ''} = req.query;
//   let results = POKEDEX.pokemon
//       .filter(pokemon => 
//         pokemon
//           .name.toLowerCase()
//           .includes(name.toLowerCase()));
  
//   res.send(results);
let response = POKEDEX.pokemon;

// filter our pokemon by name if name query param is present
if (req.query.name) {
  response = response.filter(pokemon =>
    // case insensitive searching
    pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
  )
}

// filter our pokemon by type if type query param is present
if (req.query.type) {
  response = response.filter(pokemon =>
    pokemon.type.includes(req.query.type)
  )
}

res.json(response)
}

app.get('/pokemon', handleGetPokemon);

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})