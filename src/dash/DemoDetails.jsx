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
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function DemoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(null);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await API.get(`${import.meta.env.VITE_BASE_URL}/demo/get`);
        const foundDemo = res.data.data.find(d => d._id === id);
        if (foundDemo) {
          setDemo(foundDemo);
        } else {
          toast.error("Demo not found");
          navigate("/demo");
        }
      } catch (error) {
        toast.error("Failed to fetch demo details");
        navigate("/demo");
      } finally {
        setLoading(false);
      }
    };

    fetchDemo();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  if (!demo) {
    return (
      <Box textAlign="center" py={16}>
        <Text>Demo not found</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading>Demo Details</Heading>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/edit-demo/${demo._id}`)}
        >
          Edit Demo
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
              Name
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              {demo.name}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Email
            </Text>
            <Text fontSize="lg">{demo.email}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Mobile
            </Text>
            <Text fontSize="lg">{demo.mobile}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Message
            </Text>
            <Text fontSize="md" whiteSpace="pre-wrap">
              {demo.message}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Created At
            </Text>
            <Badge colorScheme="blue">
              {new Date(demo.createdAt).toLocaleString("en-IN")}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Last Updated
            </Text>
            <Badge colorScheme="green">
              {new Date(demo.updatedAt).toLocaleString("en-IN")}
            </Badge>
          </Box>
        </VStack>

        <HStack mt={6} spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => navigate(`/edit-demo/${demo._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/demo")}
          >
            Back to Demo
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}