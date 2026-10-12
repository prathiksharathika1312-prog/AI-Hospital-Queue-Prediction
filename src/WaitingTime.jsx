import React from "react";
import "./WaitingTime.css";

/* ============================================================
   ICONS
============================================================ */

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3.5 3.5 0 0 0 4 12a3.5 3.5 0 0 0 2 3.2v.3a3.5 3.5 0 0 0 5.5 2.8" />
      <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3.5 3.5 0 0 1 2 3.5 3.5 3.5 0 0 1-2 3.2v.3a3.5 3.5 0 0 1-5.5 2.8" />
      <path d="M12 4v16" />
      <path d="M8 9h2" />
      <path d="M14 9h2" />
      <path d="M8 15h2" />
      <path d="M14 15h2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M17 11a3.5 3.5 0 0 0 0-7" />
      <path d="M21 20v-1.5a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="7.5" ry="3" />
      <path d="M4.5 5v7c0 1.65 3.36 3 7.5 3s7.5-1.35 7.5-3V5" />
      <path d="M4.5 12v7c0 1.65 3.36 3 7.5 3s7.5-1.35 7.5-3v-7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v5c0 4.5-2.8 8.1-7 10-4.2-1.9-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h4l2.2-5 4 10 2.1-5H21" />
    </svg>
  );
}

/* ============================================================
   WAITING TIME COMPONENT
============================================================ */

