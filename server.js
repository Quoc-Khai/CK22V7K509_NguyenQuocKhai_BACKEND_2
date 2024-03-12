const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

// start server
async function startServer() {
  try {

    await MongoDB.connect(config.db.uri);
    console.log("connect to the database ");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is rinning on port ${PORT}`);
    });
  } catch {
    console.log("Cannnot connect to database!", error);
    process.exit();
  }

}
startServer();

