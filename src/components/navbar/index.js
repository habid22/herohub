import { Flex, Link, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { DASHBOARD } from "../../lib/routes";
import { useLogout, useAuth } from "../../hooks/auth"; // Import useAuth

export default function Navbar() {
  const { logout, isLoading } = useLogout();
  const { user } = useAuth(); // Use the useAuth hook to get the current user

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
      justify="space-between" // Adjusted justify to space-between
      align="center"
      bg="white"
      px="4" // Moved the padding to the Flex container
    >
      <Flex align="center">
        <Link color="teal" as={RouterLink} to={DASHBOARD} fontWeight="bold">
          Home
        </Link>

        {/* Conditional rendering for the Admin button based on the user's email */}
        {isAdminUser && (
          <Button
            ml="2" // Add margin-left for spacing
            colorScheme="teal"
            size="sm"
            variant="outline"
          >
            Admin
          </Button>
        )}
      </Flex>

      <Flex align="center">
        <Button
          colorScheme="teal"
          size="sm"
          onClick={logout}
          isLoading={isLoading}
          ml="auto" // Move the Logout button to the right
        >
          Log Out
        </Button>
      </Flex>
    </Flex>
  );
}
