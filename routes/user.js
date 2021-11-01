const userController = require("../controllers/user");
const auth = require("../middleware/auth");

module.exports  = (app) => {
  app.post("/api/register", userController.register);
  app.post("/api/login", userController.login);
  app.delete("/api/user", userController.delete);
  app.get("/api/users", auth, userController.getAllUsers);
  app.get("/api/user", auth, userController.getUser);
};