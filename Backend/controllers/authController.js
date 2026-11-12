const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");
const companyEmailDomain = (process.env.COMPANY_EMAIL_DOMAIN || "geminisolutions.com").toLowerCase();
const allowedRoles = ["intern", "hr", "it", "manager"];
const isCompanyEmail = (email) => email.trim().toLowerCase().endsWith(`@${companyEmailDomain}`);
const crypto = require("crypto");
const Asset = require("../models/Asset");



const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, designation = "" } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Please select a valid account role." });
    }

    if (!fullName?.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter your full name and a valid email address." });
    }

    if (role !== "intern" && !isCompanyEmail(normalizedEmail)) {
      return res.status(400).json({ message: `Employee accounts require an @${companyEmailDomain} email address.` });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isIntern = role === "intern";
    const otp = isIntern
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : "";

    await User.create({
  fullName,
  email: normalizedEmail,
  password: hashedPassword,
  role,
  designation: typeof designation === "string" ? designation.trim() : "",
  otp,
  otpExpires: isIntern
    ? new Date(Date.now() + 2 * 60 * 1000)
    : null,
  isVerified: !isIntern,
});
    if (isIntern) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: normalizedEmail,
    subject: "OnboardX OTP Verification",
    html: `
      <h2>Welcome to OnboardX</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 2 minutes only.</p>
      <p>Please do not share this OTP with anyone.</p>
    `,
  });
}

    res.status(201).json({
      success: true,
      message: isIntern ? "OTP Sent Successfully" : "Account Created Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (new Date() > user.otpExpires) {
  return res.status(400).json({
    message: "OTP Expired",
  });
}

if (user.otp !== otp) {
  return res.status(400).json({
    message: "Invalid OTP",
  });
}


user.isVerified = true;
user.otp = "";
user.otpExpires = null;

await user.save();
    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Please select a valid account role." });
    }

    if (role !== "intern" && !isCompanyEmail(normalizedEmail)) {
      return res.status(400).json({ message: `Employee accounts require an @${companyEmailDomain} email address.` });
    }

   const user = await User.findOne({
  email: normalizedEmail
   }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (role === "intern" && !user.isVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: "Wrong Role Selected",
      });
    }

    const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

const userResponse = user.toObject();

delete userResponse.password;
delete userResponse.otp;
delete userResponse.otpExpires;
delete userResponse.resetPasswordToken;
delete userResponse.resetPasswordExpires;

res.status(200).json({
  success: true,
  token,
  role: user.role,
  user: userResponse,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { email, documentType } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    user.documents[documentType] = {
     url: req.file.filename,
     status: "Pending",
     remark: "",
    };

    await user.save();

    res.status(200).json({
      success: true,
      file: req.file.filename,
      documents: user.documents,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyDocument = async (req, res) => {
  try {
    const { userId, documentType } = req.params;
    const { status, remark } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.documents[documentType].status = status;
    user.documents[documentType].remark = remark || "";

    await user.save();

    res.status(200).json({
      success: true,
      documents: user.documents,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const uploadProfilePic = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    user.profilePic = req.file.filename;

    await user.save();

    res.status(200).json({
      success: true,
      profilePic: req.file.filename,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { email, documentType } = req.params;

    const validTypes = ["aadhaar", "pan", "resume", "degree"];

    if (!validTypes.includes(documentType)) {
      return res.status(400).json({
        message: "Invalid document type",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.set(`documents.${documentType}`, {
       url: "",
      status: "Pending",
       remark: "",
     });
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Document removed from your profile",
      documents: user.documents,
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      message: "Could not remove document. Please try again.",
    });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OnboardX Password Reset",
     html: `
  <h2>Password Reset Request</h2>

  <p>Click the button below to reset your password.</p>

  ${resetLink}
    Reset Password
  </a>

  <p style="margin-top:20px;">
    This link will expire in 15 minutes.
  </p>

  <p>
    If you did not request this password reset,
    please ignore this email.
  </p>
`,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const newOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = newOtp;
    user.otpExpires = new Date(
      Date.now() + 2 * 60 * 1000
    );

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OnboardX OTP Verification",
      html: `
        <h2>Welcome to OnboardX</h2>
        <p>Your new verification code is:</p>
        <h1>${newOtp}</h1>
        <p>This OTP is valid for 2 minutes only.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP Resent Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const completeGrowthGoal = async (req, res) => {
  try {
    const { email, goalId } = req.params;

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const getPart = (type) =>
      parts.find((part) => part.type === type).value;

    const today = [
      getPart("year"),
      getPart("month"),
      getPart("day"),
    ].join("-");

    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        personalTasks: {
          $elemMatch: {
            _id: goalId,
            completed: false,
          },
        },
      },
      {
        $set: {
          "personalTasks.$.completed": true,
        },
        $addToSet: {
          growthActivityDates: today,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires"
    );

    if (!updatedUser) {
      return res.status(409).json({
        message:
          "Goal was not found or is already completed. Reopen Growth Track and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Complete growth goal failed:", error);

    return res.status(500).json({
      message: "Could not complete the goal. Please try again.",
    });
  }
};

const getAllInterns = async (req, res) => {
  try {
    const interns = await User.find({
      role: "intern",
    }).select("-password");

    res.status(200).json(interns);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateDocumentStatus = async (req, res) => {
  try {
    const { email, documentType } = req.params;
    const { status } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.documents[documentType].status = status;

    await user.save();

    res.status(200).json({
      success: true,
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const assignTask = async (req, res) => {
  try {
    console.log("ASSIGN TASK HIT");
    console.log("BODY:", req.body);

    const { email, title, dueDate } = req.body;

    const user = await User.findOne({ email });

    console.log("FOUND USER:", user?.email);

    if (!user) {
      return res.status(404).json({
        message: "Intern not found",
      });
    }

   user.assignedTasks.push({
  title,
  dueDate,
  status: "Pending",
  assignedBy: "HR",
});

await user.save();

const updatedUser = await User.findOne({ email });

console.log(
  "FROM DATABASE:",
  updatedUser.assignedTasks
);

    res.status(200).json({
      message: "Task assigned successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { email, taskId } = req.params;
    const { title, dueDate, status } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const task = user.assignedTasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.title = title;
    task.dueDate = dueDate;
    task.status = status;

    await user.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { email, taskId } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.assignedTasks = user.assignedTasks.filter(
      (task) => task._id.toString() !== taskId
    );

    await user.save();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();

    res.status(200).json(assets);
  } catch (error) {
    console.error("ASSET ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch assets",
      error: error.message,
    });
  }
};

const addAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);

    res.status(201).json(asset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create asset",
    });
  }
};

const returnAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: "",
        status: "Available",
      },
      { new: true }
    );

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({
      message: "Failed to return asset",
    });
  }
};

const getAccessManagement = async (req, res) => {
  try {

    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(
      user.accessManagement
    );

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAccessManagement = async (
  req,
  res
) => {
  try {

    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.accessManagement =
      req.body.accessManagement;

    await user.save();

    res.status(200).json({
      success: true,
      accessManagement:
        user.accessManagement,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resendOtp,
  resetPassword,
  getProfile,
  updateProfile,
  uploadDocument,
  deleteDocument,
  uploadProfilePic,
  completeGrowthGoal,
  getAllInterns,
  verifyDocument,
  getAllUsers,
updateDocumentStatus,
assignTask,
updateTask,
deleteTask,
getAllAssets,
addAsset,
returnAsset,
 getAccessManagement,
  updateAccessManagement,
};