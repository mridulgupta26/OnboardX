import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Documents from "./Documents";
import Profile from "./Profile";
import "./EmployeeDashboard.css";

import DocumentVerification from "./DocumentVerification";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

import {
  FiMail,
  FiMonitor,
  FiUsers,
  FiLock,
  FiHardDrive,
} from "react-icons/fi";


const modules = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "grid",
    path: "/it-dashboard",
  },

  {
    id: "assets",
    label: "Asset Management",
    icon: "person",
    path: "/it-dashboard/assets",
  },

  {
    id: "access",
    label: "Access Management",
    icon: "file",
    path: "/it-dashboard/access",
  },

  {
    id: "requests",
    label: "IT Requests",
    icon: "check",
    path: "/it-dashboard/requests",
  },

  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    path: "/it-dashboard/settings",
  },
];

const tasks = [
  {
    name: "Complete your profile",
    category: "PERSONAL DETAILS",
    due: "Today",
    done: false,
  },
  {
    name: "Submit Required Documents",
    category: "DOCUMENTS",
    due: "Today",
    done: false,
  },
  {
    name: "Explore Your Workspace ",
    category: "GETTING STARTED",
    due: "Oct 12",
    done: true,
  },
];

function InternProgressTooltip({ active, payload }) {
  const intern = payload?.[0]?.payload;

  if (!active || !intern) return null;

  return (
    <div className="intern-progress-tooltip">
      <strong>{intern.name}</strong>
      <span>Uploaded Documents <b>{intern.uploadedDocs}</b></span>
      <span>Verified Documents <b>{intern.verifiedDocs}</b></span>
      <span>Completed Tasks <b>{intern.completedTasks}</b></span>
      <span>Progress <b>{intern.progress}%</b></span>
    </div>
  );
}

const iconPaths = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.5-3.5 2.8-5.5 7-5.5s6.5 2 7 5.5" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14 4v4h4M9 13h6m-6 3.5h6" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
      <path d="M20 12a8 8 0 1 1-4.7-7.3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1 1.1.9-1.4 2.4-1.4-.5a7.4 7.4 0 0 1-1.7 1l-.2 1.5h-2.8l-.2-1.5a7.4 7.4 0 0 1-1.7-1l-1.4.5-1.4-2.4 1.1-.9A7.2 7.2 0 0 1 7.3 13l-1.4-.7.8-2.7 1.5.1a7.5 7.5 0 0 1 1.3-1.5l-.2-1.5 2.7-.9.8 1.3a7.4 7.4 0 0 1 2 0l.8-1.3 2.7.9-.2 1.5a7.5 7.5 0 0 1 1.3 1.5l1.5-.1.8 2.7-1.4.7a7.2 7.2 0 0 1-.4 2Z" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  bell: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0" />
    </>
  ),
};

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

function DashboardHome({ role, user, profilePic, selectedAvatar, onNavigate }) {
 

  const completeTasks = [];

const profileCompleted =
  !!(
    user?.phone &&
    user?.country &&
    user?.state &&
    user?.city
  );

const documentsCompleted =
  !!(
    user?.documents?.aadhaar &&
    user?.documents?.pan &&
    user?.documents?.resume &&
    user?.documents?.degree
  );

if (profileCompleted) completeTasks.push(0);

if (documentsCompleted) completeTasks.push(1);

if (user?.workspaceCompleted)
  completeTasks.push(2);

if (user?.securityCompleted)
  completeTasks.push(3);
  const roleTitle =
    role === "hr"
      ? "HR"
      : role === "it"
        ? "IT"
        : role === "manager"
          ? "Manager"
          : "Intern";
  const displayName =
    user?.fullName || user?.name || user?.email || "Your workspace";

const progress = Math.round(
  (completeTasks.length / 4) * 100
);

  const [documentCount, setDocumentCount] = useState(null);
  const [interns, setInterns] = useState([]);
  const totalInterns = interns.length;

  const pendingDocuments = interns.reduce((count, intern) => {
  const docs = intern.documents || {};

  return (
    count +
    Object.values(docs).filter(
      (doc) => doc?.status === "Pending"
    ).length
  );
}, 0);

const pendingReviews = interns.reduce((count, intern) => {
  const docs = intern.documents || {};

  return (
    count +
    Object.values(docs).filter(
      (doc) => doc?.status === "Pending"
    ).length
  );
}, 0);



  const fetchInterns = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/all-users"
    );

    const filteredInterns =
      response.data.users.filter(
        (user) => user.role === "intern"
      );

      console.log("Interns Data:", filteredInterns);

    setInterns(filteredInterns);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchInterns();
}, []);

  useEffect(() => {
    let cancelled = false;

    const loadDocumentCount = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("onboardx-user") || "null",
        );

        const email = user?.email || storedUser?.email;

        if (!email) return;

        const response = await axios.get(
          `http://localhost:5000/api/auth/profile/${encodeURIComponent(email)}`,
        );

        const savedDocuments = response.data.documents || {};
        const documentIds = ["aadhaar", "pan", "resume", "degree"];

        const count = documentIds.filter((id) =>
          Boolean(savedDocuments[id]),
        ).length;

        if (!cancelled) {
          setDocumentCount(count);
        }
      } catch (error) {
        console.error("Could not load document count:", error);
      }
    };

    loadDocumentCount();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);
 
  

  return (
    <div className="workspace-home">
      <header className="workspace-welcome">
        <div>
         <p className="workspace-eyebrow">
         IT OPERATIONS
       </p>

      <h1>
       Welcome back, IT Team
      </h1>

       <p>
        Manage technical onboarding, assets and system access.
        </p>
        </div>
        <button
          className="welcome-profile"
          type="button"
          onClick={() => onNavigate("/profile")}
          aria-label="Open your profile"
        >
          {profilePic ? (
            <img src={profilePic} alt="" />
          ) : (
            <span>{selectedAvatar}</span>
          )}
        </button>
      </header>

      <section className="onboarding-summary" aria-label="Onboarding progress">
        <div className="summary-topline">
          <div>
           <span className="summary-kicker">
              IT OVERVIEW
          </span>

        <h2>IT Operations Overview</h2>
          </div>
         <span className="summary-number">
  {totalInterns}
  <small>Interns</small>
</span>
        </div>
        <div className="summary-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="summary-bottomline">
          <span>
  Track interns, verify documents and manage onboarding activities.
</span>
          <button type="button" onClick={() => onNavigate("/tasks")}>
             View tasks <Icon name="arrow" size={15} />
           </button>
        </div>
      </section>

      <div className="workspace-stat-grid">
        <div className="workspace-stat">
          <span className="stat-icon stat-blue">
            <Icon name="check" />
          </span>
          <span className="stat-label">
           Total Interns
         </span>

         <strong>
  {totalInterns}
  <small> /Active</small>
</strong>

        </div>

        <div className="workspace-stat">
          <span className="stat-icon stat-green">
            <Icon name="file" />
          </span>

          <span className="stat-label">
           IT Ready
          </span>

          <strong>
  {pendingDocuments}
  <small> / Pending</small>
</strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-icon stat-amber">
            <Icon name="person" />
          </span>
          <span className="stat-label">
          Pending Setup
        </span>
         <strong className="stat-role">
  {pendingReviews} Open
</strong>
        </div>
      </div>

      <div className="workspace-lower-grid">
        <section className="workspace-panel task-preview">
          <div className="panel-heading">
            <div>
             <p className="panel-eyebrow">
                INTERN DIRECTORY
             </p>

             <h2>Recently Provisioned Interns</h2>

            </div>
            <button
              type="button"
              className="text-action"
             onClick={() => onNavigate("/it-dashboard/assets")}
            >
             View All <Icon name="arrow" size={14} />
            </button>
          </div>
    <div className="task-preview-list">
{interns.slice(0, 2).map((intern) => (
  <div
    key={intern._id}
    className="task-preview-row"
  >
    <div className="hr-intern-info">
      <strong>{intern.fullName}</strong>

      <small>
        {intern.designation || "Intern"}
      </small>
    </div>

    <span className="task-date">
      {
        Object.values(
          intern.documents || {}
        ).filter(
          (doc) =>
            doc?.status === "Verified"
        ).length
      }
      /4
    </span>
  </div>
))}

 </div>

</section>

 
        <section className="workspace-panel activity-preview">
          <div className="panel-heading">
            <div>
              <p className="panel-eyebrow">JOURNEY TIMELINE</p>
             <h2>Recent IT Activity</h2>
            </div>
            <span className="activity-live">
              <i /> LIVE
            </span>
          </div>
          <div className="activity-line">
            <span className="activity-marker marker-green" />
            <span>
              <strong>VPN Access Pending</strong>
               <small>3 interns awaiting VPN activation</small>
            </span>
            <time>Today</time>
          </div>
          <div className="activity-line">
            <span className="activity-marker marker-blue" />
            <span>
             <strong>Laptop Allocation Pending</strong>
             <small>2 laptops pending allocation</small>
            </span>

            <time>Today</time>
          </div>
        </section>
      </div>
    </div>
  );
}

