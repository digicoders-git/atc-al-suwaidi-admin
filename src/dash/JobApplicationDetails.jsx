import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useColorMode,
  Badge,
  Image,
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function JobApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await API.get(`/job-application/get/${id}`);
        if (res.data.success && res.data.data) {
          setApplication(res.data.data);
        } else {
          toast.error("Application not found");
          navigate("/job-applications");
        }
      } catch (error) {
        toast.error("Failed to fetch application details");
        navigate("/job-applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  if (!application) {
    return (
      <Box textAlign="center" py={16}>
        <Text>Application not found</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading>Job Application Details</Heading>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/edit-job-application/${application._id}`)}
        >
          Edit Application
        </Button>
      </HStack>

      <Box
        bg={colorMode === "dark" ? "gray.800" : "white"}
        p={6}
        borderRadius="lg"
        shadow="md"
      >
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Full Name
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              {application.fullName}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Email
            </Text>
            <Text fontSize="lg">{application.email}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Phone Number
            </Text>
            <Text fontSize="lg">{application.phoneNumber}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Cover Letter
            </Text>
            <Text fontSize="md" whiteSpace="pre-wrap">
              {application.coverLetter}
            </Text>
          </Box>

          {application.resume?.path && (
            <Box>
              <Text fontSize="sm" color="gray.500" mb={2}>
                Resume
              </Text>
              <Button
                as="a"
                href={application.resume.path}
                target="_blank"
                rel="noreferrer"
                colorScheme="blue"
                variant="outline"
                size="sm"
              >
                View Resume PDF
              </Button>
            </Box>
          )}

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Applied On
            </Text>
            <Badge colorScheme="blue">
              {new Date(application.createdAt).toLocaleString("en-IN")}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Last Updated
            </Text>
            <Badge colorScheme="green">
              {new Date(application.updatedAt).toLocaleString("en-IN")}
            </Badge>
          </Box>
        </VStack>

        <HStack mt={6} spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => navigate(`/edit-job-application/${application._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/job-applications")}
          >
            Back to Applications
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}