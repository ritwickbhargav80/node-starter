const express = require("express");
const router = express.Router();

// load controller
const { index, register, login, openAccess, restrictedAccess } = require("../../../controllers/index_controller");

// middlewares
let { catchErrors } = require("../../../config/errorHandler");
let { userRegisterValidation } = require("../../../middlewares/validations");
let { allAuth, adminAuth } = require("../../../middlewares/auth");

// routes
router.get("/", catchErrors(index));
router.post("/", userRegisterValidation, catchErrors(register));
router.get("/login", catchErrors(login));
router.get("/admin", allAuth, catchErrors(openAccess));
router.get("/admin", adminAuth, catchErrors(restrictedAccess));

// export router
module.exports = router;
