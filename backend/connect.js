const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || "Tasks",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "password",
      {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: false,
      }
    );

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
};

module.exports = {
  connect,
  sequelize,
};
