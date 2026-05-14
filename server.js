import Hapi from "@hapi/hapi";
import routes from "./routes.js";
import { SERVER_CONFIG } from "./constants.js";

/**
 * Initializes and starts the Hapi server.
 */
const init = async () => {
  const server = Hapi.server({
    port: SERVER_CONFIG.PORT,
    host: SERVER_CONFIG.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  try {
    await server.start();
    // Using simple console.log as requested, but ideally replaced with a proper logger (e.g. pino)
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

init();
