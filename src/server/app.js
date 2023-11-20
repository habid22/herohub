const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const fs = require('fs');

// Use CORS middleware with origin option
app.use(cors({ origin: 'http://localhost:4000' }));


// Middleware to parse JSON bodies
app.use(express.json());

// Function to read superhero information from file
function readSuperheroInfo() {
  const data = fs.readFileSync(path.join(__dirname, 'heroes_information.json'), 'utf-8');
  return JSON.parse(data);
}

// Function to read superhero powers from file
function readSuperheroPowers() {
  const data = fs.readFileSync(path.join(__dirname, 'super_hero_powers.json'), 'utf-8');
  return JSON.parse(data);
}


// FUNCTIONS FOR SEARCHING SUPERHEROES

const sanitizeInput = (input) => {
  // Remove any HTML, CSS, and JavaScript tags
  return input.replace(/<[^>]*>/g, '');
};


// Function to get a list of unique publishers from superhero data
function getUniquePublishers() {
  const superheroes = readSuperheroInfo();
  const publishers = new Set(superheroes.map(hero => sanitizeInput(hero.Publisher)));
  return Array.from(publishers);
}

// Function to get superhero data by ID
function getSuperheroById(id) {
  const superheroes = readSuperheroInfo();
  return superheroes.find(hero => hero.id === parseInt(sanitizeInput(id)));
}

// Function to get superheroes by name with all information
function getSuperheroesByNameWithPowers(name) {
  const superheroes = readSuperheroInfo();
  const powersData = readSuperheroPowers();

  name = sanitizeInput(name);

  const matchingSuperheroes = superheroes
    .filter(hero => {
      const heroNameToLowerCase = hero.name ? hero.name.toLowerCase() : null;
      return heroNameToLowerCase.includes(name.toLowerCase());
    })
    .map(hero => {
      const filteredPowers = powersData
        .filter(powerHero => powerHero.hero_names === hero.name)
        .reduce((acc, power) => {
          Object.keys(power).forEach(key => {
            if (power[key] === 'TRUE' && !acc.includes(key)) {
              // Include unique powers without duplication
              acc.push(key);
            }
          });
          return acc;
        }, []);

      // Include powers directly under the superhero object
      return { ...hero, powers: filteredPowers };
    });

  return matchingSuperheroes;
}

// Function to get superheroes by publisher
function getSuperheroesByPublisherWithPowers(publisher) {
  const superheroes = readSuperheroInfo();
  const powersData = readSuperheroPowers();

  publisher = sanitizeInput(publisher);

  const matchingSuperheroes = superheroes
    .filter(hero => {
      const heroPublisherToLowerCase = hero.Publisher ? hero.Publisher.toLowerCase() : null;
      const publisherToLowerCase = publisher.toLowerCase();

      return (
        heroPublisherToLowerCase && heroPublisherToLowerCase.includes(publisherToLowerCase)
      );
    })
    .map(hero => {
      const filteredPowers = powersData
        .filter(powerHero => powerHero.hero_names === hero.name)
        .reduce((acc, power) => {
          Object.keys(power).forEach(key => {
            if (power[key] === 'TRUE' && !acc.includes(key)) {
              // Include unique powers without duplication
              acc.push(key);
            }
          });
          return acc;
        }, []);

      // Include powers directly under the superhero object
      return { ...hero, powers: filteredPowers };
    });

  return matchingSuperheroes;
}

// Function to get superheroes by race
function getSuperheroesByRaceWithPowers(race) {
  const superheroes = readSuperheroInfo();
  const powersData = readSuperheroPowers();

  race = sanitizeInput(race);

  const matchingSuperheroes = superheroes
    .filter(hero => {
      const heroRaceToLowerCase = hero.Race ? hero.Race.toLowerCase() : null;
      const raceToLowerCase = race.toLowerCase();

      return (
        heroRaceToLowerCase && heroRaceToLowerCase.includes(raceToLowerCase)
      );
    })
    .map(hero => {
      const filteredPowers = powersData
        .filter(powerHero => powerHero.hero_names === hero.name)
        .reduce((acc, power) => {
          Object.keys(power).forEach(key => {
            if (power[key] === 'TRUE' && !acc.includes(key)) {
              // Include unique powers without duplication
              acc.push(key);
            }
          });
          return acc;
        }, []);

      // Include powers directly under the superhero object
      return { ...hero, powers: filteredPowers };
    });

  return matchingSuperheroes;
}

// Function to get superheroes by a specific power
function getSuperheroesByPowerWithPowers(power) {
  const superheroes = readSuperheroInfo();
  const powersData = readSuperheroPowers();

  power = sanitizeInput(power);

  const matchingSuperheroes = superheroes
    .filter(hero => {
      const heroPowers = powersData
        .filter(powerHero => powerHero.hero_names === hero.name && powerHero[power] === 'TRUE');

      return heroPowers.length > 0 || hero.name.toLowerCase().includes(power.toLowerCase());
    })
    .map(hero => {
      const allPowers = powersData
        .filter(powerHero => powerHero.hero_names === hero.name && powerHero['hero_names'] === hero.name)
        .reduce((acc, power) => {
          Object.keys(power).forEach(key => {
            if (power[key] === 'TRUE') {
              acc.push(key);
            }
          });
          return acc;
        }, []);

      return { ...hero, powers: allPowers.join(', ') };
    });

  return matchingSuperheroes;
}

