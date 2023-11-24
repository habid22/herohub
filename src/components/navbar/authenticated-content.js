import React, { useState, Fragment, useEffect } from "react";
import {
  Flex,
  Button,
  Text,
  Icon,
  Link,
  Input,
  Stack,
  ChakraProvider,
  CSSReset,
  ColorModeProvider,
  useColorMode,
  useColorModeValue,
  useToast,
  Divider,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { useLogout, useAuth } from "../../hooks/auth"; // Import useAuth
import { FaSuperpowers } from "react-icons/fa";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import axios from "axios";





export default function LogInContent() {
  return (
  <ChakraProvider>
    <CSSReset />
    <ColorModeWrapper>
    <Flex direction="column" align="center" minH="100vh">
      <Header />
      <WelcomeContainer />
      <HeroSearchContainer />
      <CreateList />
      <ListManagement />
      <PublicLists />
    </Flex>
    </ColorModeWrapper>
  </ChakraProvider>
  );

  }

function Header() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { logout, isLoading } = useLogout();
  const { user } = useAuth();

  // Check if the current user is an admin based on their email
  const isAdminUser = user?.email === "hassanaminsheikh@gmail.com";

  return (
    <Flex
      shadow="sm"
      pos="fixed"
      width="full"
      borderTop="6px solid"
      borderTopColor="teal.400"
      height="16"
      zIndex="3"
      justify="space-between"
      align="center"
      bg={useColorModeValue("white", "gray.800")}
      px="4"
    >

    <Flex align="center">
        <Icon as={FaSuperpowers} boxSize={8} color="teal.500" />
        <Text fontWeight="bold" fontSize="25" ml={2}>
          HeroHub
        </Text>
    </Flex>

      <Flex align="center" ml="auto">
        {/* Conditional rendering for the Admin button based on the user's email */}
        {isAdminUser && (
          <Button
            ml="2"
            colorScheme="teal"
            size="sm"
            variant="outline"
          >
            Admin
          </Button>
        )}

        {/* "Log Out" button on the right with some space */}
        <Button
          colorScheme="teal"
          size="sm"
          onClick={logout}
          isLoading={isLoading}
          ml="2"
        >
          Log Out
        </Button>
        <Button colorScheme="teal" size="sm" ml={2} onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon boxSize={4} /> : <SunIcon boxSize={4} />}
        </Button>
      </Flex>
    </Flex>
  );
}

function WelcomeContainer() {
  // Use the useAuth hook to get information about the logged-in user
  const { user } = useAuth();

  return (
    <Flex
      mt={20}
      justify="center"
      align="center"
      direction="column"
      p={4}
      border="1px solid teal"
      borderRadius="md"
      maxW="600px"
    >
      {/* Replace the welcome message with the username if the user is logged in */}
      {user ? (
        <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
          Logged in as: {user.username} 🦸
        </Text>
      ) : (
        <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
          Welcome to HeroHub! 🦸
        </Text>
      )}

      <Text fontSize="sm" textAlign="center" mb={4}>
        Thank you for using our service. Explore the world of superheroes and enjoy your experience on HeroHub!
      </Text>
    </Flex>
  );
}

function HeroSearchContainer() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    race: "",
    publisher: "",
    power: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false); // New state variable
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/superheroes/multi-search", {
        params: searchParams,
      });

      // Set the search results in the state
      setSearchResults(response.data);

      // Update searchClicked to true
      setSearchClicked(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching superhero data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      mt={8}
      justify="center"
      align="center"
      direction="column"
      p={4}
      border="1px solid teal"
      borderRadius="md"
      maxW="800px"
      width="55%"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Superhero Search 🔎
      </Text>

      <Stack spacing={4} align="center">
        <Input
          name="name"
          placeholder="Enter a Name..."
          value={searchParams.name}
          onChange={handleInputChange}
        />
        <Input
          name="race"
          placeholder="Enter a Race..."
          value={searchParams.race}
          onChange={handleInputChange}
        />
        <Input
          name="publisher"
          placeholder="Enter a Publisher..."
          value={searchParams.publisher}
          onChange={handleInputChange}
        />
        <Input
          name="power"
          placeholder="Enter a Power..."
          value={searchParams.power}
          onChange={handleInputChange}
        />
      </Stack>

      <Button colorScheme="teal" mt={4} onClick={handleSearch}>
        Search for Hero
      </Button>

      {/* Display search results using the SearchResults component if search has been clicked */}
      {searchClicked && (
        <Flex mt={4} p={4} border="1px solid teal" borderRadius="md" width="100%" direction="column">
          <SearchResults results={searchResults} />
        </Flex>
      )}
    </Flex>
  );
}