function WaitingTime({
  patient,
  waitingTime,
  loading,
  onBack,
}) {

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="wt-loading">

        <div className="wt-loading-card">

          <div className="wt-brain-icon wt-loading-icon">
            <BrainIcon />
          </div>

          <span className="wt-eyebrow">
            QUEUE INTELLIGENCE
          </span>

          <h1>
            Waiting Time Prediction
          </h1>

          <p>
            Analysing your current queue and
            consultation data to calculate
            your estimated waiting time.
          </p>

          <div className="wt-estimate-card">

            <span className="wt-estimate-label">
              ESTIMATED WAITING TIME
            </span>

            <div className="wt-estimate-number">
              ...
            </div>

            <div className="wt-loading-dots">
              • • •
            </div>

          </div>

        </div>

      </div>
    );
  }

  /* ==========================================================
     QUEUE NOT JOINED
  ========================================================== */

  if (!waitingTime) {
    return (
      <div className="wt-page">

        <div className="wt-topbar">

          <button
            className="wt-back-button"
            onClick={onBack}
          >
            <span className="wt-back-icon">
              <ArrowLeftIcon />
            </span>

            Back to Dashboard
          </button>

          <div className="wt-live-badge">
            <span className="wt-live-dot"></span>
            <span>Live Analysis</span>
          </div>

        </div>

        <div className="wt-hero">

          <div className="wt-brain-icon">
            <BrainIcon />
          </div>

          <span className="wt-eyebrow">
            WAITING TIME PREDICTION
          </span>

          <h1 className="wt-title">
            Your Estimated{" "}
            <span className="wt-title-gradient">
              Consultation Wait
            </span>
          </h1>

          <p className="wt-subtitle">
            Hello {patient?.name || "Patient"}, join the
            hospital queue to receive your live
            waiting time prediction.
          </p>

        </div>

        <div className="wt-empty-card">

          <div className="wt-empty-icon">
            <BrainIcon />
          </div>

          <h2>
            Queue Not Joined
          </h2>

          <p>
            Your waiting time prediction will appear
            here after you join the hospital queue.
          </p>

        </div>

      </div>
    );
  }

  /* ==========================================================
     DATA FROM BACKEND
  ========================================================== */

  const patientsAhead = Number(
    waitingTime.patientsAhead || 0
  );

  const averageTime = Number(
    waitingTime.averageConsultationTime || 0
  );

  const estimatedTime = Number(
    waitingTime.estimatedWaitingTime || 0
  );

  const currentConsultationRemaining = Number(
    waitingTime.currentConsultationRemaining || 0
  );

  const confidence =
    waitingTime.confidence || "Low";

  const historicalSamples = Number(
    waitingTime.historicalSamples || 0
  );

  const queueStatus =
    waitingTime.status || "Waiting";

  const isConsultation =
    waitingTime.status === "In Consultation";

  /* ==========================================================
     MAIN PAGE
  ========================================================== */

  return (
    <div className="wt-page">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <div className="wt-topbar">

        <button
          className="wt-back-button"
          onClick={onBack}
        >
          <span className="wt-back-icon">
            <ArrowLeftIcon />
          </span>

          Back to Dashboard
        </button>

        <div className="wt-live-badge">

          <span className="wt-live-dot"></span>

          <span>
            Live Analysis
          </span>

          <ActivityIcon />

        </div>

      </div>

      {/* ======================================================
          HERO
      ====================================================== */}

      <div className="wt-hero">

        <div className="wt-brain-icon">
          <BrainIcon />
        </div>

        <span className="wt-eyebrow">
          WAITING TIME PREDICTION
        </span>

        <h1 className="wt-title">
          Your Estimated{" "}
          <span className="wt-title-gradient">
            Consultation Wait
          </span>
        </h1>

        <p className="wt-subtitle">
          Factors currently influencing your estimate
        </p>

      </div>

      {/* ======================================================
          ESTIMATED WAITING TIME
      ====================================================== */}

      <div className="wt-estimate-card">

        <div className="wt-estimate-header">

          <span className="wt-estimate-label">
            ESTIMATED WAITING TIME
          </span>

          <span className="wt-estimate-live">

            <span className="wt-live-dot"></span>

            LIVE

          </span>

        </div>

        <div className="wt-estimate-main">

          <div className="wt-clock-large">
            <ClockIcon />
          </div>

          <div>

            <span className="wt-estimate-number">

              {isConsultation
                ? "0"
                : estimatedTime}

            </span>

            <span className="wt-estimate-unit">
              min
            </span>

          </div>

        </div>

        <p className="wt-estimate-support">

          {isConsultation
            ? "You are currently in consultation"
            : "Based on your current queue activity"}

        </p>

      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      <div
        className={`wt-status ${
          isConsultation
            ? "wt-status-consultation"
            : ""
        }`}
      >

        <span className="wt-status-dot"></span>

        {queueStatus}

      </div>

      {/* ======================================================
          FOUR ANALYSIS CARDS
      ====================================================== */}

      <div className="wt-analytics-grid">

        {/* QUEUE FACTOR */}

        <div className="wt-analysis-card wt-card-orange">

          <div className="wt-card-top">

            <div className="wt-card-icon">
              <UsersIcon />
            </div>

            <span className="wt-card-arrow">
              ›
            </span>

          </div>

          <span className="wt-card-label">
            QUEUE FACTOR
          </span>

          <div className="wt-card-value">
            {patientsAhead}
          </div>

          <p className="wt-card-description">
            Patients ahead
          </p>

        </div>

        {/* LIVE FACTOR */}

        <div className="wt-analysis-card wt-card-blue">

          <div className="wt-card-top">

            <div className="wt-card-icon">
              <ClockIcon />
            </div>

            <span className="wt-card-arrow">
              ›
            </span>

          </div>

          <span className="wt-card-label">
            LIVE FACTOR
          </span>

          <div className="wt-card-value">

            {currentConsultationRemaining.toFixed(1)}
            <span className="wt-card-unit">
              min
            </span>

          </div>

          <p className="wt-card-description">
            Current consultation
          </p>

        </div>

        {/* HISTORY FACTOR */}

        <div className="wt-analysis-card wt-card-purple">

          <div className="wt-card-top">

            <div className="wt-card-icon">
              <DatabaseIcon />
            </div>

            <span className="wt-card-arrow">
              ›
            </span>

          </div>

          <span className="wt-card-label">
            HISTORY FACTOR
          </span>

          <div className="wt-card-value">
            {historicalSamples}
          </div>

          <p className="wt-card-description">
            Historical samples
          </p>

        </div>

        {/* RELIABILITY */}

        <div className="wt-analysis-card wt-card-green">

          <div className="wt-card-top">

            <div className="wt-card-icon">
              <ShieldIcon />
            </div>

            <span className="wt-card-label">
              RELIABILITY
            </span>

          </div>

          <div className="wt-card-value">
            {confidence}
          </div>

          <p className="wt-card-description">
            Prediction confidence
          </p>

        </div>

      </div>

      {/* ======================================================
          PREDICTION INPUTS
      ====================================================== */}

      <div className="wt-inputs-panel">

        {/* Brain */}

        <div className="wt-inputs-brain">
          <BrainIcon />
        </div>

        {/* Heading */}

        <div className="wt-inputs-title">

          <strong>
            PREDICTION INPUTS
          </strong>

          <span>
            Factors currently influencing your estimate
          </span>

        </div>

        {/* ====================================================
            SOURCE VALUES
        ==================================================== */}

        <div className="wt-source-list">

          {/* LIVE QUEUE */}

          <div className="wt-source-item wt-source-queue">

            <div className="wt-source-icon">
              <ActivityIcon />
            </div>

            <div className="wt-source-content">

              <span className="wt-source-label">
                Live Queue
              </span>

              <strong className="wt-source-value">
                {queueStatus}
              </strong>

            </div>

          </div>

          {/* PATIENTS AHEAD */}

          <div className="wt-source-item wt-source-ahead">

            <div className="wt-source-icon">
              <UsersIcon />
            </div>

            <div className="wt-source-content">

              <span className="wt-source-label">
                Patients Ahead
              </span>

              <strong className="wt-source-value">
                {patientsAhead}
              </strong>

            </div>

          </div>

          {/* CONSULTATION HISTORY */}

          <div className="wt-source-item wt-source-history">

            <div className="wt-source-icon">
              <DatabaseIcon />
            </div>

            <div className="wt-source-content">

              <span className="wt-source-label">
                Consultation History
              </span>

              <strong className="wt-source-value">
                {historicalSamples}{" "}
                {historicalSamples === 1
                  ? "sample"
                  : "samples"}
              </strong>

            </div>

          </div>

          {/* AVERAGE DURATION */}

          <div className="wt-source-item wt-source-average">

            <div className="wt-source-icon">
              <ClockIcon />
            </div>

            <div className="wt-source-content">

              <strong className="wt-source-value">
                 {averageTime.toFixed(1)} min
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          BOTTOM LINE
      ====================================================== */}

      <div className="wt-bottom-line"></div>

    </div>
  );
}

export default WaitingTime;