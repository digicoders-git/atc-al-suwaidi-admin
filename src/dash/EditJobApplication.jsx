import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  useColorMode,
  Text,
  Link,
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function EditJobApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    coverLetter: "",
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await API.get(`/job-application/get/${id}`);
        if (res.data.success && res.data.data) {
          const application = res.data.data;
          setFormData({
            fullName: application.fullName,
            email: application.email,
            phoneNumber: application.phoneNumber,
            coverLetter: application.coverLetter,
          });
          setCurrentResume(application.resume);
        }
      } catch (error) {
        toast.error("Failed to fetch application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }
      await API.put(`/job-application/update/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Application updated successfully");
      navigate("/job-applications");
    } catch (error) {
      toast.error("Failed to update application");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6}>Edit Job Application</Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        p={6}
        borderRadius="lg"
        shadow="md"
      >
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cover Letter</FormLabel>
            <Textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Enter cover letter"
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Resume (PDF)</FormLabel>
            {currentResume?.path && (
              <Box mb={2}>
                <Text fontSize="sm" color="gray.500">Current Resume:</Text>
                <Link href={currentResume.path} target="_blank" color="blue.500">
                  View Current Resume
                </Link>
              </Box>
            )}
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              p={1}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Upload new PDF to replace current resume (optional)
            </Text>
          </FormControl>

          <Box display="flex" gap={4} w="full">
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={saving}
              loadingText="Saving..."
              flex={1}
            >
              Update Application
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/job-applications")}
              flex={1}
            >
              Cancel
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}