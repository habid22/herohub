// Content.js

import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { LOGIN, REGISTER } from "../../lib/routes";
import { FaSuperpowers, FaMoon, FaSun, FaSearch } from "react-icons/fa";

export default function Content() {
  return (
    <ChakraProvider>
      <CSSReset />
      <ColorModeWrapper>
        <Flex direction="column" align="center" minH="100vh">
          <Header />
          <WelcomeContainer />
          <HeroSearchContainer />
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    // Make a request to the server with search parameters
    const apiUrl = `/api/superheroes/multi-search?name=${searchParams.name}&race=${searchParams.race}&publisher=${searchParams.publisher}&power=${searchParams.power}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error('Invalid response format: expected an array', data);
          throw new Error('Invalid response format');
        }
        setSearchResults(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSearchResults([]);
      });
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
      width="31.5%"
    >
      <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
        Superhero Search 🔍
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
        <Icon as={FaSearch} boxSize={4} />
        Search for Hero
      </Button>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <Flex direction="column" mt={4}>
          <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={2}>
            Search Results
          </Text>
          {searchResults.map((superhero, index) => (
            <Flex
              key={index}
              border="1px solid teal"
              borderRadius="md"
              p={4}
              mb={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Name: {superhero.name}</Text>
              <Text>Gender: {superhero.Gender}</Text>
              <Text>Eye color: {superhero['Eye color']}</Text>
              <Text>Race: {superhero.Race}</Text>
              <Text>Hair color: {superhero['Hair color']}</Text>
              {/* Add more properties as needed */}
            </Flex>
          ))}
        </Flex>
      )}
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
