import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Documents from "./Documents";
import Profile from "./Profile";
import "./EmployeeDashboard.css";

const modules = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "grid",
    path: "/employee-dashboard",
  },
  { id: "profile", label: "My profile", icon: "person", path: "/profile" },
  { id: "documents", label: "Documents", icon: "file", path: "/documents" },
  { id: "tasks", label: "Tasks", icon: "check", path: "/tasks" },
  {
  id: "growthtrack",
  label: "Growth Track",
  icon: "chart",
  path: "/growth-track",
  },

  {
  id: "itassets",
  label: "IT Assets",
  icon: "file",
  path: "/employee-dashboard/it-assets",
},
 
  { id: "settings", label: "Settings", icon: "settings", path: "/settings" },

  
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
  chart: (
    <>
      <path d="M4 19.5h16M6.5 16V11m5.5 5V5m5.5 11V8" />
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
        Boolean(savedDocuments[id]?.url)
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
  ``;

  return (
    <div className="workspace-home">
      <header className="workspace-welcome">
        <div>
          <p className="workspace-eyebrow">ONBOARDING OVERVIEW</p>
          <h1>Welcome back, {displayName.split(" ")[0]}</h1>
          <p>Your next steps are ready when you are.</p>
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
            <span className="summary-kicker">YOUR JOURNEY</span>
            <h2>Onboarding progress</h2>
          </div>
          <span className="summary-number">
            {progress}
            <small>%</small>
          </span>
        </div>
        <div className="summary-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="summary-bottomline">
          <span>You're building a great start.</span>
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
          <span className="stat-label">Tasks completed</span>
          <strong>
            {completeTasks.length}
            <small> / 4</small>
          </strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-icon stat-green">
            <Icon name="file" />
          </span>

          <span className="stat-label">Documents ready</span>

          <strong>
            {documentCount === null ? "..." : documentCount}
            <small> / 4</small>
          </strong>
        </div>

        <div className="workspace-stat">
          <span className="stat-icon stat-amber">
            <Icon name="person" />
          </span>
          <span className="stat-label">Your workspace</span>
          <strong className="stat-role">{roleTitle}</strong>
        </div>
      </div>

      <div className="workspace-lower-grid">
        <section className="workspace-panel task-preview">
          <div className="panel-heading">
            <div>
              <p className="panel-eyebrow">UP NEXT</p>
              <h2>Getting started</h2>
            </div>
            <button
              type="button"
              className="text-action"
              onClick={() => onNavigate("/tasks")}
            >
              All tasks <Icon name="arrow" size={14} />
            </button>
          </div>
           <div className="task-preview-list">
            {tasks.slice(0, 2).map((task, index) => (
              <button
                className="task-preview-row"
                type="button"
                key={task.name}
                onClick={() => onNavigate("/tasks")}
              >
                <span
                  className={`task-check${completeTasks.includes(index) ? " is-done" : ""}`}
                >
                  {completeTasks.includes(index) ? "✓" : ""}
                </span>
                <span>
                  <strong>{task.name}</strong>
                  <small>{task.category}</small>
                </span>
                <span className="task-date">{task.due}</span>
              </button>
            ))}
          </div>
        </section>

 
        <section className="workspace-panel activity-preview">
          <div className="panel-heading">
            <div>
              <p className="panel-eyebrow">JOURNEY TIMELINE</p>
              <h2>My Journey</h2>
            </div>
            <span className="activity-live">
              <i /> LIVE
            </span>
          </div>
          <div className="activity-line">
            <span className="activity-marker marker-green" />
            <span>
              <strong>Welcome to OnboardX</strong>
              <small>Your onboarding workspace is ready</small>
            </span>
            <time>Today</time>
          </div>
          <div className="activity-line">
            <span className="activity-marker marker-blue" />
            <span>
              <strong>Documents requested</strong>
              <small>Identity and education records</small>
            </span>
            <time>Today</time>
          </div>
        </section>
      </div>
    </div>
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
  if (section === "profile")
    return (
      <Profile
        user={user}
        profilePic={profilePic}
        selectedAvatar={selectedAvatar}
      />
    );
  if (section === "documents")
  return (
    <Documents
      user={user}
      setUser={setUser}
    />
  );
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

  if (section === "itassets")
  return <ITAssetsModule />;

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
  const hrAssignedTasks = Array.isArray(user?.assignedTasks)
    ? [...user.assignedTasks].reverse()
    : [];

  console.log(
    "HR ASSIGNED TASKS:",
    user?.assignedTasks
  );

  const handleMarkComplete = async (task) => {
  try {
    const updatedTasks = user.assignedTasks.map((t) =>
      t._id === task._id
        ? { ...t, status: "Completed" }
        : t
    );

    const response = await axios.put(
      `http://localhost:5000/api/auth/profile/${encodeURIComponent(user.email)}`,
      {
        assignedTasks: updatedTasks,
      }
    );

    setUser(response.data.user);

    localStorage.setItem(
      "onboardx-user",
      JSON.stringify(response.data.user)
    );
  } catch (error) {
    console.error("Error completing task:", error);
  }
};

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
      <section className="workspace-panel">
        <div className="panel-heading">
          <div>
            <p className="workspace-eyebrow">YOUR WORK</p>
            <h2>HR ASSIGNED TASKS</h2>
          </div>
        </div>

        {hrAssignedTasks.length > 0 ? (
        <div className="task-preview-list hr-task-scroll">
            {hrAssignedTasks.map((task, index) => {
              const isCompleted =
                String(task.status || "").toLowerCase() === "completed";

              return (
                <div
                  className="task-preview-row"
                  key={task._id || task.id || `${task.title}-${index}`}
                  style={{ cursor: "default" }}
                >
                  <span className="task-check" aria-hidden="true">
                    📌
                  </span>
                  <span>
                    <strong>{task.title || "Untitled task"}</strong>
                    <small>Due: {task.dueDate || "No due date"}</small>
                  </span>
                 <div className="hr-task-actions">

  <span
    className="hr-task-status"
    style={{
      background: isCompleted ? "#dcfce7" : "#ffedd5",
      color: isCompleted ? "#166534" : "#9a3412",
    }}
  >
    {isCompleted ? "Completed" : "Pending"}
  </span>

  {!isCompleted && (
<button
  className="mark-complete-btn"
  type="button"
  onClick={() => handleMarkComplete(task)}
>
  Mark Complete
</button>
              )}
</div>  
            
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "var(--ws-muted)", fontSize: "9px" }}>
            No tasks assigned by HR yet.
          </p>
        )}
      </section>
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

function ITAssetsModule() {
  const [assets, setAssets] = useState([]);

  const storedUser = JSON.parse(
    localStorage.getItem("onboardx-user")
  );

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/assets"
      );

      const myAssets = response.data.filter(
        (asset) =>
          asset.assignedTo === storedUser.fullName
      );

      setAssets(myAssets);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">
            IT ASSETS
          </p>

          <h1>My IT Assets</h1>

          <p>
            Assets assigned by the IT team.
          </p>
        </div>
      </div>

      <div className="workspace-panel">

        {assets.length > 0 ? (
          assets.map((asset) => (
            <div
              key={asset._id}
              className="task-preview-row"
            >
              <span className="task-check">
                💻
              </span>

              <span>
                <strong>
                  {asset.assetName}
                </strong>

                <small>
                  Asset ID: {asset.assetId}
                </small>

                <small>
                  Assigned On: {asset.assignedDate}
                </small>
              </span>

              <span
                className="hr-task-status"
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                }}
              >
                {asset.status}
              </span>
            </div>
          ))
        ) : (
          <p>
            No IT assets assigned yet.
          </p>
        )}
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
    <section className="module-page">
      <div className="module-heading">
        <div>
           <p className="workspace-eyebrow">
             JOURNEY TIMELINE
               </p>

            <h1>My Journey</h1>
<p>Updates from your onboarding journey.</p>

<div className="journey-badges">
 <span>
  {profileCompleted
    ? "✅ Profile Complete"
    : "⏳ Profile Incomplete"}
</span>

  <span>
    📄 {documentCount} Documents
  </span>

  <span>
    🎯 {goalsCount} Goals
  </span>

  <span>
  🔥 {currentStreak} Day Streak
</span>
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

function EmployeeDashboard({
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
  const activeModule = useMemo(
    () =>
      modules.find((module) => module.path === location.pathname)?.id ||
      (location.pathname === "/activity" ? "activity" : "dashboard"),
    [location.pathname],
  );
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

      setUser((prev) => ({
  ...prev,
  workspaceCompleted: true,
}));
    };

    updateWorkspace();
  }
}, [activeModule, user]);


  const activeLabel =
    activeModule === "activity"
      ? "My Journey"
      : modules.find((module) => module.id === activeModule)?.label ||
        "Dashboard";

        const hasRejectedDocument = Object.values(
  user?.documents || {}
).some(
  (doc) => doc?.status === "Rejected"
);

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
          onClick={() => goTo("/employee-dashboard")}
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

{module.id === "documents" &&
  hasRejectedDocument && (
    <span className="nav-unread" />
)}

{module.id === "tasks" && (
  <span className="nav-count">4</span>
)}
            </button>
             ))}
          <p className="nav-label nav-label-bottom">YOUR TEAM</p>
          <button
            type="button"
            className={`workspace-nav-item${activeModule === "activity" ? " is-active" : ""}`}
            onClick={() => goTo("/activity")}
          >
            <Icon name="bell" />
            <span>My Journey</span>
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
              onClick={() => goTo("/activity")}
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

export default EmployeeDashboard;
