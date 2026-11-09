const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

      employeeId: {
      type: String,
        default: "",
       },

     manager: {
    type: String,
     default: "",
       },

    department: {
     type: String,
      default: "",
     },

    joiningDate: {
     type: String,
      default: "",
     },


    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["hr", "it", "manager", "intern"],
      default: "intern",
    },

    isVerified: {
      type: Boolean,
      default: false,
     },

    otp: {
  type: String,
  default: "",
  },

  otpExpires: {
  type: Date,
},

resetPasswordToken: {
  type: String,
  default: "",
},

resetPasswordExpires: {
  type: Date,
},

  phone: {
  type: String,
  default: "",
},

countryCode: {
  type: String,
  default: "+91",
},

country: {
  type: String,
  default: "India",
},

state: {
  type: String,
  default: "",
},

city: {
  type: String,
  default: "",
},

location: {
  type: String,
  default: "",
},

college: {
  type: String,
  default: "",
},

degree: {
  type: String,
  default: "",
},

branch: {
  type: String,
  default: "",
},

passingYear: {
  type: String,
  default: "",
},

dateOfBirth: {
  type: String,
  default: "",
},

emergencyName: {
  type: String,
  default: "",
},

emergencyPhone: {
  type: String,
  default: "",
},

emergencyRelation: {
  type: String,
  default: "",
},

profilePic: {
  type: String,
  default: "",
},

selectedAvatar: {
  type: String,
  default: "👨‍💼",
},

  
skills: {
  type: [String],
  default: [],
},


documents: {
  aadhaar: {
    url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: "",
    },
  },

  pan: {
    url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: "",
    },
  },

  resume: {
    url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: "",
    },
  },

  degree: {
    url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: "",
    },
  },
},


guideOpened: {
  type: Boolean,
  default: false,
},

securityCompleted: {
  type: Boolean,
  default: false,
},

workspaceCompleted: {
  type: Boolean,
  default: false,
},

weekPlan: {
  type: [String],
  default: [],
},

weekPlanCompleted: {
  type: Boolean,
  default: false,
},

personalTasks: [
  {
    title: String,
    completed: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
  },
],
assignedTasks: [
  {
    title: {
      type: String,
      required: true,
    },

    dueDate: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    assignedBy: {
      type: String,
      default: "HR",
    },
  },
],

growthActivityDates: {
  type: [String],
  default: [],
},


  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);