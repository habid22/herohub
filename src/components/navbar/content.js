// Content.js

import React, { useState, Fragment } from "react";
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
  
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { LOGIN, REGISTER } from "../../lib/routes";
import { FaSuperpowers, FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import { Link as ChakraLink } from "@chakra-ui/react";


export default function Content() {
  return (
    <ChakraProvider>
      <CSSReset />
      <ColorModeWrapper>
        <Flex direction="column" align="center" minH="100vh">
          <Header />
          <WelcomeContainer />
          <HeroSearchContainer />
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


function Footer() {
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const policies = [
    { name: "Security Policy", modalContent: <SecurityPolicyContent /> },
    { name: "Privacy Policy", modalContent: <PrivacyPolicyContent /> },
    { name: "Acceptable Use Policy", modalContent: <AcceptableUsePolicyContent /> },
    { name: "DMCA Policy", modalContent: "Content for DMCA Policy" },
    // Add more policies as needed
  ];

  const openPolicyModal = (policy) => {
    setCurrentPolicy(policy);
  };

  const closePolicyModal = () => {
    setCurrentPolicy(null);
  };

  return (
    <Flex
      as="footer"
      justify="center"
      align="center"
      direction="column"
      mt={8}
      p={4}
      borderTop="1px solid teal"
    >
      <Text fontSize="sm" mb={2}>
        {policies.map((policy) => (
          <ChakraLink key={policy.name} onClick={() => openPolicyModal(policy)} mr={4}>
            {policy.name}
          </ChakraLink>
        ))}
      </Text>

      {/* Dynamic Policy Modal */}
      {currentPolicy && (
        <Modal isOpen={Boolean(currentPolicy)} onClose={closePolicyModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{currentPolicy.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{currentPolicy.modalContent}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}

const SecurityPolicyContent = () => (
  <>
    <Text fontWeight="bold" textAlign="center">
      HeroHub Security Policy:
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      1. User Registration and Authentication:
    </Text>
    <Text>
      HeroHub requires users to register with a valid email address, username, and password. Passwords are securely encrypted, and account lockout mechanisms are in place after multiple failed login attempts.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      2. Data Privacy and Protection:
    </Text>
    <Text>
      HeroHub is committed to protecting user data through encryption, data minimization practices, and explicit user consent during the registration process.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      3. Account Management:
    </Text>
    <Text>
      Admins have the authority to disable user accounts if there are violations of HeroHub's terms of service or other rules. Users can initiate a secure account recovery process in case of forgotten passwords.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      4. Security Updates:
    </Text>
    <Text>
      HeroHub regularly updates its software and systems to address potential security vulnerabilities, and users are encouraged to keep their browsers and devices up-to-date.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      5. Reporting Security Issues:
    </Text>
    <Text>
      HeroHub appreciates the cooperation of its user community in identifying and reporting security issues. Users are encouraged to report vulnerabilities promptly to the HeroHub security team.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      6. Compliance with Laws and Regulations:
    </Text>
    <Text>
      HeroHub operates in compliance with relevant data protection laws and regulations.
    </Text>
    <Divider mt={2} mb={2} />
  </>
);

const PrivacyPolicyContent = () => (
  <>
    <Text fontWeight="bold" textAlign="center">
      HeroHub Privacy Policy:
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      1. Information Collection:
    </Text>
    <Text>
      HeroHub collects certain information during the registration process, such as email addresses, usernames, and encrypted passwords. Additionally, anonymous usage data may be collected to improve the overall user experience.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      2. Use of Collected Information:
    </Text>
    <Text>
      The collected information is used to provide and improve HeroHub's services. User data is treated with the utmost confidentiality and is not shared with third parties without user consent, except as required by law.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      3. Cookies and Tracking Technologies:
    </Text>
    <Text>
      HeroHub may use cookies and similar tracking technologies to enhance user experience and gather information about how the platform is used. Users can control cookie preferences through their browser settings.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      4. User Control and Opt-Out:
    </Text>
    <Text>
      Users have the right to control their personal information and can opt-out of certain data collection practices. HeroHub provides tools within user settings to manage privacy preferences.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      5. Security Measures:
    </Text>
    <Text>
      HeroHub employs industry-standard security measures to protect user information. This includes encryption, secure access controls, and regular security audits.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      6. Updates to the Privacy Policy:
    </Text>
    <Text>
      HeroHub may update its Privacy Policy to reflect changes in legal or operational practices. Users will be notified of any significant changes, and their continued use of the platform implies acceptance of the updated policy.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      7. Contact Information:
    </Text>
    <Text>
      For inquiries or concerns regarding privacy, users can contact the HeroHub privacy team at [privacy@herohub.com](mailto:privacy@herohub.com).
    </Text>
    <Divider mt={2} mb={2} />
  </>
);

const AcceptableUsePolicyContent = () => (
  <>
    <Text fontWeight="bold" textAlign="center">
      HeroHub Acceptable Use Policy:
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      1. Purpose:
    </Text>
    <Text>
      HeroHub provides a platform for superhero enthusiasts to explore and share information. This Acceptable Use Policy outlines the expected behavior and guidelines to ensure a positive and secure environment for all users.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      2. Prohibited Activities:
    </Text>
    <Text>
      Users are prohibited from engaging in activities that may harm the integrity of HeroHub or violate the rights of others. Prohibited activities include but are not limited to:
      {"\n"} - Posting offensive or inappropriate content.
      {"\n"} - Engaging in harassment or bullying.
      {"\n"} - Unauthorized access to accounts or systems.
      {"\n"} - Distribution of malicious software.
      {"\n"} - Violation of intellectual property rights.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      3. User Responsibilities:
    </Text>
    <Text>
      Users are responsible for their actions on HeroHub. This includes:
      {"\n"} - Providing accurate and truthful information.
      {"\n"} - Respecting the rights and privacy of other users.
      {"\n"} - Reporting any security vulnerabilities responsibly.
      {"\n"} - Complying with applicable laws and regulations.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      4. Consequences of Violation:
    </Text>
    <Text>
      Violation of this Acceptable Use Policy may result in consequences, including but not limited to:
      {"\n"} - Account suspension or termination.
      {"\n"} - Removal of offensive content.
      {"\n"} - Legal action for serious violations.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      5. Reporting Violations:
    </Text>
    <Text>
      Users are encouraged to report any violations of this policy promptly. Reports can be submitted to the HeroHub support team at [abuse@herohub.com](mailto:abuse@herohub.com).
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      6. Policy Updates:
    </Text>
    <Text>
      HeroHub may update this Acceptable Use Policy to reflect changes in legal or operational practices. Users will be notified of any significant changes.
    </Text>
    <Divider mt={2} mb={2} />

    <Text fontWeight="bold">
      7. Contact Information:
    </Text>
    <Text>
      For inquiries or concerns related to the Acceptable Use Policy, users can contact the HeroHub support team at [support@herohub.com](mailto:support@herohub.com).
    </Text>
    <Divider mt={2} mb={2} />
  </>
);




function ColorModeWrapper({ children }) {
  return (
    <ColorModeProvider options={{ useSystemColorMode: false }}>
      {children}
    </ColorModeProvider>
  );
}
