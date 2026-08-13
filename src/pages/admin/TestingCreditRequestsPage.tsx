import React, { useCallback, useEffect, useState } from "react";
import "./TestingCreditRequestsPage.css";
const API_BASE_URL = "https://api.magicreel.in";

type TestingCreditRequest = {
  id: string;
  name?: string;
  fullName?: string;
  designation?: string;
  company?: string;
  email: string;
  status: string;
  createdAt?: string;
  created_at?: string;
};

type ApiResponse = {
  success?: boolean;
  requests?: TestingCreditRequest[];
  error?: string;
  message?: string;
};

export default function TestingCreditRequestsPage() {
  const [requests, setRequests] = useState<TestingCreditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("token");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/testing-credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to load testing credit requests."
        );
      }

      setRequests(data.requests || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load testing credit requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    const request = requests.find((item) => item.id === requestId);

    if (!request) {
      return;
    }

    const applicantName =
      request.fullName || request.name || request.email;

    const confirmed = window.confirm(
      action === "approve"
        ? `Approve testing credits for ${applicantName}?\n\nThis will create/activate the BASIC testing account with 10 credits.`
        : `Reject the testing credit request from ${applicantName}?`
    );

    if (!confirmed) {
      return;
    }

    setActionId(requestId);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/testing-credits/${requestId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to ${action} the testing credit request.`
        );
      }

      setMessage(
        action === "approve"
          ? "Testing credit request approved successfully. BASIC account with 10 credits created."
          : "Testing credit request rejected successfully."
      );

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${action} the testing credit request.`
      );
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  );

  const completedRequests = requests.filter(
    (request) => request.status !== "PENDING"
  );

  return (
  <main className="testing-credit-page">
    <div className="testing-credit-container">
            <div className="testing-credit-header">
                    <div>
            <h1 className="testing-credit-title">
              Testing Credit Requests
            </h1>

                        <p className="testing-credit-subtitle">
              Review and manage free testing credit requests.
            </p>
                    <button
            type="button"
            onClick={loadRequests}
            disabled={loading || actionId !== null}
            className="testing-credit-refresh"
          >
            Refresh
          </button>
          </div>
        </div>
        {error && (
  <div className="testing-credit-alert testing-credit-alert-error">
    {error}
  </div>
)}

        {message && (
  <div className="testing-credit-alert testing-credit-alert-success">
    {message}
  </div>
)}

        <section className="testing-credit-section">
  <div className="testing-credit-section-header">
    <h2 className="testing-credit-section-title">
      Pending Requests
    </h2>

    <span className="testing-credit-section-count">
      {pendingRequests.length} pending
    </span>
  </div>

          {loading ? (
  <div className="testing-credit-loading">
    Loading testing credit requests...
  </div>
          ) : pendingRequests.length === 0 ? (
  <div className="testing-credit-empty">
    No pending testing credit requests.
  </div>
          ) : (
            <div className="testing-credit-pending-list">
              {pendingRequests.map((request) => {
                const applicantName =
                  request.fullName || request.name || "Unknown applicant";

                const busy = actionId === request.id;

                return (
                  <article
  key={request.id}
  className="testing-credit-request-card"
>
                    <div>
                      <div className="testing-credit-applicant-name">
  {applicantName}
</div>

                      <div className="testing-credit-applicant-meta">
                        <span>{request.email}</span>

                        {request.designation && (
                          <span>{request.designation}</span>
                        )}

                        {request.company && (
                          <span>{request.company}</span>
                        )}

                        <span>
                          Requested:{" "}
                          {formatDate(
                            request.createdAt || request.created_at
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="testing-credit-actions">
                      <span className="testing-credit-status testing-credit-status-pending">
  PENDING
</span>

                      <button
  type="button"
  onClick={() =>
    handleAction(request.id, "approve")
  }
  disabled={busy || actionId !== null}
  className="testing-credit-approve"
>
  {busy ? "Processing..." : "Approve"}
</button>

                      <button
  type="button"
  onClick={() =>
    handleAction(request.id, "reject")
  }
  disabled={busy || actionId !== null}
  className="testing-credit-reject"
>
  Reject
</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section style={{ marginTop: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 650,
              }}
            >
              Request History
            </h2>

            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              {completedRequests.length} completed
            </span>
          </div>

          {completedRequests.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e4e4e4",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
                color: "#666",
              }}
            >
              No completed requests yet.
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e4e4e4",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "760px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e4e4e4",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "14px 18px" }}>
                        Applicant
                      </th>
                      <th style={{ padding: "14px 18px" }}>
                        Company
                      </th>
                      <th style={{ padding: "14px 18px" }}>
                        Email
                      </th>
                      <th style={{ padding: "14px 18px" }}>
                        Status
                      </th>
                      <th style={{ padding: "14px 18px" }}>
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {completedRequests.map((request) => {
                      const applicantName =
                        request.fullName ||
                        request.name ||
                        "Unknown applicant";

                      return (
                        <tr
                          key={request.id}
                          style={{
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <td style={{ padding: "14px 18px" }}>
                            {applicantName}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            {request.company || "—"}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            {request.email}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                              }}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            {formatDate(
                              request.createdAt ||
                                request.created_at
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
