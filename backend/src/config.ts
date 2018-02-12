export const Config = {
  env: process.env.NODE_ENV as "production" | "dev",
  port: Number(process.env.port || 8081),
  pg: {
    ssl: false,
    database: "sample",
    host: "localhost",
    port: 5432,
    user: "sample",
    password: "sample"
  }
  // settings
};

// settings only for local
if (Config.env === "dev") {
  Object.assign(Config, {
    port: 8081,
    env: "dev"
  });
}

// validate environment variables set.
// can be wise to assert these sorts of things
