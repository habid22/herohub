// Content.js

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,

  
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { LOGIN, REGISTER } from "../../lib/routes";
import { FaSuperpowers, FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import Footer from "./footer";
import { useLogout, useAuth } from "../../hooks/auth"; // Import useAuth


export default function Content() {
  return (
    <ChakraProvider>
      <CSSReset />
      <ColorModeWrapper>
        <Flex direction="column" align="center" minH="100vh">
          <Header />
          <WelcomeContainer />
          <HeroSearchContainer />
          <PublicLists />
          <Footer />
        </Flex>
      </ColorModeWrapper>
    </ChakraProvider>
  );
}

function Header() {
  const { toggleColorMode, colorMode } = useColorMode();

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

      <Flex align="center">
        <Button colorScheme="teal" as={RouterLink} to={REGISTER} size="sm" mr={2}>
          Create Account
        </Button>

        <Button colorScheme="teal" as={RouterLink} to={LOGIN} size="sm">
          Log In
        </Button>

        <Button colorScheme="teal" size="sm" ml={2} onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon boxSize={4} /> : <SunIcon boxSize={4} />}
        </Button>
      </Flex>
    </Flex>
  );
}

function WelcomeContainer() {
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
      <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
        Welcome to HeroHub! 🦸
      </Text>

      <Text fontSize="sm" textAlign="center" mb={4}>
        HeroHub is your go-to website for exploring the world of superheroes. Search for your favorite heroes, discover their incredible powers, and get detailed information about their background and story. Whether you're a casual fan or a dedicated enthusiast, HeroHub has you covered.
      </Text>

      <Text fontSize="sm" textAlign="center">
        To unlock even more functionalities and personalized features, create an account today. Join the community of superhero enthusiasts and take your superhero experience to the next level. Don't miss out on the excitement, {" "}
        <Link as={RouterLink} to={REGISTER} color="teal.500">
          sign up now!
        </Link>
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
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
  const [fetchedComments, setFetchedComments] = useState([]);
  const { user } = useAuth();
  const isAdminUser = false;

  const fetchDateModified = (listName) => {
    axios
      .get(`/api/lists/${listName}/date_modified`)
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
      .get(`/api/lists/${listName}/created_by`)
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
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/lists');
        const visibleLists = [];

        for (const listName of response.data) {
          const visibilityResponse = await axios.get(`/api/lists/${listName}/visibility`);
          if (visibilityResponse.data.isVisible) {
            visibleLists.push(listName);
          }
        }

        setLists(visibleLists);

        const detailRequests = visibleLists.map((listName) =>
          axios.get(`/api/lists/${listName}`)
        );

        const detailResponses = await Promise.all(detailRequests);

        const detailsMap = {};
        detailResponses.forEach((response, index) => {
          detailsMap[response.data.listName] = response.data;
        });

        setListDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    lists.forEach((listName) => {
      fetchDateModified(listName);
    });
  }, [lists]);

  useEffect(() => {
    lists.forEach((listName) => {
      fetchCreatedBy(listName);
    });
  }, [lists]);

  const sortedLists = [...lists].sort(
    (a, b) => new Date(listDetails[b]?.date_modified) - new Date(listDetails[a]?.date_modified)
  );

  const handleViewMore = (listName) => {
    setDetailsLoading(true);

    if (selectedList === listName) {
      setSelectedList(null);
      setDetailsLoading(false);
    } else {
      setSelectedList(listName);

      axios
        .get(`/api/lists/${listName}`)
        .then((response) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: response.data,
          }));

          axios
            .get(`/api/lists/${listName}/heroes`)
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

  const handleAddComment = () => {
    if (!selectedList) {
      console.error('No selected list to add comment to');
      return;
    }

    axios
      .put(`/api/lists/${selectedList}/comments`, {
        comment: `${user.username} commented: ${commentInput}`,
      })
      .then((response) => {
        console.log(response.data);
        setCommentModalOpen(false);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const handleCommentModalToggle = () => {
    setCommentModalOpen(!isCommentModalOpen);
  };

  const handleViewCommentsToggle = () => {
    if (!selectedList) {
      console.error('No selected list to view comments');
      return;
    }

    axios
      .get(`/api/lists/${selectedList}/comments`)
      .then((response) => {
        setFetchedComments(response.data.comments);
        setCommentsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleDeleteComment = (index) => {
    if (!selectedList) {
      console.error('No selected list to update comment visibility');
      return;
    }

    axios
      .put(`/api/lists/${selectedList}/comments/${index}/visibility`, { visibility: false })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error updating comment visibility:', error);
      });
  };

  const handleShowComment = (index) => {
    if (!selectedList) {
      console.error('No selected list to update comment visibility');
      return;
    }

    axios
      .put(`/api/lists/${selectedList}/comments/${index}/visibility/true`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error updating comment visibility:', error);
      });
  };

  return (
    <Flex flexDirection="column" width="100%" mb={4}>
      {sortedLists.map((listName) => (
        <Flex key={listName} flexDirection="column" mt={4}>
          <Text fontWeight="bold" fontSize="xl">
            List Name: {listName}
          </Text>
          <Text>
            Created by: {listDetails[listName]?.created_by || 'Not available'}
          </Text>
          <Text>
            Date Modified: {listDetails[listName]?.date_modified || 'Not available'}
          </Text>
          <Button size="sm" onClick={() => handleViewMore(listName)} mt={2}>
            {selectedList === listName ? 'Hide Details' : 'View Details'}
          </Button>
          {selectedList === listName && (
            <>
              <Button size="sm" onClick={handleViewCommentsToggle} mt={2}>
                View Comments
              </Button>
            </>
          )}

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
                    <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                  </Flex>
                ))}
              <Modal isOpen={isCommentModalOpen} onClose={handleCommentModalToggle} size="xl">
                <ModalOverlay />
                {/* Add your modal content for authenticated users here */}
              </Modal>
              <Modal isOpen={isCommentsModalOpen} onClose={() => setCommentsModalOpen(false)} size="full">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>View Comments</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {Array.isArray(fetchedComments) && fetchedComments.length > 0 ? (
                      fetchedComments
                        .filter((comment) => (isAdminUser || comment.visibility) ? comment : null)
                        .map((comment, index) => (
                          <div
                            key={index}
                            style={{
                              borderBottom: '1px solid #f5f5f5',
                              padding: '10px 0',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>{comment.text}</div>
                            {isAdminUser && (
                              <div>
                                <Button
                                  colorScheme="red"
                                  onClick={() => handleDeleteComment(index, false)}
                                  mr={2}
                                >
                                  Hide
                                </Button>
                                <Button
                                  colorScheme="green"
                                  onClick={() => handleShowComment(index)}
                                >
                                  Show
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                    ) : (
                      <div>No comments available</div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="teal" onClick={() => setCommentsModalOpen(false)}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
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