function InternDirectoryModule() {

  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  fetchInterns();
}, []);

const fetchInterns = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/interns"
    );

    setInterns(response.data);
  } catch (error) {
    console.error(error);
  }
};
const filteredInterns = interns.filter(
  (intern) =>
    intern.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    intern.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    intern.designation
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
);


  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">
            INTERN DIRECTORY
          </p>

          <h1>Intern Directory</h1>

          <p>
            View and manage all interns.
          </p>
        </div>
      </div>

      <div className="workspace-panel">

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <h2 style={{ margin: 0 }}>
    Interns
  </h2>
<input
  type="text"
  placeholder="Search intern..."
  className="hr-search"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
/>
</div>

<table className="hr-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Designation</th>
      <th>Status</th>
    </tr>
  </thead>

<tbody>
  {filteredInterns.map((intern) => (
    <tr key={intern._id}>
      <td>{intern.fullName}</td>
      <td>{intern.email}</td>
      <td>{intern.designation || "Intern"}</td>
      <td>Active</td>
    </tr>
  ))}
</tbody>
</table>


</div>
    </section>
  );
}

function AssetManagementModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [assets, setAssets] = useState([]);
  const [interns, setInterns] = useState([]);


  const [newAsset, setNewAsset] = useState({
    id: "",
    assetName: "",
    assignedTo: "",
  });

  const fetchAssets = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/assets"
    );

    setAssets(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchAssets();
  fetchInterns();
}, []);


const fetchInterns = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/interns"
    );

    setInterns(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const filteredAssets = assets.filter(
    (asset) =>
      asset.assetName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      asset.assetId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      asset.assignedTo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalAssets = assets.length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "Assigned"
  ).length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "Available"
  ).length;

  const returnedAssets = assets.filter(
    (asset) => asset.status === "Returned"
  ).length;

  const handleAssignAsset = async() => {
    if (!newAsset.id || !newAsset.assetName) return;

  await axios.post(
  "http://localhost:5000/api/auth/assets",
  {
    assetId: newAsset.id,
    assetName: newAsset.assetName,
    type: "Laptop",
    assignedTo: newAsset.assignedTo,
    assignedDate: new Date()
      .toISOString()
      .split("T")[0],
    status: "Assigned",
  }
);

const response = await axios.get(
  "http://localhost:5000/api/auth/assets"
);

setAssets(response.data);

    setNewAsset({
      id: "",
      assetName: "",
      assignedTo: "",
    });

    setShowModal(false);
  };

 
  const handleReturn = async (assetId) => {
   console.log("RETURN CLICKED", assetId);

  try {
    await axios.put(
      `http://localhost:5000/api/auth/assets/${assetId}`
    );

    await fetchAssets();
  } catch (error) {
    console.error(error);
  }
};


  return (
    <section className="module-page asset-management-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">
            ASSET MANAGEMENT
          </p>

          <h1>Asset Management</h1>

          <p>
            Manage laptops, devices and IT assets.
          </p>
        </div>

        <button
          className="text-action"
          onClick={() => setShowModal(true)}
        >
          + Assign Asset
        </button>
      </div>

      {/* Stats */}

      <div className="workspace-stat-grid asset-management-stats">
        <div className="workspace-stat">
          <span className="stat-label">
            Total Assets
          </span>

          <strong>{totalAssets}</strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-label">
            Assigned
          </span>

          <strong>{assignedAssets}</strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-label">
            Available
          </span>

          <strong>{availableAssets}</strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-label">
            Returned
          </span>

          <strong>{returnedAssets}</strong>
        </div>
      </div>

      <div className="workspace-panel asset-management-panel">

        <input
          type="text"
          className="hr-search asset-management-search"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
        <div className="asset-table-wrapper">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.assetId}>
               <td>{asset.assetId}</td>
                <td>{asset.assetName}</td>
                <td>{asset.type}</td>
                <td>
                  {asset.assignedTo || "-"}
                </td>

                <td>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        asset.status === "Assigned"
                          ? "#dcfce7"
                          : "#dbeafe",
                      color:
                        asset.status === "Assigned"
                          ? "#15803d"
                          : "#1d4ed8",
                    }}
                  >
                    {asset.status}
                  </span>
                </td>

                <td>
                  {asset.status ===
                    "Assigned" && (
                    <button
                      className="text-action"
                      onClick={() =>
                        handleReturn(asset._id)
                      }
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       
       </div>
      {showModal && (
        <div className="assign-asset-overlay">
          <div
            className="assign-asset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-asset-title"
            aria-describedby="assign-asset-description"
          >
            <header className="assign-asset-header">
              <h2 id="assign-asset-title">Assign New Asset</h2>
              <p id="assign-asset-description">
                Allocate a company device to an intern.
              </p>
            </header>

            <div className="assign-asset-fields">
              <div className="assign-asset-field">
                <label htmlFor="assign-asset-id">Asset ID</label>
                <input
                  id="assign-asset-id"
                  className="assign-asset-control"
                  value={newAsset.id}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      id: e.target.value,
                    })
                  }
                />
              </div>

              <div className="assign-asset-field">
                <label htmlFor="assign-asset-name">Asset Name</label>
                <input
                  id="assign-asset-name"
                  className="assign-asset-control"
                  value={newAsset.assetName}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      assetName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="assign-asset-field">
                <label htmlFor="assign-asset-assignee">Assign To</label>
                <select
                  id="assign-asset-assignee"
                  className="assign-asset-control"
                  value={newAsset.assignedTo}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      assignedTo: e.target.value,
                    })
                  }
                >
                 <option value="">Select an intern</option>

