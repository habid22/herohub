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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,

} from "@chakra-ui/react";
import { useLogout, useAuth } from "../../hooks/auth"; // Import useAuth
import { FaSuperpowers } from "react-icons/fa";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import axios from "axios";
import { db } from "../../lib/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { doc, updateDoc, query, where } from "firebase/firestore";

// Components from other files
import Footer from "./footer";
import MyCurrentLists from "./currentlists";
import ViewPublicLists from "./viewpubliclists";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


// Add this function inside your Header component
const deactivateUser = async (username) => {
  try {
    // Find the user document with the given username
    const userSnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
    const userDoc = userSnapshot.docs[0];

    // Update the 'username' field of the user document to include "(deactivated)"
    await updateDoc(doc(db, 'users', userDoc.id), {
      username: `${username} (deactivated)`
    });

    console.log(`User ${username} has been deactivated.`);
  } catch (error) {
    console.error("Error deactivating user:", error);
  }
};

const activateUser = async (username) => {
  try {
    // Append "(deactivated)" to the username
    const deactivatedUsername = `${username} (deactivated)`;

    // Find the user document with the given username
    const userSnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', deactivatedUsername)));
    
    // Check if the user document exists
    if (userSnapshot.empty) {
      console.error(`No user found with the username: ${deactivatedUsername}`);
      return;
    }

    const userDoc = userSnapshot.docs[0];

    // Update the 'username' field of the user document to remove "(deactivated)"
    await updateDoc(doc(db, 'users', userDoc.id), {
      username: username
    });

    console.log(`User ${username} has been activated.`);
  } catch (error) {
    console.error("Error activating user:", error);
  }
};

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
      <Footer />
    </Flex>
    </ColorModeWrapper>
  </ChakraProvider>
  );

  }

  function Header() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { logout, isLoading } = useLogout();
  const { user } = useAuth();
  const isAdminUser = user?.email === "hassanaminsheikh@gmail.com";
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [usernames, setUsernames] = useState([]);
  console.log(db)

  const openAdminModal = () => {
    setAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setAdminModalOpen(false);
  };

  useEffect(() => {
    if (isAdminModalOpen) {
      // Fetch usernames from Firestore and update state
      const fetchUsernames = async () => {
        try {
          // Reference the 'users' collection
          const usersCollection = collection(db, 'users');
  
          // Retrieve a snapshot of the documents in the collection
          const usersSnapshot = await getDocs(usersCollection);
  
          // Map through the documents and extract the 'username' field
          const usernamesArray = usersSnapshot.docs.map((doc) => {
            const userData = doc.data();
            return userData.username;
          });
  
          setUsernames(usernamesArray);
        } catch (error) {
          console.error("Error fetching usernames:", error);
        }
      };
  
      fetchUsernames();
    }
  }, [isAdminModalOpen]);

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
        {isAdminUser && (
          <Button
            ml="2"
            colorScheme="teal"
            size="sm"
            variant="outline"
            onClick={openAdminModal}
          >
            Admin
          </Button>
        )}

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

      {/* Admin Modal */}
      <Modal isOpen={isAdminModalOpen} onClose={closeAdminModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Admin Panel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text fontWeight="bold" fontSize="xl" textAlign="center">
          Superhero Hub Users:
          </Text>
          <Text >
          <br/>
          </Text>
          {usernames.map((username, index) => (
            <Box
            key={username}
            p={2}
            mb={2}
            borderRadius="md"
            backgroundColor="teal.500"
            color="white"
            fontWeight="bold"
            fontSize="lg"
            width="30%"
            mx="auto"
            position="relative" // Add position relative to position the button
          >
            {username}
            <Flex
              position="absolute"
              top="50%"
              right="5%"
              transform="translateY(-50%)"
            >


              <Button colorScheme="green" size="sm" right="5%" onClick={() => activateUser(username.replace(' (deactivated)', ''))}>
                Activate
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => deactivateUser(username)}>
                Disable
              </Button>
            </Flex>
          </Box>
          ))}
        </ModalBody>
                  <ModalFooter>
            <Button colorScheme="teal" onClick={closeAdminModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      const response = await axios.get('/api/superheroes/multi-search', {
        params: searchParams,
      });
  
      // Set the search results in the state
      setSearchResults(response.data);
  
      // Update searchClicked to true
      setSearchClicked(true);
    } catch (error) {
      // Handle error
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
      <UpdateDescriptionList />
      <DeleteFromList />
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
    const fetchUserLists = async () => {
      try {
        const response = await axios.get(`/api/lists/created_by/${user.username}`);
        setUserLists(response.data);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    if (user) {
      fetchUserLists();
    }
  }, [user]);

  const handleAddHeroToList = async () => {
    try {
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

      const response = await axios.put(`/api/lists/${encodeURIComponent(selectedList)}`, {
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
      <Select
        placeholder="Select a List"
        value={selectedList}
        onChange={(e) => setSelectedList(e.target.value)}
      >
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



function UpdateDescriptionList() {
  const [userLists, setUserLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const response = await axios.get(`/api/lists/created_by/${user.username}`);
        setUserLists(response.data);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    if (user) {
      fetchUserLists();
    }
  }, [user]);

  const handleUpdateDescription = async () => {
    try {
      if (!selectedList || !newDescription) {
        toast({
          title: "Error",
          description: "Please select a list and enter a valid description.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.patch(
        `/api/lists/${encodeURIComponent(selectedList)}/description`,
        {
          description: newDescription,
        }
      );

      toast({
        title: "Success",
        description: response.data,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating list description:", error);
      toast({
        title: "Error",
        description: "Error updating list description. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="column" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Update List Description 📋
      </Text>
      <Select
        placeholder="Select a List"
        value={selectedList}
        onChange={(e) => setSelectedList(e.target.value)}
      >
        {userLists.map((listName) => (
          <option key={listName} value={listName}>
            {listName}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Enter New Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        mt={2}
      />
      <Button colorScheme="teal" mt={4} onClick={handleUpdateDescription}>
        Update Description
      </Button>
    </Flex>
  );
}



function DeleteFromList() {
  const [userLists, setUserLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [heroName, setHeroName] = useState("");
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const response = await axios.get(`/api/lists/created_by/${user.username}`);
        setUserLists(response.data);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    if (user) {
      fetchUserLists();
    }
  }, [user]);

  const handleDeleteHeroFromList = async () => {
    try {
      if (!selectedList || !heroName) {
        toast({
          title: "Error",
          description: "Please select a list and enter a valid Hero Name.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.delete(
        `/api/lists/${encodeURIComponent(selectedList)}/heroes/${encodeURIComponent(heroName)}`
      );

      toast({
        title: "Success",
        description: response.data,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting hero from list:", error);
      toast({
        title: "Error",
        description: "Error deleting hero from list. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="column" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Delete Hero from a List 🗑️
      </Text>
      <Select
        placeholder="Select a List"
        value={selectedList}
        onChange={(e) => setSelectedList(e.target.value)}
      >
        {userLists.map((listName) => (
          <option key={listName} value={listName}>
            {listName}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Enter Superhero Name"
        value={heroName}
        onChange={(e) => setHeroName(e.target.value)}
        mt={2}
      />
      <Button colorScheme="teal" mt={4} onClick={handleDeleteHeroFromList}>
        Delete Hero from List
      </Button>
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
function ColorModeWrapper({ children }) {
  return (
    <ColorModeProvider options={{ useSystemColorMode: false }}>
      {children}
    </ColorModeProvider>
  );
}