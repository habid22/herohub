// PublicNavbar.js

import React from "react";
import { Flex, Button, Text, Icon } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LOGIN, REGISTER } from "../../lib/routes";
import { FaSuperpowers } from "react-icons/fa"; // Import a superhero icon from a library (e.g., react-icons)

export default function PublicNavbar() {
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
          Create an Account
        </Button>

        <Button colorScheme="teal" as={RouterLink} to={LOGIN} size="sm">
          Log In
        </Button>
      </Flex>
    </Flex>
  );
}