{interns.map((intern) => (
  <option
    key={intern._id}
    value={intern.fullName}
  >
    {intern.fullName}
  </option>
))}


                </select>
              </div>
            </div>

            <footer className="assign-asset-actions">
              <button
                className="assign-asset-button assign-asset-button-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="assign-asset-button assign-asset-button-primary"
                onClick={handleAssignAsset}
              >
                Assign Asset
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
    
  );
  

}

const accessServiceDefinitions = [
  { name: "Corporate Email", icon: <FiMail /> },
  { name: "Outlook", icon: <FiMonitor /> },
  { name: "Microsoft Teams", icon: <FiUsers /> },
  { name: "VPN Access", icon: <FiLock /> },
  { name: "Shared Drive", icon: <FiHardDrive /> },
];
const accessProfiles = [
  ["Granted", "Granted", "Granted", "Pending", "Not Assigned"],
  ["Granted", "Granted", "Granted", "Granted", "Granted"],
  ["Pending", "Not Assigned", "Not Assigned", "Not Assigned", "Not Assigned"],
];

function AccessManagementModule() {
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInternId, setSelectedInternId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [accessForm, setAccessForm] = useState({
  corporateEmail: "",
  vpn: "",
  teams: "",
  sharedDrive: "",
});

  useEffect(() => {
    let isCurrent = true;
    axios
      .get("http://localhost:5000/api/auth/interns")
      .then((response) => {
        if (isCurrent) {
          setInterns(Array.isArray(response.data) ? response.data : []);
          setLoadError("");
        }
      })
      .catch((error) => {
        console.error("Unable to load interns for access management:", error);
        if (isCurrent) setLoadError("Unable to load interns. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  
  const internsWithAccess = useMemo(
    () =>
      interns.map((intern, index) => {
        const access = intern.accessManagement || {};

        const services = [
  {
    name: "Corporate Email",
    value: access.corporateEmail?.value || "",
    status: access.corporateEmail?.status || "Pending",
  },

  {
    name: "Outlook",
    value: access.outlook?.value || "",
    status: access.outlook?.status || "Pending",
  },

  {
    name: "Teams",
    value: access.teams?.value || "",
    status: access.teams?.status || "Pending",
  },

  {
    name: "VPN",
    value: access.vpn?.value || "",
    status: access.vpn?.status || "Pending",
  },

  {
    name: "Shared Drive",
    value: access.sharedDrive?.value || "",
    status: access.sharedDrive?.status || "Pending",
  },
];

        const grantedCount = services.filter(
          (service) => service.status === "Granted"
        ).length;
        const status =
          grantedCount === services.length
            ? "Ready"
            : grantedCount > 0
              ? "In Progress"
              : "Pending";

        return {
          ...intern,
          id: intern._id || intern.email || `${intern.fullName}-${index}`,
          name: intern.fullName || intern.name || intern.email || "Unnamed intern",
        email:
  access.corporateEmail?.value ||
  "Not Assigned",
          searchEmail: intern.email || "",
          designation:
            intern.designation &&
            !intern.designation.toLowerCase().includes("intern")
              ? `${intern.designation} Intern`
              : intern.designation || "Intern",
          services,
          status,
        };
      }),
    [interns]
  );

  const filteredInterns = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return internsWithAccess.filter((intern) => {
      const matchesSearch =
        !query ||
        intern.name.toLowerCase().includes(query) ||
        (intern.email || "").toLowerCase().includes(query) ||
        intern.searchEmail.toLowerCase().includes(query) ||
        (intern.designation || "").toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [internsWithAccess, searchTerm]);
  const selectedIntern =
    filteredInterns.find((intern) => intern.id === selectedInternId) ||
    filteredInterns[0];

    useEffect(() => {
  if (!selectedIntern) return;

  const access =
    selectedIntern.accessManagement || {};

  setAccessForm({
    corporateEmail:
      access.corporateEmail?.value || "",

    vpn:
      access.vpn?.value || "",

    teams:
      access.teams?.value || "",

    sharedDrive:
      access.sharedDrive?.value || "",
  });
}, [selectedIntern]);

  const readyInterns = internsWithAccess.filter(
    (intern) => intern.status === "Ready"
  ).length;
  const pendingInterns = internsWithAccess.length - readyInterns;
  const initials = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

      const handleSaveAccess = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/auth/access/${selectedIntern.searchEmail}`,
      {
        accessManagement: {
          corporateEmail: {
            value: accessForm.corporateEmail,
            status: "Granted",
          },

          outlook: {
            value: accessForm.corporateEmail,
            status: "Granted",
          },

          vpn: {
            value: accessForm.vpn,
            status: "Granted",
          },

          teams: {
            value: accessForm.teams,
            status: "Granted",
          },

          sharedDrive: {
            value: accessForm.sharedDrive,
            status: "Granted",
          },
        },
      }
    );

  
    window.location.reload();
  } catch (error) {
    console.error(error);
  
  }
};

  return (
    <section className="module-page access-management-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">ACCESS MANAGEMENT</p>
          <h1>Access Management</h1>
          <p>Manage employee accounts, communication tools and system access.</p>
        </div>
      </div>

      <div className="workspace-stat-grid access-management-stats">
        <div className="workspace-stat">
          <span className="stat-label">Total Interns</span>
          <strong>{internsWithAccess.length}</strong>
        </div>
        <div className="workspace-stat">
          <span className="stat-label">Ready</span>
          <strong>{readyInterns}</strong>
        </div>
        <div className="workspace-stat">
          <span className="stat-label">Pending</span>
          <strong>{pendingInterns}</strong>
        </div>
      </div>

      <div className="access-workspace-grid">
        <section className="workspace-panel access-directory-panel">
          <div className="access-panel-heading">
            <div>
              <h2>Intern Directory</h2>
              <p>{filteredInterns.length} interns</p>
            </div>
          </div>
          <label className="access-search">
            <span className="sr-only">Search interns</span>
            <input
              type="search"
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <div className="access-intern-list" aria-label="Intern directory">
            {isLoading ? (
              <p className="access-empty-state">Loading interns...</p>
            ) : loadError ? (
              <p className="access-empty-state access-error">{loadError}</p>
            ) : filteredInterns.length ? (
              filteredInterns.map((intern) => (
                <button
                  type="button"
                  className={`access-intern-row${selectedIntern?.id === intern.id ? " is-selected" : ""}`}
                  key={intern.id}
                  onClick={() => setSelectedInternId(intern.id)}
                  aria-pressed={selectedIntern?.id === intern.id}
                >
                  <span className="access-avatar">{initials(intern.name)}</span>
                  <span className="access-intern-copy">
                    <strong>{intern.name}</strong>
                    <small>{intern.designation || "Intern"}</small>
                  </span>
                  <span className={`access-status-badge status-${intern.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {intern.status}
                  </span>
                </button>
              ))
            ) : (
              <p className="access-empty-state">No interns match your search.</p>
            )}
          </div>
        </section>

        {selectedIntern ? (
          <section className="workspace-panel access-details-panel">
            <div className="access-selected-info">
              <div className="access-avatar access-avatar-large">
                {initials(selectedIntern.name)}
              </div>
              <div className="access-selected-copy">
                <h2>{selectedIntern.name}</h2>
                <p>{selectedIntern.designation || "Intern"}</p>
                <span className="access-corporate-email">
                  {selectedIntern.email}
                </span>
              </div>
              <div
  style={{
    marginTop: "20px",
    display: "grid",
    gap: "10px",
  }}
>
  <input
    type="text"
    placeholder="Corporate Email"
    value={accessForm.corporateEmail}
    onChange={(e) =>
      setAccessForm({
        ...accessForm,
        corporateEmail: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="VPN ID"
    value={accessForm.vpn}
    onChange={(e) =>
      setAccessForm({
        ...accessForm,
        vpn: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="Teams Account"
    value={accessForm.teams}
    onChange={(e) =>
      setAccessForm({
        ...accessForm,
        teams: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="Shared Drive"
    value={accessForm.sharedDrive}
    onChange={(e) =>
      setAccessForm({
        ...accessForm,
        sharedDrive: e.target.value,
      })
    }
  />

 <button
  type="button"
  className="text-action"
  onClick={handleSaveAccess}
>
  Save Access
</button>
</div>


            </div>
            <div className="access-service-list">
              {selectedIntern.services.map((service) => (
                <div className="access-service-row" key={service.name}>
  <span className="access-service-icon">
    {service.icon}
  </span>

  <div style={{ flex: 1 }}>
    <strong>
      {service.name}
    </strong>

    <small
      style={{
        display: "block",
        color: "#64748b",
        marginTop: "4px",
      }}
    >
      {service.value || "Not Assigned"}
    </small>
  </div>

  <span
    className={`access-status-badge status-${service.status
      .toLowerCase()
      .replace(/\s+/g, "-")}`}
  >
    {service.status}
  </span>
</div>
              ))}
            </div>
          </section>
        ) : (
          <section className="workspace-panel access-no-selection">
            <h2>{isLoading ? "Loading access details" : "No intern selected"}</h2>
            <p>
              {loadError || "Intern access details will appear here when an intern is available."}
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
function ITRequestsModule() {
  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">
            IT REQUESTS
          </p>

          <h1>IT Requests</h1>

          <p>
            Review and manage support requests.
          </p>
        </div>
      </div>
    </section>
  );
}

function ModulePage({
  section,
  role,
  user,
  setUser,
  profilePic,
  selectedAvatar,
  onNavigate,
  setTheme,
  theme,
}) {

  if (section === "interns")
  return <InternDirectoryModule />;

  if (section === "profile")
    return (
      <Profile
        user={user}
        profilePic={profilePic}
        selectedAvatar={selectedAvatar}
      />
    );
   if (section === "documents")
  return <DocumentVerification />;
   
  if (section === "dashboard")
    return (
      <DashboardHome
        role={role}
        user={user}
        profilePic={profilePic}
        selectedAvatar={selectedAvatar}
        onNavigate={onNavigate}
      />
    );
  if (section === "tasks")
  return (
    <TasksModule
      user={user}
      setUser={setUser}
    />
  );
if (section === "growthtrack")
  return (
    <GrowthTrackModule
      user={user}
      setUser={setUser}
    />
  );

  if (section === "assignments")
  return <AssignTasksModule />;
  
  if (section === "assets")
  return <AssetManagementModule />;

if (section === "access")
  return <AccessManagementModule />;

if (section === "requests")
  return <ITRequestsModule />;


  if (section === "settings")
    return <SettingsModule theme={theme} setTheme={setTheme} />;
  return <ActivityModule user={user} />;

}

function TasksModule({user , setUser}) {
 const [done, setDone] = useState([]);

const profileCompleted =
  !!(
    user?.phone &&
    user?.country &&
    user?.state &&
    user?.city
  );

  const documentsCompleted =
  !!(
    user?.documents?.aadhaar &&
    user?.documents?.pan &&
    user?.documents?.resume &&
    user?.documents?.degree
  );

  const visitedPages = JSON.parse(
  localStorage.getItem("visitedPages") || "[]"
);

const workspaceCompleted =
  user?.workspaceCompleted || false;

  
  const securityCompleted = user?.securityCompleted || false;

const guideOpened = user?.guideOpened || false;

useEffect(() => {
  const completedTasks = [];

  if (profileCompleted) {
    completedTasks.push(0);
  }

  if (documentsCompleted) {
  completedTasks.push(1);
} 

if (workspaceCompleted) {
  completedTasks.push(2);
}

if (securityCompleted) {
  completedTasks.push(3);
}

  setDone(completedTasks);
}, [profileCompleted , documentsCompleted , workspaceCompleted , securityCompleted]);



  const items = [
    ...tasks,
  
    {
  name: "Complete Security Basics",
  category: "SECURITY",
  due: "Oct 16",
  done: false,
  },
 
  ];



  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">YOUR CHECKLIST</p>
          <h1>Your tasks</h1>
          <p>Small steps, a confident start.</p>
        </div>
        <span className="module-count">
          {items.length - done.length} remaining
        </span>
      </div>
      <div className="module-task-list">
        {items.map((item, index) => (
           
           <div
       className="module-task-row"
        key={item.name}
          >
            <span
              className={`task-check${done.includes(index) ? " is-done" : ""}`}
            >
              {done.includes(index) ? "✓" : ""}
            </span>
            <span className="module-task-copy">
              <strong className={done.includes(index) ? "task-finished" : ""}>
                {item.name}
              </strong>
              <small>{item.category}</small>
            </span>

            <span className="task-date">
              {done.includes(index) ? "Complete" : item.due}
            </span>

            {item.name === "Complete Security Basics" &&
                 !securityCompleted && (
                <div style={{ marginTop: "10px" }}>
                {!guideOpened ? (
  <button
    className="text-action"
    type="button"
     onClick={async () => {
  const storedUser = JSON.parse(
    localStorage.getItem("onboardx-user")
  );

 const response = await axios.put(
  `http://localhost:5000/api/auth/profile/${storedUser.email}`,
  {
    guideOpened: true,
  }
);
console.log("API RESPONSE", response.data);

setUser(response.data.user);

window.open("/pdf/guide.pdf", "_blank");
}}

  >
    Read Guide
  </button>
) : (
  <button
    className="text-action"
    type="button"
   onClick={async () => {
  const storedUser = JSON.parse(
    localStorage.getItem("onboardx-user")
  );

const response = await axios.put(
  `http://localhost:5000/api/auth/profile/${storedUser.email}`,
  {
    securityCompleted: true,
  }
);

setUser(response.data.user);
}}
  >
    I Have Read This Guide
  </button>
)}
             </div>
           )}
          </div>
        ))}
      </div>
    </section>
  );
}
function GoalNotes({ task, user, setUser }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openNotes = () => {
    const latestTask = user?.personalTasks?.find(
      (item) => item._id === task._id
    );

    setDraft(latestTask?.note || "");
    setError("");
    setOpen(true);
  };

  const saveNotes = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      if (!user?.email || !task?._id) {
        throw new Error("User or goal details are unavailable.");
      }

      const profilePath =
        `/api/auth/profile/${encodeURIComponent(user.email)}`;

      const config = {
        baseURL: "http://localhost:5000",
      };

      // Read current saved goals before updating this goal's note.
      const latestResponse = await axios.get(profilePath, config);
      const latestUser =
        latestResponse.data.user || latestResponse.data;

      if (!Array.isArray(latestUser.personalTasks)) {
        throw new Error("Could not load your saved goals.");
      }

      const goalExists = latestUser.personalTasks.some(
        (item) => item._id === task._id
      );

      if (!goalExists) {
        throw new Error("This goal no longer exists.");
      }

      const updatedTasks = latestUser.personalTasks.map((item) =>
        item._id === task._id
          ? { ...item, note: draft }
          : item
      );

      const response = await axios.put(
        profilePath,
        { personalTasks: updatedTasks },
        config
      );

      const savedUser = response.data.user;
      const savedGoal = savedUser?.personalTasks?.find(
        (item) => item._id === task._id
      );

      if (!savedGoal || savedGoal.note !== draft) {
        throw new Error(
          "The server did not save the note. Check the note schema field and restart the backend."
        );
      }

      setUser(savedUser);

      localStorage.setItem(
        "onboardx-user",
        JSON.stringify(savedUser)
      );

      setOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not save notes."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <strong
  role="button"
  tabIndex={0}
  onClick={openNotes}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openNotes();
    }
  }}
  style={{ cursor: "pointer" }}
>
  {task.title}
</strong>
      {open && (
        <div
          role="presentation"
          onClick={() => {
            if (!saving) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(25, 20, 40, 0.35)",
            backdropFilter: "blur(4px)",
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label={`Notes for ${task.title}`}
            onSubmit={saveNotes}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "480px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxSizing: "border-box",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid #e9e3f1",
              background: "#fff",
              color: "#332b43",
              boxShadow: "0 24px 70px rgba(25, 20, 40, 0.18)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
              {task.title}
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "#81768f",
                fontSize: "13px",
              }}
            >
              Keep your learning notes and next steps here.
            </p>

            <textarea
              autoFocus
              aria-label="Goal notes"
              value={draft}
              disabled={saving}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write your notes..."
              style={{
                display: "block",
                width: "100%",
                minHeight: "160px",
                boxSizing: "border-box",
                resize: "vertical",
                padding: "14px",
                border: "1px solid #e4ddec",
                borderRadius: "12px",
                background: "#faf8fd",
                color: "#332b43",
                font: "inherit",
                lineHeight: "1.6",
              }}
            />

            {error && (
              <p role="alert" style={{ color: "#b42318", fontSize: "13px" }}>
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                disabled={saving}
                onClick={() => setOpen(false)}
                style={{
                  width: "auto",
                  padding: "9px 15px",
                  border: "1px solid #e4ddec",
                  borderRadius: "9px",
                  background: "#fff",
                  color: "#655a74",
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "auto",
                  padding: "9px 15px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#332b43",
                  color: "#fff",
                  cursor: saving ? "wait" : "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}


function GoalNotePreview({ note }) {
  const [expanded, setExpanded] = useState(false);

  if (!note?.trim()) return null;

  return (
    <div className="growth-note-preview">
      <button
        type="button"
        className="growth-note-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((previous) => !previous)}
      >
        <span aria-hidden="true">
          {expanded ? "▾" : "▸"}
        </span>

        {expanded ? "Hide notes" : "View notes"}
      </button>

      {expanded && (
        <div className="growth-note-content">
          {note}
        </div>
      )}
    </div>
  );
}

function GrowthTrackModule({ user, setUser }) {
  const [goal, setGoal] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const goals = user?.personalTasks || [];

  const saveTasks = async (updatedTasks) => {
    if (!user?.email) {
      throw new Error("User details unavailable. Please log in again.");
    }

    const response = await axios.put(
      `http://localhost:5000/api/auth/profile/${encodeURIComponent(user.email)}`,
      {
        personalTasks: updatedTasks,
      }
    );

    const updatedUser = response.data.user;

    if (!updatedUser) {
      throw new Error("The server did not return updated user details.");
    }

    setUser(updatedUser);

    localStorage.setItem(
      "onboardx-user",
      JSON.stringify(updatedUser)
    );
  };

  const handleSaveGoal = async () => {
    const title = goal.trim();

    if (!title || saving) return;

    setSaving(true);
    setError("");

    try {
      const updatedTasks = [
        ...goals,
        {
          title,
          completed: false,
        },
      ];

      await saveTasks(updatedTasks);

      setGoal("");
      setShowInput(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not save goal."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleGoal = async (index) => {
  if (saving) return;

  const task = goals[index];

  if (!task?._id || !user?.email) {
    setError("Goal details are unavailable. Reopen Growth Track.");
    return;
  }

  setSaving(true);
  setError("");

  try {
    if (task.completed) {
      // Uncheck the goal without removing earned activity dates.
      const updatedTasks = goals.map((item, taskIndex) =>
        taskIndex === index
          ? { ...item, completed: false }
          : item
      );

      await saveTasks(updatedTasks);
    } else {
      // Complete the goal and record today's activity on the backend.
      const response = await axios.put(
        `/api/auth/growth-goals/${encodeURIComponent(
          user.email
        )}/${encodeURIComponent(task._id)}/complete`,
        {},
        {
          baseURL: "http://localhost:5000",
        }
      );

      const updatedUser = response.data.user;

      if (!updatedUser) {
        throw new Error("The server did not return updated user details.");
      }

      setUser(updatedUser);

      localStorage.setItem(
        "onboardx-user",
        JSON.stringify(updatedUser)
      );
    }
  } catch (error) {
    setError(
      error.response?.data?.message ||
        error.message ||
        "Could not update goal."
    );
  } finally {
    setSaving(false);
  }
};

  const handleDeleteGoal = async (index) => {
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const updatedTasks = goals.filter(
        (_, taskIndex) => taskIndex !== index
      );

      await saveTasks(updatedTasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not delete goal."
      );
    } finally {
      setSaving(false);
    }
  };

  
  const [streakNow, setStreakNow] = useState(() => Date.now());

useEffect(() => {
  const timer = window.setInterval(() => {
    setStreakNow(Date.now());
  }, 60000);

  return () => window.clearInterval(timer);
}, []);

const getGrowthStreak = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(streakNow));

  const getPart = (type) =>
    parts.find((part) => part.type === type).value;

  const today = [
    getPart("year"),
    getPart("month"),
    getPart("day"),
  ].join("-");

  const activityDates = new Set(
    user?.growthActivityDates || []
  );

  const previousDay = (dateKey) => {
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  };

  let cursor = activityDates.has(today)
    ? today
    : previousDay(today);

  let currentStreak = 0;

  while (activityDates.has(cursor)) {
    currentStreak += 1;
    cursor = previousDay(cursor);
  }

  return {
    currentStreak,
    activeToday: activityDates.has(today),
  };
};

const { currentStreak, activeToday } = getGrowthStreak();

 return (
  <section className="module-page">
    <div
      className="module-heading"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%",
      }}
    >
      <div>
        <p className="workspace-eyebrow">
          PERSONAL GROWTH
        </p>

        <h1>Growth Track</h1>

        <p>
          Set goals, track learning and celebrate achievements.
        </p>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          flexShrink: 0,
          gap: "8px",
          marginLeft: "auto",
          padding: "9px 15px",
          borderRadius: "999px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.22)",
          color: "inherit",
          fontSize: "13px",
          lineHeight: "1.4",
          whiteSpace: "nowrap",
        }}
        title={
          activeToday
            ? "You completed a goal today."
            : "Complete a goal today to keep your streak going."
        }
      >
        <span aria-hidden="true">🔥</span>

        <strong>
          {currentStreak} {currentStreak === 1 ? "day" : "days"}
        </strong>

       
      </div>
    </div>

      <div className="workspace-panel">
        <div className="panel-heading">
          <div>
            <h2
              style={{
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              🎯 Current Goals
            </h2>
          </div>

          <button
            type="button"
            className="text-action"
            disabled={saving}
            onClick={() => {
              setShowInput((previous) => !previous);
              setError("");
            }}
          >
            {showInput ? "Hide" : "+ Add Goal"}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            style={{
              color: "#dc2626",
              marginTop: "12px",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}

        {showInput && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              background: "#ffffff",
              border: "1px solid #edf2f7",
              borderRadius: "18px",
              maxWidth: "650px",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
            }}
          >
            <input
              type="text"
              value={goal}
              placeholder="What would you like to achieve?"
              aria-label="Goal title"
              disabled={saving}
              onChange={(event) => setGoal(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  handleSaveGoal();
                }
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "15px",
                background: "#f8fafc",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={handleSaveGoal}
              disabled={saving || !goal.trim()}
              className="text-action"
              style={{
                marginTop: "14px",
                padding: "10px 16px",
                borderRadius: "10px",
              }}
            >
              {saving ? "Saving..." : "Save Goal"}
            </button>
          </div>
        )}

        {goals.length > 0 ? (
          goals.map((task, index) => (
            <div
              key={task._id || index}
              className="task-preview-row"
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                className={`task-check${
                  task.completed ? " is-done" : ""
                }`}
                role="checkbox"
                aria-checked={Boolean(task.completed)}
                aria-label={`Mark ${task.title} as ${
                  task.completed ? "in progress" : "completed"
                }`}
                aria-disabled={saving}
                tabIndex={saving ? -1 : 0}
                style={{
                  cursor: saving ? "default" : "pointer",
                }}
                onClick={() => handleToggleGoal(index)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleToggleGoal(index);
                  }
                }}
              >
                {task.completed ? "✓" : ""}
              </span>

              <span>
               <GoalNotes task={task} user={user} setUser={setUser} />
                <GoalNotePreview note={task.note} />

                <small>
                  {task.completed
                    ? "Completed"
                    : "In Progress"}
                </small>

                <small
                  role="button"
                  aria-label={`Delete ${task.title}`}
                  aria-disabled={saving}
                  tabIndex={saving ? -1 : 0}
                  onClick={() => handleDeleteGoal(index)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      handleDeleteGoal(index);
                    }
                  }}
                  style={{
                    color: "#94a3b8",
                    cursor: saving ? "default" : "pointer",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Delete
                </small>
              </span>
            </div>
          ))
        ) : (
          !showInput && (
            <div
              className="task-preview-row"
              style={{ marginTop: "20px" }}
            >
              <span className="task-check"></span>

              <span>
                <strong>No goals added yet</strong>

                <small>
                  Click "+ Add Goal" to create your first goal.
                </small>
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function AssignTasksModule() {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchInterns = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/interns"
      );

      setInterns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load interns. Please try again.");
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/interns"
      );
      const allTasks = [];

      (Array.isArray(response.data) ? response.data : []).forEach((intern) => {
        (intern.assignedTasks || []).forEach((task) => {
         allTasks.push({
  ...task,
  email: intern.email,
  internName:
    intern.fullName ||
    intern.name ||
    intern.email,
  fetchOrder: allTasks.length,
});
        });
      });
      setAssignedTasks(allTasks);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load assigned tasks. Please try again.");
    }
  };

  const visibleTasks = useMemo(() => {
    const getCreatedTime = (task) => {
      for (const value of [task.createdAt, task.assignedAt, task.timestamp]) {
        const time = value ? new Date(value).getTime() : NaN;
        if (Number.isFinite(time)) return time;
      }

      const id = String(task._id || task.id || "");
      if (/^[a-f\d]{24}$/i.test(id)) {
        return parseInt(id.slice(0, 8), 16) * 1000;
      }

      return null;
    };

    const query = searchQuery.trim().toLocaleLowerCase();

    return assignedTasks
      .filter((task) => {
        if (!query) return true;
        return `${task.internName || ""} ${task.title || ""}`
          .toLocaleLowerCase()
          .includes(query);
      })
      .slice()
      .sort((a, b) => {
        const aTime = getCreatedTime(a);
        const bTime = getCreatedTime(b);

        if (aTime !== null && bTime !== null) return bTime - aTime;
        if (aTime !== null) return -1;
        if (bTime !== null) return 1;
        return b.fetchOrder - a.fetchOrder;
      });
  }, [assignedTasks, searchQuery]);

  useEffect(() => {
    fetchInterns();
    fetchAssignedTasks();
  }, []);

  const handleEdit = (task) => {
     console.log(task);
  setIsEditing(true);
  setEditingTask(task);

  setSelectedIntern(task.email);
  setTaskTitle(task.title);
  setDueDate(task.dueDate);
  setShowForm(true);};

  const handleDelete = async (task) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/auth/delete-task/${task.email}/${task._id}`
    );

    await fetchAssignedTasks();
  } catch (error) {
    console.error(error);
    alert("Failed to delete task");
  }
};


  const handleAssignTask = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/assign-task",
        {
          email: selectedIntern,
          title: taskTitle,
          dueDate,
        }
      );

      await fetchAssignedTasks();
      setTaskTitle("");
      setDueDate("");
      setSelectedIntern("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to assign task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">TASK ASSIGNMENT</p>
          <h1>Assign Tasks</h1>
          <p>Create and assign tasks to interns.</p>
        </div>
        <button
          type="button"
          className="text-action"
          onClick={() => setShowForm(true)}
        >
          + Assign Task
        </button>
      </div>

      <div className="workspace-panel assign-tasks-panel">
        {showForm && (
          <form onSubmit={handleAssignTask}>
            <h2>Assign Task Form</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <label>
                Select Intern
                <select
                  required
                  value={selectedIntern}
                  onChange={(event) => setSelectedIntern(event.target.value)}
                  className="hr-search"
                  style={{ display: "block", width: "100%", marginTop: "6px" }}
                >
                  <option value="">Select Intern</option>
                  {interns.map((intern) => (
                    <option key={intern._id} value={intern.email}>
                      {intern.fullName || intern.name || intern.email}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Task Title
                <input
                  required
                  type="text"
                  placeholder="Task Title"
                  className="hr-search"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  style={{ display: "block", width: "100%", marginTop: "6px" }}
                />
              </label>
              <label>
                Due Date
                <input
                  required
                  type="date"
                  className="hr-search"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  style={{ display: "block", width: "100%", marginTop: "6px" }}
                />
              </label>
            </div>
            <button type="submit" className="text-action" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Task"}
            </button>
            <button
              type="button"
              className="text-action"
              onClick={() => setShowForm(false)}
              disabled={isSaving}
              style={{ marginLeft: "16px" }}
            >
              Cancel
            </button>
          </form>
        )}

        {errorMessage && (
          <p role="alert" style={{ color: "#b42318", marginTop: "12px" }}>
            {errorMessage}
          </p>
        )}

        <div
          className="assigned-tasks-section"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            marginTop: showForm ? "24px" : 0,
          }}
        >
          <h2>Assigned Tasks ({assignedTasks.length})</h2>
          <label style={{ display: "block", margin: "10px 0 12px" }}>
            <span style={{ display: "block", marginBottom: "6px" }}>
              Search tasks
            </span>
            <input
              type="search"
              className="hr-search"
              placeholder="Search by intern or task title"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search tasks by intern name or task title"
              style={{ width: "min(100%, 360px)" }}
            />
          </label>
          <div className="task-table-wrapper">
            <table className="hr-table assign-tasks-table">
              <thead>
                <tr>
                  <th scope="col">Intern</th>
                  <th scope="col">Task</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                  
                </tr>
              </thead>
              <tbody>
                {visibleTasks.length > 0 ? (
                  visibleTasks.map((task, index) => (
                 <tr
  key={
    task._id ||
    `${task.internName}-${task.title}-${task.fetchOrder ?? index}`
  }
>
  <td>{task.internName}</td>
  <td>{task.title}</td>
  <td>{task.dueDate}</td>
  <td>{task.status || "Pending"}</td>

 <td
  style={{
    display: "flex",
    gap: "8px",
  }}
>
  <button
    className="text-action"
    onClick={() => handleEdit(task)}
  >
    Edit
  </button>

  <button
    className="text-action"
    style={{
      color: "red",
    }}
    onClick={() => handleDelete(task)}
  >
    Delete
  </button>
</td>


</tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      {assignedTasks.length
                        ? "No tasks match your search."
                        : "No tasks assigned yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsModule({ theme, setTheme }) {
  const choices = [
    { id: "light", name: "Light", detail: "Bright, calm workspace" },
    { id: "dark", name: "Dark", detail: "Low-glare surfaces" },
    { id: "soft", name: "Soft", detail: "A warmer, gentle palette" },
  ];

  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">PREFERENCES</p>
          <h1>Workspace settings</h1>
          <p>Make OnboardX feel right for your workday.</p>
        </div>
      </div>

      <section className="settings-panel">
        <div className="theme-choice-grid">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={`theme-choice ${
                theme === choice.id ? "is-selected" : ""
              }`}
              onClick={() => {
                setTheme(choice.id);
                localStorage.setItem("onboardx-theme", choice.id);
              }}
            >
              <strong>{choice.name}</strong>
              <small>{choice.detail}</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function ActivityModule({user}) {

   const [interns, setInterns] = useState([]);

  const documentCount = Object.values(
  user?.documents || {}
).filter(Boolean).length;

const goalsCount =
  user?.personalTasks?.length || 0;

const getCurrentStreak = () => {
  const activityDates = user?.growthActivityDates || [];

  if (!activityDates.length) return 0;

  const sorted = [...activityDates].sort();

  let streak = 1;

  for (let i = sorted.length - 1; i > 0; i--) {
    const current = new Date(sorted[i]);
    const previous = new Date(sorted[i - 1]);

    const diff =
      (current - previous) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const currentStreak = getCurrentStreak();

const fetchInterns = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/all-users"
    );

    const onlyInterns = response.data.users.filter(
      (user) => user.role === "intern"
    );

    setInterns(onlyInterns);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchInterns();
}, []);

const totalInterns = interns.length;

const verifiedInterns = interns.filter((intern) => {
  const docs = Object.values(
    intern.documents || {}
  );

  return docs.length > 0 &&
    docs.every(
      (doc) => doc?.status === "Verified"
    );
}).length;

const pendingReviews = interns.reduce(
  (count, intern) => {
    const docs = Object.values(
      intern.documents || {}
    );

    return (
      count +
      docs.filter(
        (doc) => doc?.status === "Pending"
      ).length
    );
  },
  0
);

const avgProgress =
  totalInterns > 0
    ? Math.round(
        (verifiedInterns / totalInterns) * 100
      )
    : 0;
    <div className="journey-badges"></div>

    const chartData = interns.map((intern) => {
  const docs = Object.values(
    intern.documents || {}
  );

  const uploadedDocs =
    docs.filter((doc) => doc?.url).length;

  const verifiedDocs =
    docs.filter(
      (doc) => doc?.status === "Verified"
    ).length;

  const completedTasks =
    (intern.assignedTasks || []).filter(
      (task) => task.status === "Completed"
    ).length;

  let progress = 0;

  if (uploadedDocs >= 4) progress += 40;
  if (verifiedDocs >= 4) progress += 40;
  if (completedTasks > 0) progress += 20;

  return {
    name: intern.fullName,
    progress,
    uploadedDocs,
    verifiedDocs,
    completedTasks,
  };
});

const profileCompleted =
  !!(
    user?.phone &&
    user?.country &&
    user?.state &&
    user?.city
  );

const documentsCompleted =
  !!(
    user?.documents?.aadhaar &&
    user?.documents?.pan &&
    user?.documents?.resume &&
    user?.documents?.degree
  );

  const updates = [];

if (profileCompleted) {
  updates.push({
    label: "Profile completed",
    detail: "Your onboarding profile is ready",
    time: "Completed",
    color: "marker-green",
  });
}

if (documentsCompleted) {
  updates.push({
    label: "Documents uploaded",
    detail: "Required onboarding documents submitted",
    time: "Done",
    color: "marker-blue",
  });
}

if (user?.securityCompleted) {
  updates.push({
    label: "Security guide completed",
    detail: "Security basics reviewed successfully",
    time: "Done",
    color: "marker-green",
  });
}

if (user?.personalTasks?.length > 0) {
  updates.push({
    label: "Growth Track started",
    detail: "Learning goals and notes are being tracked",
    time: "Active",
    color: "marker-amber",
  });
}

if (currentStreak > 0) {
  updates.push({
    label: "Growth streak active",
    detail: `Current streak: ${currentStreak} day${currentStreak > 1 ? "s" : ""}`,
    time: "🔥",
    color: "marker-green",
  });
}

  return (
    <section className="module-page insights-page">
      <div className="module-heading">
        <div>
            <p className="panel-eyebrow">
  ONBOARDING INSIGHTS
</p>

<h2>Onboarding Insights</h2>

<p>
Monitor intern onboarding progress, pending reviews and team activities.
</p>


</div>
</div>


<div className="workspace-panel onboarding-chart-panel">
  <h2>Intern Onboarding Progress</h2>

  <div className="onboarding-chart-scroll">
    <div
      className="onboarding-chart"
      style={{ height: `${Math.max(240, chartData.length * 50 + 32)}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 12, right: 42, left: 4, bottom: 12 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 10, fill: "var(--ws-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={112}
            tick={{ fontSize: 11, fill: "var(--ws-secondary)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<InternProgressTooltip />} cursor={false} />
          <Bar
            dataKey="progress"
            fill="var(--ws-blue)"
            background={{ fill: "var(--ws-blue-soft)" }}
            radius={[0, 8, 8, 0]}
            barSize={18}
          >
            <LabelList
              dataKey="progress"
              position="right"
              formatter={(value) => `${value}%`}
              fill="var(--ws-secondary)"
              fontSize={10}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
      
      <div className="activity-module-list">
        {updates.map((item) => (
          <div className="activity-module-row" key={item.label}>
            <span className={`activity-marker ${item.color}`} />
            <span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <time>{item.time}</time>
            
          </div>
        ))}
      </div>
    </section>
  );
}

function ITDashboard({
  theme,
  setTheme,
  profilePic,
  setProfilePic,
  selectedAvatar,
  setSelectedAvatar,
  user,
  setUser,

}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(() => new Date());

useEffect(() => {
  const timer = window.setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => window.clearInterval(timer);
}, []);

const currentDateLabel = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(currentTime);

const currentTimeLabel = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
}).format(currentTime);


  const role =
    location.state?.role || localStorage.getItem("onboardx-role") || "intern";
  const displayRole =
    role === "hr"
      ? "HR"
      : role === "it"
        ? "IT"
        : role === "manager"
          ? "Manager"
          : "Intern";
  const displayName =
    user?.fullName || user?.name || user?.email || "Your account";
const activeModule = useMemo(() => {
  const matchedModule = modules.find(
    (module) => module.path === location.pathname
  );

  if (matchedModule) {
    return matchedModule.id;
  }

  if (
    location.pathname === "/activity" ||
    location.pathname === "/hr-dashboard/insights"
  ) {
    return "activity";
  }

  return "dashboard";
}, [location.pathname]);

  useEffect(() => {
  const visitedPages = JSON.parse(
    localStorage.getItem("visitedPages") || "[]"
  );

  if (!visitedPages.includes(activeModule)) {
    visitedPages.push(activeModule);

    localStorage.setItem(
      "visitedPages",
      JSON.stringify(visitedPages)
    );
  }
}, [activeModule]);


useEffect(() => {
  const requiredPages = [
    "dashboard",
    "profile",
    "documents",
  ];

  const visitedPages = JSON.parse(
    localStorage.getItem("visitedPages") || "[]"
  );

  const completed = requiredPages.every((page) =>
    visitedPages.includes(page)
  );

  if (completed && !user?.workspaceCompleted) {
    const updateWorkspace = async () => {
      const storedUser = JSON.parse(
        localStorage.getItem("onboardx-user")
      );

      await axios.put(
        `http://localhost:5000/api/auth/profile/${storedUser.email}`,
        {
          workspaceCompleted: true,
        }
      );

      window.location.reload();
    };

    updateWorkspace();
  }
}, [activeModule, user]);


  const activeLabel =
    activeModule === "activity"
      ? "Onboarding Insights"
      : modules.find((module) => module.id === activeModule)?.label ||
        "Dashboard";
  const goTo = (path) => {
    navigate(path, { state: { role } });
    setAvatarMenuOpen(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("onboardx-user"));

      const formData = new FormData();

      formData.append("profilePic", file);

      const response = await axios.post(
        `http://localhost:5000/api/auth/upload-profile-pic/${storedUser.email}`,
        formData,
      );

      const imageUrl = `http://localhost:5000/uploads/${response.data.profilePic}`;

      setProfilePic(imageUrl);

      setAvatarMenuOpen(false);
    } catch (error) {
      console.error("Profile picture upload failed:", error);
    }
  };
  return (
    <div className={`onboard-workspace theme-${theme}`}>
      <aside className="workspace-sidebar">
        <button
          className="workspace-brand"
          type="button"
          onClick={() => goTo("/it-dashboard")}
        >
          <span className="workspace-brand-mark">OX</span>
          <span>
            OnboardX<small>PEOPLE WORKSPACE</small>
          </span>
        </button>
        <div className="sidebar-person">
          <div className="sidebar-avatar-wrap">
            <button
              type="button"
              className="sidebar-avatar"
              onClick={() => setAvatarMenuOpen((open) => !open)}
              aria-label="Change profile photo"
            >
              {profilePic ? <img src={profilePic} alt="" /> : selectedAvatar}
            </button>

            {avatarMenuOpen && (
              <div className="avatar-menu">
                <p>Profile Photo</p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 60px)",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  {["👨‍💼", "👩‍💼", "🧑‍💻", "👨‍🔧", "👩‍🎓", "👨‍🚀"].map(
                    (avatar) =>
                      (
                        <button
                          key={avatar}
                          type="button"
                          className="avatar-option"
                          onClick={async () => {
                            try {
                              const storedUser = JSON.parse(
                                localStorage.getItem("onboardx-user"),
                              );

                              await axios.put(
                                `http://localhost:5000/api/auth/profile/${storedUser.email}`,
                                {
                                  selectedAvatar: avatar,
								  profilePic: "",
                                },
                              );

                              setProfilePic(null);
                              setSelectedAvatar(avatar);
                              setAvatarMenuOpen(false);
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          {avatar}
                        </button>
					  )
                  )}
                </div>

                <label>
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setProfilePic(null);
                    setSelectedAvatar("👨‍💼");
                    setAvatarMenuOpen(false);
                  }}
                >
                  Reset Avatar
                </button>
              </div>
            )}
          </div>

          <div className="sidebar-person-copy">
            <strong>{displayName}</strong>
            <span>{displayRole} workspace</span>
          </div>
          <span className="person-presence" aria-label="Online" />
        </div>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          <p className="nav-label">WORKSPACE</p>
          {modules.map((module) => (
            <button
              type="button"
              key={module.id}
              className={`workspace-nav-item${activeModule === module.id ? " is-active" : ""}`}
              onClick={() => goTo(module.path)}
              aria-current={activeModule === module.id ? "page" : undefined}
            >
              <Icon name={module.icon} />
              <span>{module.label}</span>
              {module.id === "tasks" && <span className="nav-count">4</span>}
            </button>
          ))}
          <p className="nav-label nav-label-bottom">YOUR TEAM</p>
          <button
            type="button"
            className={`workspace-nav-item${activeModule === "activity" ? " is-active" : ""}`}
            onClick={() =>goTo("/it-dashboard")}
          >
            <Icon name="bell" />
            <span>Onboarding Insights</span>
            <span className="nav-unread" />
          </button>
        </nav>
        <footer className="sidebar-footer">
          <div className="sidebar-secure">
            <span>✓</span>
            <span>
              <strong>Secure workspace</strong>
              <small>Your data is protected</small>
            </span>
          </div>
          <span className="sidebar-version">ONBOARDX · 2026</span>
        </footer>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activeLabel}</strong>
          </div>
          <div className="topbar-actions">
           <span
  className="topbar-date"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
    whiteSpace: "nowrap",
  }}
>
  <span>{currentDateLabel}</span>

  <span style={{ fontSize: "12px", opacity: 0.75 }}>
    {currentTimeLabel} IST
  </span>
</span>

            <button
              className="topbar-help"
              type="button"
              onClick={() => goTo("/it-dashboard/insights")}
              aria-label="Open recent activity"
            >
              <Icon name="bell" />
              <i />
            </button>
            <span className="topbar-divider" />
            <button
              className="topbar-identity"
              type="button"
              onClick={() => goTo("/profile")}
            >
              <span>
                {profilePic ? <img src={profilePic} alt="" /> : selectedAvatar}
              </span>
              <strong>{displayName}</strong>
            </button>
          </div>
        </header>
        <div className="workspace-content">
          <ModulePage
            section={activeModule}
            role={role}
            user={user}
            setUser={setUser}
            profilePic={profilePic}
            selectedAvatar={selectedAvatar}
            onNavigate={goTo}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      </main>
    </div>
  );
}

export default ITDashboard;