// New SearchResults component with "View More" option
function SearchResults({ results }) {
  return (
    <Stack>
      <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">
        Search Results
      </Text>

      {/* Display name and publisher of each item in the results */}
      {results.map((result, index) => (
        <Fragment key={index}>
          <SuperheroItem superhero={result} />
          {index < results.length - 1 && <Divider mt={4} mb={4} />}
        </Fragment>
      ))}
    </Stack>
  );
}

function SuperheroItem({ superhero }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSearchOnDDG = () => {
    const searchQuery = superhero.name.replace(/\s+/g, '+');
    const searchUrl = `https://duckduckgo.com/?q=${searchQuery}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <Flex flexDirection="column" width="100%" mb={4}>
      {/* Superhero name with bold font */}
      <Text fontWeight="bold" fontSize="xl">
        {superhero.name}
      </Text>


      {/* Publisher line with bold font */}
      <Text>
        <span style={{ fontWeight: 'bold' }}>Publisher:</span> {superhero.Publisher}
      </Text>

      {/* "View More" button */}
      <Button size="sm" onClick={handleToggleDetails} mt={2}>
        {showDetails ? 'View Less' : 'View More'}
      </Button>

      {/* Additional details */}
      {showDetails && (
        <Flex flexDirection="column" mt={2}>
          <Text>
        <span style={{ fontWeight: 'bold' }}>Superhero Number:</span> {superhero.id}
      </Text>

          <Text>
            <span style={{ fontWeight: 'bold' }}>Gender:</span> {superhero.Gender}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Eye color:</span> {superhero['Eye color']}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Race:</span> {superhero.Race}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Hair color:</span> {superhero['Hair color']}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Height:</span> {superhero.Height}
          </Text>
          {/* Powers */}
          <Text>
            <span style={{ fontWeight: 'bold' }}>Powers:</span>{' '}
            {superhero.powers && superhero.powers.length > 0 ? superhero.powers.join(', ') : 'N/A'}
          </Text>
          {/* Search on DDG link */}
          <Text textAlign="center" mt={2}>
  <Link onClick={handleSearchOnDDG} color="teal.500" cursor="pointer">
    Open in DuckDuckGo
  </Link>
</Text>
          {/* Add more fields as needed */}
        </Flex>
      )}
    </Flex>
  );
}

//things to implement: 
//1. date modified section
//2. list management: start with displaying lists created by the logged in user
//3. public and private options for lists set by the user who created the list


function CreateList() {
  const { user } = useAuth();
  const toast = useToast();

  const [listParams, setListParams] = useState({
    name: "",
    created_by: "",
    description: "",
  });

  const [listCreated, setListCreated] = useState(false);

  useEffect(() => {
    if (user && !listParams.created_by) {
      setListParams((prevListParams) => ({
        ...prevListParams,
        created_by: user.username || "",
      }));
    }
  }, [user, listParams.created_by]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListParams((prevListParams) => ({
      ...prevListParams,
      [name]: value,
    }));
  };

  const handleCreateList = async () => {
    try {
      console.log('Request Data:', listParams);
      const response = await axios.post("http://localhost:4000/api/lists", listParams);

      setListCreated(true);

      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating list:", error);
      console.log('Server response:', error.response);

      toast({
        title: "Error",
        description: "An error occurred while creating the list.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Flex
      mt={8}
      justify="center"
      align="center"
      direction="column"
      p={4}
      border="1px solid teal"
      borderRadius="md"
      maxW="800px"
      width="55%"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Create a List 📋
      </Text>

      <Input
        name="name"
        placeholder="Enter List Name..."
        value={listParams.name}
        onChange={handleInputChange}
        width={["100%", "100%", "100%", "50%"]}
        mb={4}
      />

      {/* Remove the created_by input field */}
      {/* The created_by field is automatically set based on the logged-in user */}

      <Input
        name="description"
        placeholder="Enter List Description..."
        value={listParams.description}
        width={["100%", "100%", "100%", "50%"]}
        onChange={handleInputChange}
       
        mb={4}
      />

      <Button colorScheme="teal" mt={4} onClick={handleCreateList}>
        Create List
      </Button>

      {/* Display success message if the list is created */}
      {listCreated && (
        <Flex mt={4} p={4} border="1px solid teal" borderRadius="md" width="100%" direction="column">
          <Text fontSize="md" color="green.500">
            List created successfully!
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

function ListManagement() {
  return (
    <Flex mt={8} justify="center" align="center" direction="column" p={4} border="1px solid teal" borderRadius="md" maxW="800px" width="55%">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Your Lists 📋
      </Text>
      <MyCurrentLists />
      <AddToList />
    </Flex>
  );
}

function AddToList() {
  const [userLists, setUserLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [heroId, setHeroId] = useState("");
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch the user's lists when the component mounts
    const fetchUserLists = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/lists/created_by/${user.username}`);
        setUserLists(response.data);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    // Assuming you have access to the user object (you mentioned it in the existing code)
    fetchUserLists();
  }, [user]);

  const handleAddHeroToList = async () => {
    try {
      // Ensure both list and heroId are selected
      if (!selectedList || !heroId) {
        toast({
          title: "Error",
          description: "Please select a list and enter a valid Hero ID.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Send a PUT request to add the hero to the selected list
      const response = await axios.put(`http://localhost:4000/api/lists/${encodeURIComponent(selectedList)}`, {
        superheroIds: [parseInt(heroId, 10)], // Ensure heroId is parsed as an integer
      });

      toast({
        title: "Success",
        description: response.data,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding hero to list:", error);
      toast({
        title: "Error",
        description: "Error adding hero to list. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="column" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Add Hero to a List 🦸‍♂️
      </Text>
      <Select placeholder="Select a List" value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
        {userLists.map((listName) => (
          <option key={listName} value={listName}>
            {listName}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Enter Superhero Number"
        value={heroId}
        onChange={(e) => setHeroId(e.target.value)}
        mt={2}
      />
      <Button colorScheme="teal" mt={4} onClick={handleAddHeroToList}>
        Add Hero to List
      </Button>
    </Flex>
  );
}




function MyCurrentLists() {
  const { user } = useAuth();
  const [userLists, setUserLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listDetails, setListDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchDateModified = (listName) => {
    axios
      .get(`http://localhost:4000/api/lists/${listName}/date_modified`)
      .then((dateModifiedResponse) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: {
            ...prevDetails[listName],
            date_modified: dateModifiedResponse.data.date_modified,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching date_modified:', error);
      });
  };

  const fetchCreatedBy = (listName) => {
    axios
      .get(`http://localhost:4000/api/lists/${listName}/created_by`)
      .then((createdByResponse) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: {
            ...prevDetails[listName],
            created_by: createdByResponse.data.created_by,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching created_by:', error);
      });
  };

  const fetchHeroes = (listName) => {
    axios
      .get(`http://localhost:4000/api/lists/${listName}/heroes`)
      .then((heroesResponse) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: {
            ...prevDetails[listName],
            heroes: heroesResponse.data,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching list heroes:', error);
      });
  };

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/lists/created_by/${user.username}`);
        setUserLists(response.data);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    if (user) {
      fetchUserLists();
    }
  }, [user]);

  useEffect(() => {
    // Fetch date_modified independently when userLists change
    userLists.forEach((listName) => {
      fetchDateModified(listName);
    });

    // Fetch created_by independently when userLists change
    userLists.forEach((listName) => {
      fetchCreatedBy(listName);
    });
  }, [userLists]);

  const handleViewMore = (listName) => {
    // Set details loading to true when starting to fetch details
    setDetailsLoading(true);

    // If the selected list is the same as the one being displayed, hide details
    if (selectedList === listName) {
      setSelectedList(null);
      setDetailsLoading(false); // Set details loading to false when hiding details
    } else {
      // Set the selected list for display
      setSelectedList(listName);

      // Fetch detailed information about the selected list
      axios
        .get(`http://localhost:4000/api/lists/${listName}`)
        .then((response) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: response.data,
          }));
        })
        .catch((error) => {
          console.error('Error fetching list details:', error);
        })
        .finally(() => {
          // Set details loading to false after fetching is complete
          setDetailsLoading(false);
        });

      // Fetch heroes from the selected list
      fetchHeroes(listName);
    }
  };

  const handleHideDetails = () => {
    setSelectedList(null);
  };

  const handleDeleteList = async (listName) => {
    try {
      await axios.delete(`http://localhost:4000/api/lists/${listName}`);
      // After successfully deleting the list, update the userLists state
      setUserLists((prevUserLists) => prevUserLists.filter((name) => name !== listName));
    } catch (error) {
      console.error(`Error deleting list ${listName}:`, error);
    }
  };

  return (
    <Flex flexDirection="column" width="100%" mb={4}>
      {userLists.map((listName) => (
        <Flex key={listName} flexDirection="column" mt={4}>
          <Text fontWeight="bold" fontSize="xl">
            List Name: {listName}
          </Text>
          {/* Display Created by and Date Modified information if available */}
          <Text>
            Created by: {listDetails[listName]?.created_by || 'Not available'}
          </Text>
          <Text>
            Date Modified: {listDetails[listName]?.date_modified || 'Not available'}
          </Text>
          <Button size="sm" onClick={() => handleViewMore(listName)} mt={2}>
            {selectedList === listName ? 'Hide Details' : 'View Details'}
          </Button>
          <Button size="sm" onClick={() => handleDeleteList(listName)} mt={2}>
            Delete
          </Button>

          {selectedList === listName && listDetails[listName] && !detailsLoading && (
            <Flex flexDirection="column" mt={2}>
              <Text fontWeight="bold" mt={2} textAlign="center" fontSize="lg">
                List Details
              </Text>
              <Text>
                <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
                {listDetails[listName].description}
              </Text>
              
              {listDetails[listName].heroes && (
                <>
                  
                  {listDetails[listName].heroes.map((hero) => (
                    <Flex key={hero.info.id} flexDirection="column" mt={2}>
                      <Text>
                        <span style={{ fontWeight: 'bold' }}>Name:</span> {hero.info.name}
                      </Text>
                      <Text>
                        <span style={{ fontWeight: 'bold' }}>Publisher:</span>{' '}
                        {hero.info.Publisher}
                      </Text>
                      <Text>
                        <span style={{ fontWeight: 'bold' }}>Powers:</span>{' '}
                        {hero.info.powers.join(', ')}
                      </Text>
                      {/* Display other hero information as needed */}
                      <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                    </Flex>
                  ))}
                </>
              )}
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  );
}



function PublicLists() {
  return (
    <Flex
      mt={8}
      justify="center"
      align="center"
      direction="column"
      p={4}
      border="1px solid teal"
      borderRadius="md"
      maxW="800px"
      width="55%"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Public Hero Lists 🌎
      </Text>
      {/* Include ViewPublicLists component here */}
      <ViewPublicLists />
    </Flex>
  );
}



function ViewPublicLists() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listDetails, setListDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchDateModified = (listName) => {
    axios
      .get(`http://localhost:4000/api/lists/${listName}/date_modified`)
      .then((dateModifiedResponse) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: {
            ...prevDetails[listName],
            date_modified: dateModifiedResponse.data.date_modified,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching date_modified:', error);
      });
  };

  const fetchCreatedBy = (listName) => {
    axios
      .get(`http://localhost:4000/api/lists/${listName}/created_by`)
      .then((createdByResponse) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: {
            ...prevDetails[listName],
            created_by: createdByResponse.data.created_by,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching created_by:', error);
      });
  };

  useEffect(() => {
    // Fetch the list of all lists
    axios
      .get('http://localhost:4000/api/lists')
      .then((response) => {
        setLists(response.data);

        // Fetch detailed information for each list immediately after fetching the list names
        const detailRequests = response.data.map((listName) =>
          axios.get(`http://localhost:4000/api/lists/${listName}`)
        );

        Promise.all(detailRequests)
          .then((detailResponses) => {
            const detailsMap = {};
            detailResponses.forEach((response, index) => {
              detailsMap[response.data.listName] = response.data;
            });
            setListDetails(detailsMap);
          })
          .catch((error) => {
            console.error('Error fetching list details:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching lists:', error);
      });
  }, []);

  // Fetch date_modified independently when lists change
  useEffect(() => {
    lists.forEach((listName) => {
      fetchDateModified(listName);
    });
  }, [lists]);

  // Fetch created_by independently when lists change
  useEffect(() => {
    lists.forEach((listName) => {
      fetchCreatedBy(listName);
    });
  }, [lists]);

  const handleViewMore = (listName) => {
    // Set details loading to true when starting to fetch details
    setDetailsLoading(true);

    // If the selected list is the same as the one being displayed, hide details
    if (selectedList === listName) {
      setSelectedList(null);
      setDetailsLoading(false); // Set details loading to false when hiding details
    } else {
      // Set the selected list for display
      setSelectedList(listName);

      // Fetch detailed information about the selected list
      axios
        .get(`http://localhost:4000/api/lists/${listName}`)
        .then((response) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: response.data,
          }));

          // Fetch heroes from the selected list
          axios
            .get(`http://localhost:4000/api/lists/${listName}/heroes`)
            .then((heroesResponse) => {
              setListDetails((prevDetails) => ({
                ...prevDetails,
                [listName]: {
                  ...prevDetails[listName],
                  heroes: heroesResponse.data,
                },
              }));
            })
            .catch((error) => {
              console.error('Error fetching list heroes:', error);
            })
            .finally(() => {
              // Set details loading to false after fetching is complete
              setDetailsLoading(false);
            });
        })
        .catch((error) => {
          console.error('Error fetching list details:', error);
          setDetailsLoading(false);
        });
    }
  };

  const handleHideDetails = () => {
    setSelectedList(null);
  };

  return (
    <Flex flexDirection="column" width="100%" mb={4}>
      {lists.map((listName) => (
        <Flex key={listName} flexDirection="column" mt={4}>
          <Text fontWeight="bold" fontSize="xl">
            List Name: {listName}
          </Text>
          {/* Display Created by and Date Modified information if available */}
          <Text>
            Created by: {listDetails[listName]?.created_by || 'Not available'}
          </Text>
          <Text>
            Date Modified: {listDetails[listName]?.date_modified || 'Not available'}
          </Text>
          <Button size="sm" onClick={() => handleViewMore(listName)} mt={2}>
            {selectedList === listName ? 'Hide Details' : 'View Details'}
          </Button>

          {selectedList === listName && listDetails[listName] && !detailsLoading && (
            <Flex flexDirection="column" mt={2}>
              <Text fontWeight="bold" mt={2} textAlign="center" fontSize="lg">
                List Details
              </Text>
              <Text>
                <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
                {listDetails[listName].description}
              </Text>
              <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
              {listDetails[listName].heroes &&
                listDetails[listName].heroes.map((hero) => (
                  <Flex key={hero.info.id} flexDirection="column" mt={2}>
                    <Text>
                      <span style={{ fontWeight: 'bold' }}>Name:</span> {hero.info.name}
                    </Text>
                    <Text>
                      <span style={{ fontWeight: 'bold' }}>Publisher:</span>{' '}
                      {hero.info.Publisher}
                    </Text>
                    <Text>
                      <span style={{ fontWeight: 'bold' }}>Powers:</span>{' '}
                      {hero.info.powers.join(', ')}
                    </Text>
                    {/* Display other hero information as needed */}
                    <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                  </Flex>
                ))}
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  );
}

  








function ColorModeWrapper({ children }) {
  return (
    <ColorModeProvider options={{ useSystemColorMode: false }}>
      {children}
    </ColorModeProvider>
  );
}