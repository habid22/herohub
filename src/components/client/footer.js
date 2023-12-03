import React, { useState } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Flex, Text, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";



// Footer component
export default function Footer() {
    const [currentPolicy, setCurrentPolicy] = useState(null);
    const policies = [
      { name: "Security Policy", modalContent: <SecurityPolicyContent /> },
      { name: "Privacy Policy", modalContent: <PrivacyPolicyContent /> },
      { name: "Acceptable Use Policy", modalContent: <AcceptableUsePolicyContent /> },
      { name: "DMCA Policy", modalContent: <DMCATakedownPolicy /> },
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
  
        {/* "HeroHub Copyright" section */}
        <Text fontSize="sm" mb={2}>
          HeroHub Copyright © {new Date().getFullYear()}
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
        For inquiries or concerns regarding privacy, users can contact the HeroHub privacy team at hassanaminsheikh@gmail.com.
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
        <br />
        <br />
        {"\n"} - Posting offensive or inappropriate content.
        <br />
        <br />
        {"\n"} - Engaging in harassment or bullying.
        <br />
        <br />
        {"\n"} - Unauthorized access to accounts or systems.
        <br />
        <br />
        {"\n"} - Distribution of malicious software.
        <br />
        <br />
        {"\n"} - Violation of intellectual property rights.
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text fontWeight="bold">
        3. User Responsibilities:
      </Text>
      <Text>
        Users are responsible for their actions on HeroHub. This includes:
        <br />
        <br />
        {"\n"} - Providing accurate and truthful information.
        <br />
        <br />
        {"\n"} - Respecting the rights and privacy of other users.
        <br />
        <br />
        {"\n"} - Reporting any security vulnerabilities responsibly.
        <br />
        <br />
        {"\n"} - Complying with applicable laws and regulations.
        
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text fontWeight="bold">
        4. Consequences of Violation:
      </Text>
      <Text>
        Violation of this Acceptable Use Policy may result in consequences, including but not limited to:
        <br />
        <br />
        {"\n"} - Account suspension or termination.
        <br />
        <br />
        {"\n"} - Removal of offensive content.
        <br />
        <br />
        {"\n"} - Legal action for serious violations.
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text fontWeight="bold">
        5. Reporting Violations:
      </Text>
      <Text>
        Users are encouraged to report any violations of this policy promptly. Reports can be submitted to the HeroHub support team at hassanaminsheikh@gmail.com.
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
        For inquiries or concerns related to the Acceptable Use Policy, users can contact the HeroHub support team at hassanaminsheikh@gmail.com.
      </Text>
      <Divider mt={2} mb={2} />
    </>
  );
  
  const DMCATakedownPolicy = () => (
    <div style={{ textAlign: 'left' }}>
      <Text fontWeight="bold" textAlign={"center"}>
        HeroHub DMCA Takedown Policy:
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text>
        HeroHub respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act ("DMCA"), we have established the following policy regarding copyright infringement and the removal of infringing content.
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text fontWeight="bold">
        Reporting Copyright Infringement:
      </Text>
      <Text>
        If you believe that your copyrighted work has been used on HeroHub in a way that constitutes copyright infringement, please send a written notification to our designated agent.
      </Text>
      <Divider mt={2} mb={2} />
      <Text fontWeight={"bold"}>
        Contact Email: hassanaminsheikh@gmail.com
      </Text>
      <Text>
        Please include the following information in your notification:
        <br />
        <br />
        1. A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.
        <br />
        <br />
        2. Identification of the copyrighted work claimed to have been infringed.
        <br />
        <br />
        3. Identification of the material that is claimed to be infringing or to be the subject of infringing activity.
        <br />
        <br />
        4. Contact information of the notifier, including address, telephone number, and email address.
        <br />
        <br />
        5. A statement that the notifier has a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.
        <br />
        <br />
        6. A statement, made under penalty of perjury, that the information provided is accurate and that the notifier is the copyright owner or is authorized to act on behalf of the owner.
      </Text>
      <Divider mt={2} mb={2} />
  
      <Text textAlign={"center"} fontWeight={"bold"}>
        Please note that repeated infringers will have their accounts terminated, and HeroHub reserves the right to take appropriate action under the DMCA and other applicable laws.
      </Text>
    </div>
  );