import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorMode,
  Icon,
  Flex,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiSend } from "react-icons/fi";
import { useDarkMode } from "../DarkModeContext.jsx";

export default function JobApplicationForm() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  
  React.useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    coverLetter: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Please select a PDF file");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('resume', resumeFile);

      await API.post("/job-application/create", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Application submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        coverLetter: "",
      });
      setResumeFile(null);
      document.getElementById("resume-input").value = "";
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "gray.900" : "gray.50"} py={12}>
      <Container maxW="4xl">
        {/* Header Section */}
        <VStack spacing={8} mb={12} textAlign="center">
          <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
            Join Our Team
          </Badge>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="bold"
          >
            Job Application
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Take the next step in your career journey. Submit your application and let's build something amazing together.
          </Text>
        </VStack>

        {/* Application Form */}
        <Card
          bg={colorMode === "dark" ? "gray.800" : "white"}
          shadow="2xl"
          borderRadius="2xl"
          overflow="hidden"
        >
          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Personal Information */}
                <Box w="full">
                  <Heading size="md" mb={4} color="blue.500">
                    Personal Information
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>
                        <HStack>
                          <Icon as={FiUser} />
                          <Text>Full Name</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        size="lg"
                        borderRadius="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>
                        <HStack>
                          <Icon as={FiMail} />
                          <Text>Email Address</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        size="lg"
                        borderRadius="lg"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired mt={4}>
                    <FormLabel>
                      <HStack>
                        <Icon as={FiPhone} />
                        <Text>Phone Number</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      size="lg"
                      borderRadius="lg"
                    />
                  </FormControl>
                </Box>

                {/* Cover Letter */}
                <Box w="full">
                  <Heading size="md" mb={4} color="blue.500">
                    Cover Letter
                  </Heading>
                  <FormControl isRequired>
                    <FormLabel>
                      <HStack>
                        <Icon as={FiFileText} />
                        <Text>Tell us about yourself</Text>
                      </HStack>
                    </FormLabel>
                    <Textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Write a brief cover letter explaining why you're interested in this position..."
                      rows={6}
                      size="lg"
                      borderRadius="lg"
                    />
                  </FormControl>
                </Box>

                {/* Resume Upload */}
                <Box w="full">
                  <Heading size="md" mb={4} color="blue.500">
                    Resume Upload
                  </Heading>
                  <FormControl isRequired>
                    <FormLabel>
                      <HStack>
                        <Icon as={FiUpload} />
                        <Text>Upload Resume (PDF only)</Text>
                      </HStack>
                    </FormLabel>
                    <Box
                      border="2px dashed"
                      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                      borderRadius="lg"
                      p={6}
                      textAlign="center"
                      _hover={{
                        borderColor: "blue.400",
                        bg: colorMode === "dark" ? "gray.700" : "blue.50"
                      }}
                      transition="all 0.2s"
                    >
                      <Input
                        id="resume-input"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        display="none"
                      />
                      <VStack spacing={2}>
                        <Icon as={FiUpload} size="2xl" color="blue.400" />
                        <Text fontWeight="medium">
                          {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          PDF files only, max 10MB
                        </Text>
                        <Button
                          as="label"
                          htmlFor="resume-input"
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          cursor="pointer"
                        >
                          Choose File
                        </Button>
                      </VStack>
                    </Box>
                  </FormControl>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  leftIcon={<Icon as={FiSend} />}
                  isLoading={isSubmitting}
                  loadingText="Submitting Application..."
                  borderRadius="lg"
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, purple.600)",
                    transform: "translateY(-2px)",
                    shadow: "xl"
                  }}
                  transition="all 0.2s"
                >
                  Submit Application
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Footer Text */}
        <Text textAlign="center" mt={8} color="gray.500">
          We'll review your application and get back to you within 2-3 business days.
        </Text>
      </Container>
    </Box>
  );
}