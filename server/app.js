const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// What I need to tomorrow is: make a new API call for logged in users, which will take the current logged in user's JWT token and verify it is the correct JWT token to use the search functionality.
// So basically verify the JWT token and then use the search functionality.  

// Use CORS middleware with origin option
app.use(cors({ origin: 'http://localhost:3000' }));


// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '..', 'build')));



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
const listsFilePath = path.join(__dirname, 'lists.db');
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
// LISTS ENDPOINTS

const sanitizeListInput = (input) => {
  // Remove trailing spaces and leading spaces
  return input.replace(/\s+$/, '').replace(/^\s+/, '');
};

// Endpoint to create a list (USED BY CREATE LIST)
app.post('/api/lists', (req, res) => {
  const { name, created_by, description } = req.body;

  // Validate input
  if (!name || !created_by) {
    return res.status(400).json({ error: 'List name and created_by are required' });
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
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in ISO format and extract the date part
  lists[sanitizedListName] = {
    data: [],
    created_by,
    description: description || '', // Optional description, default to an empty string
    date_modified: currentDate, // Add the date_modified field
  };

  writeListsToFile(lists);

  res.status(201).json({ message: `List ${sanitizedListName} created successfully` });
});



// Endpoint responsible for updating an existing list (USED BY ADD HERO TO LIST)
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

  // Update the list and set the date_modified field
  lists[name].data = [...new Set([...lists[name].data, ...newSuperheroIds])];
  lists[name].date_modified = new Date().toISOString().split('T')[0]; // Update the date_modified field
  writeListsToFile(lists);

  res.send(`List ${name} updated successfully`);
});

// Endpoint responsible for getting a list content (USED BY DISPLAY LIST CONTENT)
app.get('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();

  if (!lists[name]) {
    return res.status(404).send('List not found');
  }

  res.json({
    created_by: lists[name].created_by,
    description: lists[name].description,
    data: lists[name].data,
    date_modified: lists[name].date_modified, // Include the date_modified field in the response
  });
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

  const heroes = lists[name].data.map(id => {
    const info = getSuperheroInfoById(id);

    if (!info) {
      return { error: `Superhero with ID ${id} not found` };
    }

    return { info };
  });

  res.json(heroes);
});


// Endpoint to get the date_modified for a specific list
app.get('/api/lists/:name/date_modified', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();

  if (!lists[name]) {
    return res.status(404).send('List not found');
  }

  res.json({
    name,
    date_modified: lists[name].date_modified,
  });
});

// Endpoint to get the created_by for a specific list
app.get('/api/lists/:name/created_by', (req, res) => {
  const { name } = req.params;
  const lists = readListsFromFile();

  if (!lists[name]) {
    return res.status(404).send('List not found');
  }

  res.json({
    name,
    created_by: lists[name].created_by,
  });
});

// Endpoint to get list names based on created_by
app.get('/api/lists/created_by/:username', (req, res) => {
  const { username } = req.params;
  const lists = readListsFromFile();

  const userLists = Object.keys(lists).filter((listName) => lists[listName].created_by === username);

  res.json(userLists);
});

// Endpoint to get a list of all lists (USED BY VIEWLISTS)
app.get('/api/lists', (req, res) => {
  const lists = readListsFromFile();
  res.json(Object.keys(lists));
});

// Endpoint to delete a superhero from a specific list by hero name
app.delete('/api/lists/:listName/heroes/:heroName', (req, res) => {
  const { listName, heroName } = req.params;
  const lists = readListsFromFile();

  if (!lists[listName]) {
    return res.status(404).send('List not found');
  }

  const list = lists[listName];

  // Check if the hero exists in the list
  const heroIndex = list.data.findIndex(id => {
    const info = getSuperheroInfoById(id);
    return info && info.name === heroName;
  });

  if (heroIndex === -1) {
    return res.status(404).send(`Superhero ${heroName} not found in the list`);
  }

  // Remove the superhero from the list
  list.data.splice(heroIndex, 1);

  // Update the date_modified field
  list.date_modified = new Date().toISOString().split('T')[0];

  // Write the updated lists to the file
  writeListsToFile(lists);

  res.send(`Superhero ${heroName} deleted from the list ${listName} successfully`);
});








//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 10. MIDDLEWARE AND ROUTES FOR THE FRONT-END APPLICATION

// Middleware to serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});