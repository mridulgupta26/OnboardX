const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const Asset = require("../models/Asset");

const {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resendOtp,
  resetPassword,
  getProfile,
  updateProfile,
  uploadDocument,
   verifyDocument, 
  deleteDocument,
  uploadProfilePic,
  completeGrowthGoal,
  getAllInterns,
  getAllUsers,
  assignTask,
  updateTask,
 deleteTask,
updateDocumentStatus,
getAllAssets,
  addAsset,
  returnAsset,
  getAccessManagement,
updateAccessManagement,
} = require("../controllers/authController");




router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile/:email", getProfile);
router.get("/interns", getAllInterns);
router.get("/all-users", getAllUsers);

router.put("/profile/:email", updateProfile);

router.post(
  "/upload-document/:email/:documentType",
  upload.single("document"),
  uploadDocument
);

router.post(
  "/upload-profile-pic/:email",
  upload.single("profilePic"),
  uploadProfilePic
);

router.post("/assign-task", assignTask);

router.put(
  "/update-task/:email/:taskId",
  updateTask
);

router.delete(
  "/delete-task/:email/:taskId",
  deleteTask
);


router.put(
"/growth-goals/:email/:goalId/complete",
completeGrowthGoal
);

router.put(
  "/verify-document/:userId/:documentType",
  verifyDocument
);

router.put(
  "/document-status/:email/:documentType",
  updateDocumentStatus
);

router.get("/assets", getAllAssets);
router.post("/assets", addAsset);
router.get("/assets", getAllAssets);

router.put("/assets/:id", returnAsset);
router.get(
  "/access/:email",
  getAccessManagement
);

router.put(
  "/access/:email",
  updateAccessManagement
);

module.exports = router;
