import React, { useEffect, useState } from "react";
import axios from "axios";

function PatientVisitReadiness({ patient, onBack }) {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // ============================================================
  // FETCH PATIENT VISIT READINESS - VERSION 3
  // ============================================================

  const fetchReadiness = async () => {
    try {
      setError("");

      const response = await axios.get(
        `http://localhost:5000/visit-readiness-v3/${patient._id}`
      );

      setReadiness(response.data);

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error("Patient Visit Readiness V3 Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load patient visit readiness."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD + AUTO REFRESH
  // ============================================================

  useEffect(() => {
    if (!patient?._id) {
      setError("Patient information is unavailable.");
      setLoading(false);
      return;
    }

    fetchReadiness();

    const interval = setInterval(() => {
      fetchReadiness();
    }, 30000);

    return () => clearInterval(interval);
  }, [patient?._id]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="patient-readiness-container">
        <button
          className="readiness-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="readiness-card loading-card">
          <div className="loading-spinner"></div>

          <h2>Patient Visit Readiness</h2>

          <p>
            AI is checking your current consultation readiness...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="patient-readiness-container">
        <button
          className="readiness-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="readiness-card error-card">
          <div className="error-icon">!</div>

          <h2>Unable to Load Readiness</h2>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => {
              setLoading(true);
              fetchReadiness();
            }}
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!readiness) {
    return (
      <div className="patient-readiness-container">
        <button
          className="readiness-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="readiness-card">
          <h2>Patient Visit Readiness</h2>

          <p>
            No readiness information is currently available.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // VERSION 3 DATA
  // ============================================================

  const {
    tokenNumber,
    queueNumber,
    queueStatus,
    patientsAhead,

    predictedWaitingTime,
    currentConsultationRemaining,

    averageConsultationTime,
    historicalSamples,

    hospitalWorkload,

    totalActivePatients,
    waitingPatients,
    patientsInConsultation,

    turnProximity,

    readinessStatus,
    readinessScore,
    readinessIcon,

    confidence,

    recommendation,
    preparationAdvice,
    predictionExplanation,

    aiFactors,

    checks,
  } = readiness;

  // ============================================================
  // SAFE VALUES
  // ============================================================

  const safeScore = Math.min(
    100,
    Math.max(0, Number(readinessScore) || 0)
  );

  const safeConfidence = Math.min(
    100,
    Math.max(0, Number(confidence) || 0)
  );

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const statusText = String(readinessStatus || "").toLowerCase();

  const readinessStatusClass =
    statusText.includes("ready")
      ? "ready"
      : statusText.includes("wait")
      ? "waiting"
      : "attention";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="patient-readiness-container">

      {/* ======================================================
          TOP NAVIGATION
      ====================================================== */}

      <div className="readiness-topbar">

        <button
          className="readiness-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="readiness-live-area">

          <div className="live-badge">
            <span></span>
            Live AI Check
          </div>

          {lastUpdated && (
            <div className="readiness-updated">
              ◷ Updated {lastUpdated}
            </div>
          )}

          <button
            className="refresh-readiness-button"
            onClick={fetchReadiness}
            title="Refresh prediction"
          >
            ↻
          </button>

        </div>

      </div>


      {/* ======================================================
          HERO / AI READINESS
      ====================================================== */}

      <div className="readiness-card readiness-hero">

        {/* LEFT SIDE */}

        <div className="hero-content">

          <div className="hero-icon">
            {readinessIcon || ""}
          </div>

          <div className="hero-text">

            <p className="hero-label">
              SMART ASSISTANT
            </p>

            <h1>
              Patient Visit Readiness
            </h1>

            <p className="hero-description">
              AI-powered analysis to determine whether you
              are ready for your consultation.
            </p>

            <div className="hero-status">

              <span
                className={`hero-status-dot ${readinessStatusClass}`}
              ></span>

              <strong>
                {readinessStatus || "Checking"}
              </strong>

              <span>
                {recommendation}
              </span>

            </div>

          </div>

        </div>


        {/* READINESS SCORE */}

        <div className="hero-score">

          <div
            className="score-circle"
            style={{
              "--score": `${safeScore}%`,
            }}
          >
            <strong>
              {safeScore}%
            </strong>

            <span>
              Readiness
            </span>
          </div>

        </div>


        {/* AI CONFIDENCE */}

        <div className="hero-confidence">

          <p>
            AI CONFIDENCE
          </p>

          <strong>
            {safeConfidence}%
          </strong>

          <div className="confidence-bar">
            <div
              style={{
                width: `${safeConfidence}%`,
              }}
            ></div>
          </div>

          <span>
            Confidence in prediction
          </span>

        </div>

      </div>


      {/* ======================================================
          BEFORE YOUR CONSULTATION
      ====================================================== */}

      <div className="readiness-card consultation-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            
          </div>

          <div>
            <h2>
              Before Your Consultation
            </h2>

            <p>
              Your current queue information
            </p>
          </div>

          <span className="section-badge">
            Live Queue
          </span>

        </div>


        <div className="consultation-grid">

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="consultation-column">

            {/* QUEUE TOKEN */}

            <div className="info-item">

              <div className="info-icon">
                
              </div>

              <div className="info-content">

                <span>
                  Queue Token
                </span>

                <small>
                  Your unique consultation token
                </small>

              </div>

              <strong className="token-value">
                {tokenNumber || "--"}
              </strong>

            </div>


            {/* QUEUE POSITION */}

            <div className="info-item">

              <div className="info-icon">
                #
              </div>

              <div className="info-content">

                <span>
                  Queue Position
                </span>

                <small>
                  Your position in the queue
                </small>

              </div>

              <strong>
                #{queueNumber ?? "--"}
              </strong>

            </div>


            {/* QUEUE STATUS */}

            <div className="info-item">

              <div className="info-icon">
                
              </div>

              <div className="info-content">

                <span>
                  Queue Status
                </span>

                <small>
                  Current queue status
                </small>

              </div>

              <strong className="status-waiting">
                {queueStatus || "Unknown"}
              </strong>

            </div>

          </div>


          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div className="consultation-column">

            {/* PATIENTS AHEAD */}

            <div className="info-item">

              <div className="info-icon">
                👥
              </div>

              <div className="info-content">

                <span>
                  Patients Ahead
                </span>

                <small>
                  Number of patients before you
                </small>

              </div>

              <strong>
                {patientsAhead ?? 0}
              </strong>

            </div>


            {/* PREDICTED WAITING */}

            <div className="info-item">

              <div className="info-icon">
                
              </div>

              <div className="info-content">

                <span>
                  Predicted Waiting
                </span>

                <small>
                  Estimated waiting time for your turn
                </small>

              </div>

              <strong className="waiting-value">
                {predictedWaitingTime ?? 0} min
              </strong>

            </div>


            {/* CURRENT CONSULTATION */}

            <div className="info-item">

              <div className="info-icon">
                
              </div>

              <div className="info-content">

                <span>
                  Current Consultation Remaining
                </span>

                <small>
                  Time left for current patient
                </small>

              </div>

              <strong>
                {currentConsultationRemaining ?? 0} min
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          AI ANALYSIS
      ====================================================== */}

      <div className="readiness-card ai-analysis-card">

        <div className="ai-analysis-header">

          <div className="ai-analysis-title">

            <div className="analysis-icon">
              
            </div>

            <div>

              <h2>
                AI Analysis
              </h2>

              <p>
                {predictionExplanation ||
                  "AI prediction is based on current queue activity and consultation patterns."}
              </p>

            </div>

          </div>

        </div>


        {/* AI METRICS */}

        <div className="ai-metrics-grid">

          {/* WORKLOAD */}

          <div className="ai-metric">

            <div className="metric-icon">
              
            </div>

            <span>
              Hospital Workload
            </span>

            <strong className="metric-amber">
              {hospitalWorkload || "--"}
            </strong>

          </div>


          {/* PROXIMITY */}

          <div className="ai-metric">

            <div className="metric-icon">
              
            </div>

            <span>
              Turn Proximity
            </span>

            <strong className="metric-green">
              {turnProximity || "--"}
            </strong>

          </div>


          {/* AVERAGE CONSULTATION */}

          <div className="ai-metric">

            <div className="metric-icon">
              
            </div>

            <span>
              Avg. Consultation
            </span>

            <strong>
              {averageConsultationTime ?? 0} min
            </strong>

          </div>


          {/* HISTORICAL SAMPLES */}

          <div className="ai-metric">

            <div className="metric-icon">
              
            </div>

            <span>
              Historical Samples
            </span>

            <strong>
              {historicalSamples ?? 0}
            </strong>

          </div>


          {/* ACTIVE PATIENTS */}

          <div className="ai-metric">

            <div className="metric-icon">
              👥
            </div>

            <span>
              Total Active Patients
            </span>

            <strong>
              {totalActivePatients ?? 0}
            </strong>

          </div>

        </div>


        {/* GET READY */}

        <div className="get-ready-banner">

          <div className="get-ready-icon">
            ✓
          </div>

          <div>

            <strong>
              {readinessStatus || "Get Ready"}
            </strong>

            <p>
              {recommendation ||
                "Your consultation is getting closer. Please remain available."}
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          ADDITIONAL HOSPITAL ANALYSIS
      ====================================================== */}

      <div className="readiness-card">

        <div className="section-heading simple-heading">

          <div className="section-heading-icon">
            
          </div>

          <div>

            <h2>
              Hospital & Queue Analysis
            </h2>

            <p>
              Current conditions used by the AI prediction
            </p>

          </div>

        </div>


        <div className="analysis-detail-grid">

          <div className="analysis-detail-item">
            <span>
              Waiting Patients
            </span>

            <strong>
              {waitingPatients ?? 0}
            </strong>
          </div>


          <div className="analysis-detail-item">
            <span>
              Patients In Consultation
            </span>

            <strong>
              {patientsInConsultation ?? 0}
            </strong>
          </div>


          <div className="analysis-detail-item">
            <span>
              Total Active Patients
            </span>

            <strong>
              {totalActivePatients ?? 0}
            </strong>
          </div>


          <div className="analysis-detail-item">
            <span>
              Average Consultation
            </span>

            <strong>
              {averageConsultationTime ?? 0} min
            </strong>
          </div>

        </div>

      </div>


      {/* ======================================================
          AI PREDICTION FACTORS
      ====================================================== */}

      <div className="readiness-card">

        <div className="section-heading simple-heading">

          <div className="section-heading-icon">
            
          </div>

          <div>

            <h2>
              AI Prediction Factors
            </h2>

            <p>
              Data sources contributing to the prediction
            </p>

          </div>

        </div>


        <div className="verification-grid">

          <div className="verification-item">

            <span>
              Live Queue Activity
            </span>

            <strong
              className={
                aiFactors?.liveQueueActivity
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {aiFactors?.liveQueueActivity
                ? "✓ Active"
                : "✗ Not Available"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Historical Consultation Data
            </span>

            <strong
              className={
                aiFactors?.historicalConsultationData
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {aiFactors?.historicalConsultationData
                ? "✓ Available"
                : "✗ Limited"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Hospital Workload Analysis
            </span>

            <strong
              className={
                aiFactors?.hospitalWorkloadAnalysis
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {aiFactors?.hospitalWorkloadAnalysis
                ? "✓ Active"
                : "✗ Not Available"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Waiting Time Prediction
            </span>

            <strong
              className={
                aiFactors?.waitingTimePrediction
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {aiFactors?.waitingTimePrediction
                ? "✓ Active"
                : "✗ Not Available"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Turn Proximity Analysis
            </span>

            <strong
              className={
                aiFactors?.turnProximityAnalysis
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {aiFactors?.turnProximityAnalysis
                ? "✓ Active"
                : "✗ Not Available"}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          READINESS VERIFICATION
      ====================================================== */}

      <div className="readiness-card">

        <div className="section-heading simple-heading">

          <div className="section-heading-icon">
            ✓
          </div>

          <div>

            <h2>
              Readiness Verification
            </h2>

            <p>
              System checks confirming your queue status
            </p>

          </div>

        </div>


        <div className="verification-grid">

          <div className="verification-item">

            <span>
              Active Queue Token
            </span>

            <strong
              className={
                checks?.activeToken
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {checks?.activeToken
                ? "✓ Yes"
                : "✗ No"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              In Queue
            </span>

            <strong
              className={
                checks?.inQueue
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {checks?.inQueue
                ? "✓ Yes"
                : "✗ No"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Token Not Cancelled
            </span>

            <strong
              className={
                checks?.notCancelled
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {checks?.notCancelled
                ? "✓ Yes"
                : "✗ No"}
            </strong>

          </div>


          <div className="verification-item">

            <span>
              Waiting Status
            </span>

            <strong
              className={
                checks?.waiting
                  ? "check-active"
                  : "check-inactive"
              }
            >
              {checks?.waiting
                ? "✓ Yes"
                : "✗ No"}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          PREPARATION
      ====================================================== */}

      <div className="readiness-card preparation-card">

        <div className="section-heading simple-heading">

          <div className="section-heading-icon">
            
          </div>

          <div>

            <h2>
              Preparation
            </h2>

            <p>
              Helpful guidance before your consultation
            </p>

          </div>

        </div>


        <div className="preparation-content">

          <h3>
            Consultation Tips
          </h3>

          <p>
            {preparationAdvice ||
              "Keep your patient information and previous consultation details available."}
          </p>

          <p>
            Stay near the hospital while waiting for your
            turn and keep your phone available for queue
            updates.
          </p>

        </div>

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="readiness-footer">

        <span>
          Patient Visit Readiness
        </span>

        <strong>
          Version 3 • AI Smart Patient Assistant
        </strong>

        <small>
          Live prediction updates every 30 seconds
        </small>

      </div>

    </div>
  );
}

export default PatientVisitReadiness;