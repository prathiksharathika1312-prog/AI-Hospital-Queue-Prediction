import React, { useEffect, useState } from "react";
import axios from "axios";

function SmartQueueTurnAlert({ patient, onBack }) {
  const [activeVersion, setActiveVersion] = useState(1);

  const [v1Data, setV1Data] = useState(null);
  const [v2Data, setV2Data] = useState(null);
  const [v3Data, setV3Data] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH V1 + V2 + V3
  // ============================================================

  const fetchTurnAlert = async () => {
    if (!patient?._id) {
      return;
    }

    setError("");

    try {
      const [v1Response, v2Response, v3Response] =
        await Promise.all([
          axios.get(
            `http://localhost:5000/queue/turn-alert/${patient._id}`
          ),

          axios.get(
            `http://localhost:5000/queue/turn-alert-v2/${patient._id}`
          ),

          axios.get(
            `http://localhost:5000/queue/turn-alert-v3/${patient._id}`
          ),
        ]);

      setV1Data(v1Response.data);
      setV2Data(v2Response.data);
      setV3Data(v3Response.data);
    } catch (error) {
      console.error(
        "Smart Queue Turn Alert Error:",
        error
      );

      if (error.response?.status === 404) {
        setError(
          "You do not have an active queue token."
        );
      } else {
        setError(
          "Unable to load smart queue turn alert."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchTurnAlert();
  }, [patient?._id]);

  // ============================================================
  // AUTO REFRESH
  // ============================================================

  useEffect(() => {
    if (!patient?._id) {
      return;
    }

    const interval = setInterval(() => {
      fetchTurnAlert();
    }, 30000);

    return () => clearInterval(interval);
  }, [patient?._id]);

  // ============================================================
  // ALERT CLASS
  // ============================================================

  const getAlertClass = (level) => {
    switch (level) {
      case "Your Turn":
        return "turn-alert-your-turn";

      case "Get Ready":
        return "turn-alert-get-ready";

      case "Getting Closer":
        return "turn-alert-getting-closer";

      case "Waiting":
        return "turn-alert-waiting";

      default:
        return "turn-alert-default";
    }
  };

  // ============================================================
  // MAIN ALERT BOX CLASS
  // ============================================================

  const getAlertBoxClass = (level) => {
    switch (level) {
      case "Your Turn":
        return "turn-alert-box-your-turn";

      case "Get Ready":
        return "turn-alert-box-get-ready";

      case "Getting Closer":
        return "turn-alert-box-getting-closer";

      case "Waiting":
        return "turn-alert-box-waiting";

      default:
        return "turn-alert-box-default";
    }
  };

  // ============================================================
  // ALERT INDICATOR CLASS
  // ============================================================

  const getIndicatorClass = (level) => {
    switch (level) {
      case "Your Turn":
        return "alert-indicator-your-turn";

      case "Get Ready":
        return "alert-indicator-get-ready";

      case "Getting Closer":
        return "alert-indicator-getting-closer";

      case "Waiting":
        return "alert-indicator-waiting";

      default:
        return "alert-indicator-default";
    }
  };

  // ============================================================
  // REUSABLE ALERT DISPLAY
  // ============================================================

  const renderAlert = (data, label) => {
    const alertLevel = data?.alertLevel || "--";

    return (
      <div
        className={`turn-alert-main ${getAlertBoxClass(
          alertLevel
        )}`}
      >
        <div
          className={`turn-alert-icon ${getIndicatorClass(
            alertLevel
          )}`}
          aria-hidden="true"
        >
          <span></span>
        </div>

        <span className="section-label">
          {label}
        </span>

        <h1
          className={getAlertClass(
            alertLevel
          )}
        >
          {alertLevel}
        </h1>

        <p className="turn-alert-message">
          {data?.alertMessage || "--"}
        </p>
      </div>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="patient-dashboard">
        <main className="dashboard-content">

          <button
            className="back-btn"
            type="button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

          <section className="dashboard-panel">
            <div className="loading-state">
              Loading Smart Queue...
            </div>
          </section>

        </main>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="patient-dashboard">
        <main className="dashboard-content">

          <button
            className="back-btn"
            type="button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

          <section className="dashboard-panel">

            <div className="error-state">

              <div className="error-icon">
                <span className="error-indicator"></span>
              </div>

              <h3>
                Unable to Load Alert
              </h3>

              <p>{error}</p>

              <button
                className="retry-btn"
                type="button"
                onClick={fetchTurnAlert}
              >
                ↻ Try Again
              </button>

            </div>

          </section>

        </main>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="patient-dashboard">

      <main className="dashboard-content">

        {/* BACK */}

        <button
          className="back-btn"
          type="button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="welcome-section">

          <div>

            <span className="welcome-label">
              SMART QUEUE
            </span>

            <h2>
              Smart Queue Turn Alert
            </h2>

            <p>
              Know when your consultation turn is getting closer.
            </p>

          </div>

          <div className="system-status">

            <span className="status-dot"></span>

            Live Prediction

          </div>

        </section>

        {/* ======================================================
            CURRENT ALERT
        ====================================================== */}

        <section className="dashboard-panel">

          {renderAlert(
            v3Data,
            "YOUR QUEUE ALERT"
          )}

        </section>

        {/* ======================================================
            PREDICTION TECHNOLOGY
        ====================================================== */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <span className="section-label">
                SMART QUEUE
              </span>

              <h3>
                Prediction Technology
              </h3>

            </div>

          </div>

          <div className="version-selector">

            {/* BASIC ALERT */}

            <button
              type="button"
              className={
                activeVersion === 1
                  ? "version-card active"
                  : "version-card"
              }
              onClick={() =>
                setActiveVersion(1)
              }
            >

              <span className="version-icon version-icon-basic">
                <span></span>
              </span>

              <strong>
                Basic Alert
              </strong>

              <small>
                Queue Position
              </small>

            </button>

            {/* SMART ALERT */}

            <button
              type="button"
              className={
                activeVersion === 2
                  ? "version-card active"
                  : "version-card"
              }
              onClick={() =>
                setActiveVersion(2)
              }
            >

              <span className="version-icon version-icon-smart">
                <span></span>
              </span>

              <strong>
                Smart Alert
              </strong>

              <small>
                Waiting Time
              </small>

            </button>

            {/* AI ALERT */}

            <button
              type="button"
              className={
                activeVersion === 3
                  ? "version-card active"
                  : "version-card"
              }
              onClick={() =>
                setActiveVersion(3)
              }
            >

              <span className="version-icon version-icon-ai">
                <span></span>
              </span>

              <strong>
                AI Alert
              </strong>

              <small>
                Intelligent Prediction
              </small>

            </button>

          </div>

        </section>

        {/* ======================================================
            BASIC ALERT
        ====================================================== */}

        {activeVersion === 1 && (

          <>

            <section className="dashboard-panel">

              <span className="section-label">
                BASIC ALERT
              </span>

              <h3>
                Basic Queue Alert
              </h3>

              <p>
                A simple alert based on your current
                queue position.
              </p>

              {renderAlert(
                v1Data,
                "YOUR QUEUE ALERT"
              )}

            </section>

            <section className="dashboard-panel">

              <div className="panel-heading">

                <div>

                  <span className="section-label">
                    QUEUE INFORMATION
                  </span>

                  <h3>
                    Your Current Position
                  </h3>

                </div>

              </div>

              <div className="live-summary-grid">

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-token"></span>
                  </div>

                  <div>
                    <span>Your Token</span>

                    <strong>
                      {v1Data?.tokenNumber}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-position"></span>
                  </div>

                  <div>
                    <span>Queue Number</span>

                    <strong>
                      {v1Data?.queueNumber}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-patients"></span>
                  </div>

                  <div>
                    <span>Patients Ahead</span>

                    <strong>
                      {v1Data?.patientsAhead}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-status"></span>
                  </div>

                  <div>
                    <span>Queue Status</span>

                    <strong>
                      {v1Data?.status}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

          </>

        )}

        {/* ======================================================
            SMART ALERT
        ====================================================== */}

        {activeVersion === 2 && (

          <>

            <section className="dashboard-panel">

              <span className="section-label">
                SMART ALERT
              </span>

              <h3>
                Smart Waiting-Time Alert
              </h3>

              <p>
                Uses queue position and consultation
                history to estimate your waiting time.
              </p>

              {renderAlert(
                v2Data,
                "SMART QUEUE PREDICTION"
              )}

            </section>

            <section className="dashboard-panel">

              <span className="section-label">
                SMART PREDICTION
              </span>

              <h3>
                Smart Prediction Details
              </h3>

              <div className="live-summary-grid">

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-patients"></span>
                  </div>

                  <div>
                    <span>Patients Ahead</span>

                    <strong>
                      {v2Data?.patientsAhead}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-time"></span>
                  </div>

                  <div>
                    <span>
                      Average Consultation
                    </span>

                    <strong>
                      {v2Data?.averageConsultationTime} min
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-wait"></span>
                  </div>

                  <div>
                    <span>
                      Estimated Waiting
                    </span>

                    <strong>
                      {v2Data?.estimatedWaitingTime} min
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-consultation"></span>
                  </div>

                  <div>
                    <span>
                      Current Consultation
                    </span>

                    <strong>
                      {v2Data?.currentConsultation || "None"}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

          </>

        )}

        {/* ======================================================
            AI ALERT
        ====================================================== */}

        {activeVersion === 3 && (

          <>

            <section className="dashboard-panel">

              <span className="section-label">
                AI ALERT
              </span>

              <h3>
                AI Intelligent Queue Alert
              </h3>

              <p>
                Combines live queue activity, consultation
                history and hospital workload.
              </p>

              {renderAlert(
                v3Data,
                "AI PREDICTION"
              )}

            </section>

            <section className="dashboard-panel">

              <span className="section-label">
                AI PREDICTION
              </span>

              <h3>
                AI Prediction Details
              </h3>

              <div className="live-summary-grid">

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-patients"></span>
                  </div>

                  <div>
                    <span>Patients Ahead</span>

                    <strong>
                      {v3Data?.patientsAhead}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-wait"></span>
                  </div>

                  <div>
                    <span>Estimated Waiting</span>

                    <strong>
                      {v3Data?.estimatedWaitingTime} min
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-load"></span>
                  </div>

                  <div>
                    <span>Hospital Load</span>

                    <strong>
                      {v3Data?.hospitalLoad}
                    </strong>
                  </div>

                </div>

                <div className="live-summary-item">

                  <div className="live-summary-icon">
                    <span className="summary-dot summary-dot-confidence"></span>
                  </div>

                  <div>
                    <span>Prediction Confidence</span>

                    <strong>
                      {v3Data?.confidence}%
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            <section className="dashboard-panel">

              <div className="panel-title">

                <span className="panel-title-icon">
                  <span className="assistant-dot"></span>
                </span>

                <div>

                  <span className="section-label">
                    AI ASSISTANT
                  </span>

                  <h3>
                    Smart Recommendation
                  </h3>

                </div>

              </div>

              <div className="queue-status-message">

                <span className="queue-message-icon">
                  <span className="recommendation-dot"></span>
                </span>

                <div>

                  <strong>
                    {v3Data?.recommendation}
                  </strong>

                  <p>
                    {v3Data?.predictionExplanation}
                  </p>

                </div>

              </div>

            </section>

          </>

        )}

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="dashboard-footer">

          <span>
            Smart Queue Turn Alert
          </span>

          <span>
            Live AI Queue Awareness
          </span>

        </div>

      </main>

    </div>
  );
}

export default SmartQueueTurnAlert;