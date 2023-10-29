const express = require("express");
const app = express();
const port = 3000;

// Serve the html file
app.use(express.static(__dirname + "/index.html"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
