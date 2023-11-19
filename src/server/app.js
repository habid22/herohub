const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Use CORS middleware with origin option
app.use(cors({ origin: 'http://localhost:3000' }));


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


// DATABASE SET UP WITH LOWDB

// Define the file path for lists.json
const listsFilePath = path.join(__dirname, 'lists.json');
// Create a database instance and initialize it with the file path
const adapter = new FileSync(listsFilePath);
// Create a lowdb instance using the adapter
const db = low(adapter);

// Initialize the database if the file does not exist
if (!fs.existsSync(listsFilePath)) {
  db.defaults({}).write();
}

const readListsFromFile = () => {
  return db.getState();
};

const writeListsToFile = (lists) => {
  db.setState(lists).write();
};



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


// Endpoint for generic superhero search
app.get('/api/superheroes/search', (req, res) => {
  const { field, pattern } = req.query;

  if (!field || !pattern) {
    return res.status(400).json({ error: 'Field and pattern parameters are required' });
  }

  // Sanitize user input
  const sanitizedPattern = sanitizeInput(pattern);

  switch (field) {
    case 'id':
      searchSuperheroesById(sanitizedPattern, res);
      break;
    case 'name':
      const matchingSuperheroesByName = getSuperheroesByNameWithPowers(sanitizedPattern);
      if (matchingSuperheroesByName.length === 0) {
        return res.status(404).json({ error: `No superheroes found with the name: ${sanitizedPattern}` });
      }
      res.json(matchingSuperheroesByName);
      break;
    case 'publisher':
      const matchingSuperheroesByPublisher = getSuperheroesByPublisherWithPowers(sanitizedPattern);
      if (matchingSuperheroesByPublisher.length === 0) {
        return res.status(404).json({ error: `No superheroes found with the publisher: ${sanitizedPattern}` });
      }
      res.json(matchingSuperheroesByPublisher);
      break;
    case 'race':
      const matchingSuperheroesByRace = getSuperheroesByRaceWithPowers(sanitizedPattern);
      if (matchingSuperheroesByRace.length === 0) {
        return res.status(404).json({ error: `No superheroes found with the race: ${sanitizedPattern}` });
      }
      res.json(matchingSuperheroesByRace);
      break;
    case 'power':
      const matchingSuperheroesByPower = getSuperheroesByPowerWithPowers(sanitizedPattern);
      if (matchingSuperheroesByPower.length === 0) {
        return res.status(404).json({ error: `No superheroes found with the power: ${sanitizedPattern}` });
      }
      res.json(matchingSuperheroesByPower);
      break;
    default:
      res.status(400).json({ error: 'Invalid search field' });
  }
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// LISTS ENDPOINTS

const sanitizeListInput = (input) => {
  // Remove trailing spaces and leading spaces
  return input.replace(/\s+$/, '').replace(/^\s+/, '');
};

// Endpoint to create a list (USED BY CREATE LIST)
app.post('/api/lists', (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: 'List name is required' });
  }

  // Sanitize input for lists
  const sanitizedListName = sanitizeListInput(name);

  // Additional validation if needed
  // For example, you might want to check if the sanitizedListName meets certain criteria
  // Here, we'll ensure the sanitizedListName is not empty after removing leading and trailing spaces
  if (!sanitizedListName) {
    return res.status(400).json({ error: 'Invalid list name' });
  }

  const lists = readListsFromFile();

  // Check if the sanitized name already exists
  if (lists[sanitizedListName]) {
    return res.status(400).json({ error: 'List name already exists' });
  }

  // Create the list and write it to the file
  lists[sanitizedListName] = [];
  writeListsToFile(lists);

  res.status(201).json({ message: `List ${sanitizedListName} created successfully` });
});


// 6. Endpoint responsible for updating an existing list (USED BY ADD HERO TO LIST)
app.put('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();
  if (!lists[name]) {
      return res.status(404).send('List name does not exist');
  }
  const newSuperheroIds = req.body.superheroIds;
  if (!Array.isArray(newSuperheroIds) || !newSuperheroIds.every(isValidId)) {
      return res.status(400).send('Invalid superhero IDs format');
  }

  lists[name] = [...new Set([...lists[name], ...newSuperheroIds])];
  writeListsToFile(lists);
  res.send(`List ${name} updated successfully`);
});


//  Endpoint responsible for getting a list content (USED BY DISPLAY LIST CONTENT)
app.get('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();
  console.log('Requested list name:', name);
  console.log('All lists:', lists);

  if (!lists[name]) {
      console.log('List not found!!');
      return res.status(404).send('List not found');
  }

  res.json(lists[name]);
});

// 8. Endpoint responsible for deleting a list (USED BY DELETING A LIST)
app.delete('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();
  if (!lists[name]) {
      return res.status(404).send('List not found');
  }
  delete lists[name];
  writeListsToFile(lists);
  res.send(`List ${name} deleted successfully`);
});


// 7. Endpoint responsible for getting heroes from a list using their IDs (USED BY DISPLAY LIST CONTENT)
app.get('/api/lists/:name/heroes', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();

  if (!lists[name]) {
    return res.status(404).send('List not found');
  }

  const heroes = lists[name].map(id => {
    const info = getSuperheroInfoById(id);

    if (!info) {
      return { error: `Superhero with ID ${id} not found` };
    }

    return { info };
  });

  res.json(heroes);
});


// Endpoint to get a list of all lists (USED BY VIEWLISTS)
app.get('/api/lists', (req, res) => {
  const lists = readListsFromFile();
  res.json(Object.keys(lists));
});


// 10. MIDDLEWARE AND ROUTES FOR THE FRONT-END APPLICATION

// Middleware to serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Route to serve the front-end application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});