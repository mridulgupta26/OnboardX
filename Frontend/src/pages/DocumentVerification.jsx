import { useEffect, useState } from "react";
import axios from "axios";

function DocumentVerification() {
  const [interns, setInterns] = useState([]);

   const [selectedIntern, setSelectedIntern] =
   useState(null);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/all-users"
      );

      const filteredInterns = response.data.users.filter(
        (user) => user.role === "intern"
      );

      setInterns(filteredInterns);
    } catch (error) {
      console.error(error);
    }
  };
   
  const getDocumentStatus = (document) => {
  if (!document) return "Not Uploaded";

  if (typeof document === "object") {
    return document.status || "Pending";
  }

  return "Uploaded";
};

const getOverallStatus = (documents) => {
  const docs = [
    documents?.aadhaar,
    documents?.pan,
    documents?.resume,
    documents?.degree,
  ];

  const statuses = docs
    .filter(Boolean)
    .map((doc) => doc?.status);

  if (statuses.includes("Rejected")) {
    return "❌";
  }

  if (
    statuses.length > 0 &&
    statuses.every(
      (status) => status === "Verified"
    )
  ) {
    return "✅";
  }

  return "🟡";
};

const getDocumentFile = (document) => {
  if (!document) return "";

  if (typeof document === "object") {
    return document.url || "";
  }

  return document;
};

const updateStatus = async (
  documentType,
  status
) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/auth/document-status/${selectedIntern.email}/${documentType}`,
      {
        status,
      }
    );

    setSelectedIntern((prev) => ({
      ...prev,
      documents: response.data.documents,
    }));
  } catch (error) {
    console.error(error);
  }
};

const viewButtonStyle = {
  padding: "6px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  background: "#fff",
  color: "#374151",
  fontSize: "12px",
  fontWeight: "500",
  cursor: "pointer",
};

const verifyButtonStyle = {
  padding: "6px 12px",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  background: "#f0fdf4",
  color: "#16a34a",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const rejectButtonStyle = {
  padding: "6px 12px",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#dc2626",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const actionContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "10px",
};
const renderActions = (documentType, document) => {
  if (!document?.url) return null;

  return (
    <>
      <button
        type="button"
        style={viewButtonStyle}
        onClick={() =>
          window.open(
            `http://localhost:5000/uploads/${document.url}`,
            "_blank"
          )
        }
      >
        👁 View
      </button>

      {document?.status === "Pending" && (
        <div style={actionContainerStyle}>
          <button
            type="button"
            style={verifyButtonStyle}
            onClick={() =>
              updateStatus(documentType, "Verified")
            }
          >
            ✅ Verify
          </button>

          <button
            type="button"
            style={rejectButtonStyle}
            onClick={() =>
              updateStatus(documentType, "Rejected")
            }
          >
            ❌ Reject
          </button>
        </div>
      )}
    </>
  );
};


  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <p className="workspace-eyebrow">
            DOCUMENT VERIFICATION
          </p>

          <h1>Document Verification</h1>

          <p>
            Review and verify intern documents.
          </p>
        </div>
      </div>

     <div
  style={{
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
  }}
>
  {/* LEFT PANEL */}
   <div
  className="workspace-panel"
  style={{
    height: "650px",
    overflowY: "auto",
  }}
>
    {interns.map((intern) => (
      <div
        key={intern._id}
        onClick={() => setSelectedIntern(intern)}
        style={{
          padding: "15px",
          borderBottom: "1px solid #e5e7eb",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          
        }}
      >
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <span>
    {getOverallStatus(
      intern.documents
    )}
  </span>

  <strong>{intern.fullName}</strong>
</div>


        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          →
        </span>
      </div>

      
    ))}



  </div>

  

  {/* RIGHT PANEL */}
 <div
  className="workspace-panel"
   style={{
     maxHeight: "70vh",
     overflowY: "scroll",
     paddingRight: "8px",
}}
>
    {selectedIntern ? (
  <>
  <h2>{selectedIntern.fullName}</h2>

  <p>{selectedIntern.email}</p>

  <hr />

  <div
    style={{
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      marginTop: "16px",
    }}
  >
    <strong>Aadhaar Card</strong>

    <p>
      Status:{" "}
      {getDocumentStatus(
        selectedIntern.documents?.aadhaar
      )}
    </p>

    <p>
  File:
  {" "}
  {getDocumentFile(
    selectedIntern.documents?.aadhaar
  ) || "Not Uploaded"}
</p>


{renderActions(
  "aadhaar",
  selectedIntern.documents?.aadhaar
)}

  </div>

  <div
    style={{
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      marginTop: "16px",
    }}
  >
    <strong>PAN Card</strong>

    <p>
      Status:{" "}
      {getDocumentStatus(
        selectedIntern.documents?.pan
      )}
    </p>

    <p>
  File:{" "}
  {getDocumentFile(
    selectedIntern.documents?.pan
  ) || "Not Uploaded"}
</p>

{renderActions(
  "pan",
  selectedIntern.documents?.pan
)}

  </div>

  <div
    style={{
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      marginTop: "16px",
    }}
  >
    <strong>Resume</strong>

    <p>
      Status:{" "}
      {getDocumentStatus(
        selectedIntern.documents?.resume
      )}
    </p>

    <p>
  File:{" "}
  {getDocumentFile(
    selectedIntern.documents?.resume
  ) || "Not Uploaded"}
</p>

{renderActions(
  "resume",
  selectedIntern.documents?.resume
)}
  </div>



  <div
    style={{
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      marginTop: "16px",
    }}
  >
    <strong>Degree Certificate</strong>

    <p>
      Status:{" "}
      {getDocumentStatus(
        selectedIntern.documents?.degree
      )}
    </p>

    <p>
  File:{" "}
  {getDocumentFile(
    selectedIntern.documents?.degree
  ) || "Not Uploaded"}
</p>
{renderActions(
  "degree",
  selectedIntern.documents?.degree
)}
  </div>
</>
    ) : (
      <p>Select an intern to view details</p>
    )}
  </div>
</div>



    </section>
  );
}

export default DocumentVerification;