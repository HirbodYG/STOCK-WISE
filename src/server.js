const createApp = require("./app");
const initDb = require("./db/initDb");
const { PORT } = require("./config/constants");

async function start() {
  await initDb();
  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
