// Content.js

import React from "react";
import { Flex, Button, Text, Icon, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LOGIN, REGISTER } from "../../lib/routes";
import { FaSuperpowers } from "react-icons/fa"; // Import a superhero icon from a library (e.g., react-icons)

export default function Content() {
  return (
    <Flex direction="column" align="center" minH="100vh">
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
        bg="white"
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
        </Flex>
      </Flex>

      {/* Styled and centered container */}
      <Flex
        mt={20}
        justify="center"
        align="center"
        direction="column" // Align content in a column
        p={4}
        border="1px solid teal"
        borderRadius="md"
        maxW="600px"
      >
        <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
          Welcome to  HeroHub! 🦸☄️
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
    </Flex>
  );
}
