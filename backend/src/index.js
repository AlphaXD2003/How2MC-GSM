require("dotenv").config({
  path: "./.env",
});

const { app, httpsServer, PORT } = require("./app");
const connectDB = require("./db/db");
const chalk = require("chalk");
const { syncDBwithPtero } = require("./utils/SyncDBwithPtero");
connectDB()
  .then(() => {
    // app.listen(process.env.PORT, () => {
    //   //console.log(
    //     chalk.cyan(`Server is running on http://localhost:${process.env.PORT}`)
    //   );
    // });
    httpsServer.listen(PORT, () => {
      console.log(`Server is running on HTTPS port on : https://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error(chalk.red(`Error: ${err.message}`));
  });
