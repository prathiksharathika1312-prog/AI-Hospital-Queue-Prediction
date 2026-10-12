import React from "react";
import "./BestTimeToVisit.css";

/* ============================================================
   PROFESSIONAL SVG ICONS
   ============================================================ */

function ClockIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function WarningIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 4.2 3.6 16a2 2 0 0 0 1.7 3h13.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function HospitalIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 21V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15" />
      <path d="M8 21v-5h8v5" />
      <path d="M10 8h4" />
      <path d="M12 6v4" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function UsersIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c.5-3.2 2.4-5 6-5s5.5 1.8 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M18 14.2c1.8.8 2.8 2.3 3 4.8" />
    </svg>
  );
}

function ChartIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-6" />
    </svg>
  );
}

function BrainIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8a3.5 3.5 0 0 0-1 6.7A3.5 3.5 0 0 0 8.5 20H10V5.5a3.5 3.5 0 0 0-.5-1Z" />
      <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8a3.5 3.5 0 0 1 1 6.7 3.5 3.5 0 0 1-3.5 5.3H14V5.5a3.5 3.5 0 0 1 .5-1Z" />
      <path d="M10 9H8.5" />
      <path d="M10 13H7" />
      <path d="M14 9h1.5" />
      <path d="M14 13h3" />
      <path d="M10 17H8.5" />
      <path d="M14 17h1.5" />
    </svg>
  );
}

function UserIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
    </svg>
  );
}

function RefreshIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11a8.1 8.1 0 0 0-14.9-3L3 11" />
      <path d="M3 5v6h6" />
      <path d="M4 13a8.1 8.1 0 0 0 14.9 3L21 13" />
      <path d="M21 19v-6h-6" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function CheckIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function WorkloadIndicator({ workload }) {
  const value = String(workload || "").toLowerCase();

  let className = "workload-indicator unknown";

  if (value.includes("high")) {
    className = "workload-indicator high";
  } else if (value.includes("medium")) {
    className = "workload-indicator medium";
  } else if (value.includes("low")) {
    className = "workload-indicator low";
  }

  return <span className={className}></span>;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function BestTimeToVisit({
  patient,
  bestTime,
  loading,
  onBack,
}) {
  /* ============================================================
     LOADING STATE
     ============================================================ */

  if (loading) {
    return (
      <div className="patient-dashboard best-time-page">
        <main className="dashboard-content">

          <button
            className="back-btn"
            onClick={onBack}
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>

          <section className="dashboard-panel best-time-main-panel">

            <div className="best-time-loading">

              <div className="loading-icon">
                <ClockIcon size={30} />
              </div>

              <h2>
                Analyzing Hospital Activity...
              </h2>

              <p>
                AI is calculating the best time to visit.
              </p>

            </div>

          </section>

        </main>
      </div>
    );
  }

  /* ============================================================
     NO DATA STATE
     ============================================================ */

  if (!bestTime) {
    return (
      <div className="patient-dashboard">

        <main className="dashboard-content">

          <button
            className="back-btn"
            onClick={onBack}
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>

          <section className="dashboard-panel best-time-main-panel">

            <div className="best-time-error">

              <div className="error-icon">
                <WarningIcon size={40} />
              </div>

              <h2>
                Unable to Load Recommendation
              </h2>

              <p>
                We could not calculate the best time
                to visit right now.
              </p>

              <button
                className="refresh-btn"
                onClick={onBack}
              >
                <RefreshIcon />
                Try Again
              </button>

            </div>

          </section>

        </main>

      </div>
    );
  }

  /* ============================================================
     SAFE VALUES
     ============================================================ */

  const recommendedTime =
    bestTime.recommendedTime || "--";

  const expectedWorkload =
    bestTime.expectedWorkload || "Unknown";

  const expectedWaitingTime =
    bestTime.expectedWaitingTime || "--";

  const confidence =
    Number(bestTime.confidence || 0);

  const currentWorkload =
    bestTime.currentWorkload || "Unknown";

  const totalActivePatients =
    Number(bestTime.totalActivePatients || 0);

  const averageConsultationTime =
    Number(bestTime.averageConsultationTime || 0);

  const historicalSamples =
    Number(bestTime.historicalSamples || 0);

  const recommendationReason =
    bestTime.recommendationReason ||
    "The recommendation is based on current hospital activity.";

  const predictionExplanation =
    bestTime.predictionExplanation ||
    "The prediction uses current queue and historical consultation information.";

  const timeAnalysis =
    Array.isArray(bestTime.timeAnalysis)
      ? bestTime.timeAnalysis
      : [];

  /* ============================================================
     WORKLOAD CLASS
     ============================================================ */

  function getWorkloadClass(workload) {
    const value =
      String(workload || "").toLowerCase();

    if (value.includes("high")) {
      return "workload-high";
    }

    if (value.includes("medium")) {
      return "workload-medium";
    }

    if (value.includes("low")) {
      return "workload-low";
    }

    return "workload-unknown";
  }

  /* ============================================================
     CONFIDENCE LABEL
     ============================================================ */

  function getConfidenceLabel(value) {
    if (value >= 80) {
      return "High";
    }

    if (value >= 60) {
      return "Medium";
    }

    return "Low";
  }

  /* ============================================================
     CONFIDENCE CLASS
     ============================================================ */

  function getConfidenceClass(value) {
    if (value >= 80) {
      return "confidence-high";
    }

    if (value >= 60) {
      return "confidence-medium";
    }

    return "confidence-low";
  }

  /* ============================================================
     MAIN SCREEN
     ============================================================ */

  return (
    <div className="patient-dashboard">

      <main className="dashboard-content">

        {/* ======================================================
            BACK BUTTON
        ====================================================== */}

        <button
          className="back-btn"
          onClick={onBack}
        >
          <ArrowLeftIcon />
          Back to Dashboard
        </button>

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <section className="welcome-section best-time-header">

          <div>

            <span className="welcome-label">
              AI RECOMMENDATION
            </span>

            <h2>
              Best Time to Visit
            </h2>

            <p>
              Find the time when hospital workload is
              expected to be lower.
            </p>

          </div>

          <div className="system-status">

            <span className="status-dot"></span>

            AI Prediction Active

          </div>

        </section>

        {/* ======================================================
            MAIN RECOMMENDATION
        ====================================================== */}

        <section className="dashboard-panel best-time-recommendation-panel">

          <div className="best-time-recommendation">

            <div className="recommendation-icon">
              <ClockIcon size={34} />
            </div>

            <div className="recommendation-content">

              <span className="section-label">
                RECOMMENDED VISIT TIME
              </span>

              <h1>
                {recommendedTime}
              </h1>

              <p className="recommendation-reason">
                {recommendationReason}
              </p>

            </div>

          </div>

          {/* ====================================================
              RECOMMENDATION BADGES
          ==================================================== */}

          <div className="recommendation-badges">

            <div
              className={
                "workload-badge " +
                getWorkloadClass(expectedWorkload)
              }
            >

              <span className="badge-icon">
                <WorkloadIndicator
                  workload={expectedWorkload}
                />
              </span>

              <span>
                Expected Workload
              </span>

              <strong>
                {expectedWorkload}
              </strong>

            </div>

            <div className="wait-badge">

              <span className="badge-icon">
                <ClockIcon size={23} />
              </span>

              <span>
                Expected Waiting
              </span>

              <strong>
                {expectedWaitingTime}
              </strong>

            </div>

            <div
              className={
                "confidence-badge " +
                getConfidenceClass(confidence)
              }
            >

              <span className="badge-icon">
                <BrainIcon size={23} />
              </span>

              <span>
                AI Confidence
              </span>

              <strong>
                {confidence}%
              </strong>

              <small>
                {getConfidenceLabel(confidence)}
              </small>

            </div>

          </div>

        </section>

        {/* ======================================================
            CURRENT HOSPITAL DATA
        ====================================================== */}

        <section className="dashboard-panel">

          <div className="panel-title">

            <span className="panel-title-icon">
              <ChartIcon size={21} />
            </span>

            <div>

              <span className="section-label">
                LIVE DATA
              </span>

              <h3>
                Current Hospital Analysis
              </h3>

            </div>

          </div>

          <div className="best-time-stats-grid">

            {/* CURRENT WORKLOAD */}

            <div className="best-time-stat-card">

              <div className="stat-icon">
                <HospitalIcon size={20} />
              </div>

              <span>
                Current Workload
              </span>

              <strong className="workload-value">
                <WorkloadIndicator
                  workload={currentWorkload}
                />
                {currentWorkload}
              </strong>

            </div>

            {/* ACTIVE PATIENTS */}

            <div className="best-time-stat-card">

              <div className="stat-icon">
                <UsersIcon size={20} />
              </div>

              <span>
                Active Patients
              </span>

              <strong>
                {totalActivePatients}
              </strong>

            </div>

            {/* AVERAGE CONSULTATION */}

            <div className="best-time-stat-card">

              <div className="stat-icon">
                <ClockIcon size={20} />
              </div>

              <span>
                Avg. Consultation
              </span>

              <strong>
                {averageConsultationTime} min
              </strong>

            </div>

            {/* HISTORICAL SAMPLES */}

            <div className="best-time-stat-card">

              <div className="stat-icon">
                <ChartIcon size={20} />
              </div>

              <span>
                Historical Samples
              </span>

              <strong>
                {historicalSamples}
              </strong>

            </div>

          </div>

        </section>

        {/* ======================================================
            TIME PERIOD ANALYSIS
        ====================================================== */}

        <section className="dashboard-panel">

          <div className="panel-title">

            <span className="panel-title-icon">
              <ClockIcon size={21} />
            </span>

            <div>

              <span className="section-label">
                AI TIME ANALYSIS
              </span>

              <h3>
                Time Period Analysis
              </h3>

            </div>

          </div>

          <p className="analysis-description">
            AI compares different hospital time periods
            using predicted patient activity, historical
            activity, workload, and consultation duration.
          </p>

          {timeAnalysis.length > 0 ? (

            <div className="time-analysis-list">

              {timeAnalysis.map(function (period, index) {

                const periodTime =
                  period.time || "--";

                const isRecommended =
                  periodTime === recommendedTime;

                return (

                  <div
                    key={
                      periodTime +
                      "-" +
                      index
                    }
                    className={
                      isRecommended
                        ? "time-analysis-card recommended-time-period"
                        : "time-analysis-card"
                    }
                  >

                    {/* TIME */}

                    <div className="time-period-main">

                      <div className="time-period-icon">
                        <ClockIcon size={18} />
                      </div>

                      <div>

                        <strong>
                          {periodTime}
                        </strong>

                        {isRecommended ? (

                          <span className="recommended-label">
                            <CheckIcon size={12} />
                            Recommended
                          </span>

                        ) : null}

                      </div>

                    </div>

                    {/* WORKLOAD */}

                    <div className="time-period-detail">

                      <span>
                        Workload
                      </span>

                      <strong
                        className={
                          getWorkloadClass(
                            period.workload
                          )
                        }
                      >

                        <WorkloadIndicator
                          workload={period.workload}
                        />

                        {period.workload ||
                          "Unknown"}

                      </strong>

                    </div>

                    {/* WAITING TIME */}

                    <div className="time-period-detail">

                      <span>
                        Expected Waiting
                      </span>

                      <strong>
                        <ClockIcon size={14} />
                        {period.expectedWaitingTime ||
                          "--"}
                      </strong>

                    </div>

                    {/* PREDICTED PATIENTS */}

                    <div className="time-period-detail">

                      <span>
                        Predicted Patients
                      </span>

                      <strong>
                        <UsersIcon size={14} />
                        {Number(
                          period.predictedPatientCount ||
                            0
                        )}
                      </strong>

                    </div>

                    {/* CONSULTATION TIME */}

                    <div className="time-period-detail">

                      <span>
                        Avg. Consultation
                      </span>

                      <strong>
                        {Number(
                          period.averageConsultationTime ||
                            0
                        )}{" "}
                        min
                      </strong>

                    </div>

                    {/* HISTORICAL ACTIVITY */}

                    <div className="time-period-detail">

                      <span>
                        Historical Activity
                      </span>

                      <strong>
                        <ChartIcon size={14} />
                        {Number(
                          period.historicalActivity ||
                            0
                        )}
                      </strong>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="no-analysis">

              <p>
                No time-period analysis is currently
                available.
              </p>

            </div>

          )}

        </section>

        {/* ======================================================
            AI EXPLANATION
        ====================================================== */}

        <section className="dashboard-panel ai-explanation-panel">

          <div className="panel-title">

            <span className="panel-title-icon">
              <BrainIcon size={21} />
            </span>

            <div>

              <span className="section-label">
                ARTIFICIAL INTELLIGENCE
              </span>

              <h3>
                Prediction Explanation
              </h3>

            </div>

          </div>

          <div className="ai-explanation">

            <p>
              {predictionExplanation}
            </p>

          </div>

        </section>

        {/* ======================================================
            PATIENT INFORMATION
        ====================================================== */}

        <section className="dashboard-panel">

          <div className="panel-title">

            <span className="panel-title-icon">
              <UserIcon size={21} />
            </span>

            <div>

              <span className="section-label">
                PATIENT
              </span>

              <h3>
                Recommendation For
              </h3>

            </div>

          </div>

          <div className="patient-recommendation-info">

            <div>

              <span>
                Patient
              </span>

              <strong>
                {patient && patient.name
                  ? patient.name
                  : "Patient"}
              </strong>

            </div>

            <div>

              <span>
                Queue Status
              </span>

              <strong>
                {bestTime.hasActiveToken
                  ? "Active Queue Token"
                  : "No Active Token"}
              </strong>

            </div>

            <div>

              <span>
                Recommendation
              </span>

              <strong>
                {recommendedTime}
              </strong>

            </div>

          </div>

        </section>

        {/* ======================================================
            REFRESH / FOOTER
        ====================================================== */}

        <div className="best-time-footer">

          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshIcon />
            Refresh Prediction
          </button>

          {bestTime.generatedAt ? (

            <span className="generated-time">

              Last generated:{" "}

              {new Date(
                bestTime.generatedAt
              ).toLocaleString()}

            </span>

          ) : null}

        </div>

      </main>

    </div>
  );
}

export default BestTimeToVisit;