// Function to get superhero powers by name
function getSuperheroByNamePowers(name) {
  const powersData = readSuperheroPowers();
  const superhero = powersData.find(hero => hero.hero_names === name);

  if (!superhero) {
    return null;
  }

  // Remove properties with "FALSE" value
  const filteredSuperhero = Object.fromEntries(
    Object.entries(superhero).filter(([key, value]) => value !== "FALSE")
  );

  return filteredSuperhero;
}


// Function to validate superhero ID (INPUT SANITIZATION)
function isValidId(superheroId) {
  // Construct the absolute path to heroes_information.json using __dirname
  const filePath = path.join(__dirname, 'heroes_information.json');

  // Load heroes information from the JSON file
  const heroesInformation = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Check if the superheroId exists in the heroes information
  const exists = heroesInformation.some(hero => hero.id === superheroId);

  return exists;
}

// Function to search superheroes by ID
function getSuperheroInfoById(id) {
  const superheroes = readSuperheroInfo();
  const powersData = readSuperheroPowers();

  const superhero = superheroes.find(superhero => superhero.id === id);

  if (!superhero) {
    return null; // Superhero not found
  }

  const filteredPowers = powersData
    .filter(powerHero => powerHero.hero_names === superhero.name)
    .reduce((acc, power) => {
      Object.keys(power).forEach(key => {
        if (power[key] === 'TRUE' && !acc.includes(key)) {
          // Include unique powers without duplication
          acc.push(key);
        }
      });
      return acc;
    }, []);

  return { ...superhero, powers: filteredPowers };
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ENDPOINTS 

// Endpoint to get superheroes by power
app.get('/superheroes/power/:power', (req, res) => {
  const power = req.params.power;
  const trueSuperheroes = getSuperheroesByPower(power);

  if (trueSuperheroes.length === 0) {
    return res.status(404).json({ error: `No superheroes found with the power: ${power}` });
  }

  res.json(trueSuperheroes);
});


// Endpoint to get superhero powers by name
app.get('/SuperHeroByNamePowers/:name', (req, res) => {
  const name = req.params.name;
  const superhero = getSuperheroByNamePowers(name);

  if (!superhero) {
    return res.status(404).json({ error: 'Superhero not found' });
  }

  res.json({ superhero });
});


// Endpoint to get a list of all unique publishers
app.get('/api/publishers', (req, res) => {
  const publishers = getUniquePublishers();
  res.json(publishers);
});


// Endpoint to get superhero data by ID
app.get('/api/superheroes/id/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const superhero = getSuperheroById(id);

  if (!superhero) {
    return res.status(404).json({ error: 'Superhero not found' });
  }

  res.json({ superhero });
}); 


app.get('/api/superheroes/multi-search', (req, res) => {
    const { name, race, power, publisher } = req.query;
  
    // Sanitize user input
    const sanitizedName = sanitizeInput(name);
    const sanitizedRace = sanitizeInput(race);
    const sanitizedPower = sanitizeInput(power);
    const sanitizedPublisher = sanitizeInput(publisher);
  
    // Retrieve superheroes based on each criterion
    const superheroesByName = getSuperheroesByNameWithPowers(sanitizedName);
    const superheroesByRace = getSuperheroesByRaceWithPowers(sanitizedRace);
    const superheroesByPower = getSuperheroesByPowerWithPowers(sanitizedPower);
    const superheroesByPublisher = getSuperheroesByPublisherWithPowers(sanitizedPublisher);
  
    // Find common superheroes based on multiple criteria
    const commonSuperheroes = findCommonSuperheroes([
      superheroesByName,
      superheroesByRace,
      superheroesByPower,
      superheroesByPublisher,
    ]);
  
    // Check if any common superheroes were found
    if (commonSuperheroes.length === 0) {
      return res.status(404).json({ error: 'No superheroes found with the specified criteria' });
    }
  
    res.json(commonSuperheroes);
  });
  
  // Helper function to find common superheroes based on multiple criteria
  function findCommonSuperheroes(superheroesArrays) {
    if (superheroesArrays.length === 0) {
      return [];
    }
  
    // Use the first array as the base and filter based on other arrays
    const commonSuperheroes = superheroesArrays[0].filter((hero) => {
      for (let i = 1; i < superheroesArrays.length; i++) {
        if (!superheroesArrays[i].some((commonHero) => commonHero.name === hero.name)) {
          return false;
        }
      }
      return true;
    });
  
    return commonSuperheroes;
  }
  


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 10. MIDDLEWARE AND ROUTES FOR THE FRONT-END APPLICATION

// Middleware to serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// // Route to serve the front-end application
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/index.html'));
// });

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});