const axios = require("axios");

async function testAPI() {
  try {
    console.log("🧪 Testing backend API...");

    const testCode = `
function example() {
  var x = 5;
  if (x == "5") {
    document.getElementById("test").innerHTML = userInput;
  }
  setTimeout(() => {
    console.log("Hello");
  }, 1000);
}
    `;

    const response = await axios.post("http://localhost:5000/api/review", {
      code: testCode,
    });

    console.log("✅ API Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ API Test Failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testAPI();
