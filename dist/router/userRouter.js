"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validator_1 = require("../middleware/validator");
const isLoggedIn_1 = require("../middleware/isLoggedIn");
const userRepository_1 = require("../repository/userRepository");
const constants_1 = require("../lib/constants");
const userRepository = new userRepository_1.UserRepository(constants_1.prisma);
const { deleteValidator } = (0, validator_1.UserValidators)(userRepository);
const router = (0, express_1.Router)();
router.route('/').get(isLoggedIn_1.isLoggedIn, (0, asyncHandler_1.asyncHandler)(userController_1.getSearchUsers));
router
    .route('/:id')
    .get((0, asyncHandler_1.asyncHandler)(userController_1.getUserById))
    .get(isLoggedIn_1.isLoggedIn, (0, asyncHandler_1.asyncHandler)(userController_1.getUser))
    .patch(isLoggedIn_1.isLoggedIn, (0, asyncHandler_1.asyncHandler)(userController_1.updateUser))
    .delete(isLoggedIn_1.isLoggedIn, deleteValidator, validator_1.validate, (0, asyncHandler_1.asyncHandler)(userController_1.deleteUser));
exports.default = router;
