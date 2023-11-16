import { Box, Center, FormLabel, Heading, Input, FormControl, FormErrorMessage, Button, Text, Link } from "@chakra-ui/react";
import { REGISTER } from "../../lib/routes";
import { Link as RouterLink } from "react-router-dom";




export default function Login() {

  return (
    <Center w="100%" h="100vh">
      <Box mx="1" maxW="md" p="9" borderWidth="1px" borderRadius="lg">
        <Heading mb="4" size="lg" textAlign="center">
          Log In
        </Heading>

        <form onSubmit={() => {}}>
          <FormControl isInvalid={true} py="2">
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Enter your email here..." />
            <FormErrorMessage>Invalid Email!</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={true} py="2">
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Enter your password here..." />
            <FormErrorMessage>Invalid Password!</FormErrorMessage>
          </FormControl>


          <Button
            mt="4"
            type="submit"
            colorScheme="teal"
            size="md"
            w="full"
            isLoading={true}
            loadingText="Logging In"
          >
            Log In
          </Button>
          </form>
          <Text fontSize="xlg" align="center" mt="6">
          Don't have an account?{" "}
          <Link
            as={RouterLink}
            to={REGISTER}
            color="teal.800"
            fontWeight="medium"
            textDecor="underline"
            _hover={{ background: "teal.100" }}
          >
            Register here
          </Link>{" "}
          instead!
        </Text>
        
        

       
      </Box>
    </Center>
  );
  
}
