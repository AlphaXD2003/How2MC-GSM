const mongoose = require("mongoose");
const { DB_NAME } = require("../configs/constants");
const chalk = require("chalk");
const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      chalk.green(
        "Database connected successfully : ",
        connectInstance.connection.host
      )
    );
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
