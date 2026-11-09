import { useState, useEffect } from "react";
import axios from "axios";

const documentTypes = [
  {
    id: "aadhaar",
    name: "Aadhaar card",
    detail: "Identity verification",
    fileType: "PDF, JPG or PNG",
    accept: ".pdf,.jpg,.jpeg,.png",
    tag: "ID",
  },
  {
    id: "pan",
    name: "PAN card",
    detail: "Tax identification",
    fileType: "PDF, JPG or PNG",
    accept: ".pdf,.jpg,.jpeg,.png",
    tag: "ID",
  },
  {
    id: "resume",
    name: "Resume",
    detail: "Professional background",
    fileType: "PDF or DOCX",
    accept: ".pdf,.doc,.docx",
    tag: "CV",
  },
  {
    id: "degree",
    name: "Degree certificate",
    detail: "Education verification",
    fileType: "PDF, JPG or PNG",
    accept: ".pdf,.jpg,.jpeg,.png",
    tag: "ED",
  },
];

function Documents({user, setUser}) {
  const [documents, setDocuments] = useState({
    aadhaar: {},
    pan: {},
    resume: {},
    degree: {},
  });

useEffect(() => {
  console.log("USER PROP:", user);
  if (user?.documents) {

    setDocuments({
      aadhaar: user.documents.aadhaar || {},
      pan: user.documents.pan || {},
      resume: user.documents.resume || {},
      degree: user.documents.degree || {},
    });

  }
}, [user]);

const hasDocument = (document) => {
  if (!document) return false;

  if (typeof document === "object") {
    return Boolean(document.url);
  }

  return Boolean(document);
};

const getVerificationStatus = (document) => {
  if (!document || typeof document !== "object") {
    return null;
  }

  return document.status || "Pending";
};

const getVerificationBadge = (document) => {
  const status = getVerificationStatus(document);

  if (status === "Verified") {
    return {
      text: "Verified",
      background: "#dcfce7",
      color: "#15803d",
    };
  }

  if (status === "Rejected") {
    return {
      text: "Rejected",
      background: "#fee2e2",
      color: "#dc2626",
    };
  }

  return {
    text: "Pending",
    background: "#fef3c7",
    color: "#d97706",
  };
};

 const uploadedCount = Object.values(documents).filter(
  (doc) => hasDocument(doc)
).length;

  const handleUpload = async (event, documentId) => {
  const file = event.target.files?.[0];

  console.log("FILE SELECTED:", file);
  console.log("DOCUMENT ID:", documentId);

  if (!file) return;

  try {
    console.log("TRY BLOCK STARTED");

   const storedUser = JSON.parse(
  localStorage.getItem("onboardx-user")
);


    console.log("USER:", user);

    const formData = new FormData();
    formData.append("document", file);

    const response = await axios.post(
      `http://localhost:5000/api/auth/upload-document/${storedUser.email}/${documentId}`,

      formData
    );

    console.log("UPLOAD RESPONSE:", response.data);

    setDocuments((previous) => ({
      ...previous,
      [documentId]: response.data.documents[documentId],
    }));

   setUser((prev) => ({
  ...prev,
  documents: response.data.documents,
     }));


     localStorage.setItem(
  "onboardx-user",
  JSON.stringify({
    ...storedUser,
    documents: response.data.documents,
  })
);



  } catch (error) {
    console.error("UPLOAD ERROR:", error);
  }
};

const handleDelete = async (documentId) => {
  try {
    const storedUser = JSON.parse(
      localStorage.getItem("onboardx-user")
    );

    if (!storedUser?.email) {
      console.error("Please log in again.");
      return;
    }

    const response = await axios.delete(
      `http://localhost:5000/api/auth/delete-document/${encodeURIComponent(
        storedUser.email
      )}/${documentId}`
    );

    if (!response.data.success) {
      throw new Error("Document could not be removed.");
    }

    setDocuments((previous) => {
      const updatedDocuments = { ...previous };
      updatedDocuments[documentId] = {};
      return updatedDocuments;
    });
     
    setUser((prev) => ({
      ...prev,
       documents: response.data.documents,
     }));
     
    storedUser.documents = response.data.documents;

    localStorage.setItem(
      "onboardx-user",
      JSON.stringify(storedUser)
    );
  } catch (error) {
    console.error(
      "Delete failed:",
      error.response?.data?.message || error.message
    );
  }
};
  return (
    <section className="documents-module">
      <header className="documents-module-heading">
        <div>
          <p className="workspace-eyebrow">SECURE FILES</p>
          <h1>Documents</h1>
          <p>Share the essentials to get your workspace ready.</p>
        </div>

        <span className="document-summary-pill">
          <strong>{uploadedCount}</strong> of 4 uploaded
        </span>
      </header>

      <div className="documents-module-grid">
        {documentTypes.map((document) => (
          <article
            className="document-module-card"
            key={document.id}
          >
            <div className="document-module-top">
              <span className="document-module-icon">
                {document.tag}
              </span>

              <span className="document-module-name">
                <strong>{document.name}</strong>
                <small>{document.detail}</small>
              </span>

              <span
  style={{
    padding: "4px 10px",
    borderRadius: "999px",
    background:
      getVerificationBadge(
        documents[document.id]
      ).background,
    color:
      getVerificationBadge(
        documents[document.id]
      ).color,
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  }}
>
  {
    getVerificationBadge(
      documents[document.id]
    ).text
  }
</span>
            </div>

            <p className="document-module-detail">
             {hasDocument(documents[document.id])
             ? documents[document.id]?.url
                : `${document.fileType} · Max 10 MB`}
            </p>

  


            <label className="document-upload-control">
              <span>
                {hasDocument(documents[document.id])
            ? "Replace file"
              : "Choose file"}
              </span>

              <input
                type="file"
                accept={document.accept}
                onChange={(event) =>
                  handleUpload(event, document.id)
                }
              />
            </label>

          {hasDocument(documents[document.id]) && (
              <button
                 className="document-remove"
                type="button"
                 onClick={() => handleDelete(document.id)}
                >
               Remove
            </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Documents;