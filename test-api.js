// Quick API test
const baseURL = "http://localhost:3300";

async function testAPI() {
  try {
    const response = await fetch(`${baseURL}/job-application/get`);
    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("API Error:", error);
  }
}

testAPI();