import React from "react";
import {
  ArrowLeft,
  ClipboardList,
  Activity,
  Clock3,
  Zap,
  Timer,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

function ConsultationHistory({
  history,
  loading,
  onBack,
}) {
  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="consultation-history-page">

        <div className="history-page-header">

          <button
            className="history-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

        </div>

        <div className="history-loading-card">

          <div className="history-loading-icon">
            <ClipboardList size={30} />
          </div>

          <h2>
            Loading Consultation History
          </h2>

          <p>
            Retrieving your consultation records and smart analysis...
          </p>

          <div className="history-loading-bar">
            <div></div>
          </div>

        </div>

      </div>
    );
  }


  // ============================================================
  // NO DATA
  // ============================================================

  if (!history) {
    return (
      <div className="consultation-history-page">

        <div className="history-page-header">

          <button
            className="history-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

        </div>

        <div className="history-empty-card">

          <div className="history-empty-icon">
            <ClipboardList size={30} />
          </div>

          <span className="history-empty-label">
            CONSULTATION RECORDS
          </span>

          <h2>
            No Consultation History
          </h2>

          <p>
            You don't have any completed consultations yet.
            Your completed visits will appear here automatically.
          </p>

          <button
            className="history-empty-back"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </button>

        </div>

      </div>
    );
  }


  // ============================================================
  // EXISTING BACKEND DATA
  // ============================================================

  const version1 =
    history.version1?.consultations || [];

  const version2 =
    history.version2 || {};

  const version3 =
    history.version3 || {};


  // ============================================================
  // RECORDS
  // ============================================================

  const consultationRecords =
    version2.consultations?.length
      ? version2.consultations
      : version1;


  const totalConsultations =
    version2.totalConsultations ??
    version3.totalConsultations ??
    consultationRecords.length ??
    0;


  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="consultation-history-page">

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="history-page-header">

        <button
          className="history-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>


        <div className="history-title-area">

          <div className="history-title-icon">
            <ClipboardList size={28} />
          </div>

          <div>

            <span className="history-section-label">
              MEDICAL RECORDS
            </span>

            <h1>
              Consultation History
            </h1>

            <p>
              Review your previous consultations, visit statistics
              and personalized insights.
            </p>

          </div>

        </div>

      </div>


      {/* ========================================================
          SUMMARY BANNER
      ======================================================== */}

      <div className="history-summary-banner">

        <div className="summary-banner-icon">
          <Stethoscope size={22} />
        </div>

        <div className="summary-banner-content">

          <span>
            YOUR CONSULTATION RECORD
          </span>

          <strong>
            {totalConsultations}{" "}
            Completed Consultation
            {totalConsultations !== 1 ? "s" : ""}
          </strong>

        </div>

        <div className="summary-banner-status">

          <CheckCircle2 size={15} />

          <span>
            Records Updated
          </span>

        </div>

      </div>


      {/* ========================================================
          CONSULTATION OVERVIEW
      ======================================================== */}

      <section className="history-section">

        <div className="history-section-heading">

          <div>

            <span className="history-section-label">
              CONSULTATION OVERVIEW
            </span>

            <h2>
              Your Visit Statistics
            </h2>

            <p>
              A summary of your completed consultation history.
            </p>

          </div>

          <div className="history-record-count">

            <strong>
              {totalConsultations}
            </strong>

            <span>
              Visits
            </span>

          </div>

        </div>


        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="history-stat-grid">

          <HistoryStat
            icon={<Activity size={21} />}
            label="Total Visits"
            value={version2.totalConsultations || 0}
          />

          <HistoryStat
            icon={<Timer size={21} />}
            label="Average Duration"
            value={version2.averageDuration || 0}
            suffix="min"
          />

          <HistoryStat
            icon={<Zap size={21} />}
            label="Fastest Visit"
            value={version2.fastestConsultation || 0}
            suffix="min"
          />

          <HistoryStat
            icon={<Clock3 size={21} />}
            label="Longest Visit"
            value={version2.longestConsultation || 0}
            suffix="min"
          />

        </div>


        {/* ======================================================
            CONSULTATION RECORDS
        ====================================================== */}

        <div className="detailed-history-container">

          <div className="history-subheading">

            <div>

              <span className="history-section-label">
                VISIT RECORDS
              </span>

              <h3>
                Consultation Records
              </h3>

            </div>

            <span>
              {consultationRecords.length}{" "}
              {consultationRecords.length === 1
                ? "visit"
                : "visits"}
            </span>

          </div>


          {consultationRecords.length === 0 ? (

            <div className="history-no-records">

              <div className="history-no-records-icon">
                <ClipboardList size={24} />
              </div>

              <h3>
                No completed consultations
              </h3>

              <p>
                Completed consultations will appear here automatically.
              </p>

            </div>

          ) : (

            <div className="consultation-history-list">

              {consultationRecords.map(
                (consultation) => (

                  <div
                    className="detailed-history-card"
                    key={
                      consultation.id ||
                      consultation._id ||
                      consultation.tokenNumber
                    }
                  >

                    {/* ==================================================
                        RECORD HEADER
                    ================================================== */}

                    <div className="detailed-history-top">

                      <div className="detailed-token">

                        <span>
                          TOKEN
                        </span>

                        <strong>
                          {consultation.tokenNumber}
                        </strong>

                      </div>

                      <div className="history-completed-badge">

                        <CheckCircle2 size={14} />

                        <span>
                          Completed
                        </span>

                      </div>

                    </div>


                    {/* ==================================================
                        RECORD INFORMATION
                    ================================================== */}

                    <div className="detailed-history-info">

                      <div className="history-info-item">

                        <span>
                          Queue Number
                        </span>

                        <strong>
                          #{consultation.queueNumber}
                        </strong>

                      </div>


                      <div className="history-info-item">

                        <span>
                          Date
                        </span>

                        <strong>
                          <CalendarDays size={14} />
                          {formatDate(consultation.date)}
                        </strong>

                      </div>


                      <div className="history-info-item">

                        <span>
                          Started
                        </span>

                        <strong>
                          {formatDateTime(
                            consultation.startTime
                          )}
                        </strong>

                      </div>


                      <div className="history-info-item">

                        <span>
                          Ended
                        </span>

                        <strong>
                          {formatDateTime(
                            consultation.endTime
                          )}
                        </strong>

                      </div>


                      <div className="history-info-item">

                        <span>
                          Duration
                        </span>

                        <strong className="duration-highlight">
                          {consultation.consultationDuration} min
                        </strong>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* ========================================================
          SMART CONSULTATION INSIGHT
      ======================================================== */}

      <section className="history-section smart-analysis-section">

        <div className="history-section-heading">

          <div>

            <span className="history-section-label">
              SMART ANALYSIS
            </span>

            <h2>
              Consultation Insights
            </h2>

            <p>
              Personalized analysis based on your recorded
              consultation duration data.
            </p>

          </div>

          <div className="smart-analysis-badge">

            <BrainCircuit size={15} />

            <span>
              Smart Insight
            </span>

          </div>

        </div>


        {/* ======================================================
            SMART STATISTICS
        ====================================================== */}

        <div className="history-stat-grid">

          <HistoryStat
            icon={<Activity size={21} />}
            label="Total Visits"
            value={version3.totalConsultations || 0}
          />

          <HistoryStat
            icon={<TrendingUp size={21} />}
            label="Overall Average"
            value={version3.averageDuration || 0}
            suffix="min"
          />

          <HistoryStat
            icon={<Clock3 size={21} />}
            label="Recent Average"
            value={version3.recentAverage || 0}
            suffix="min"
          />

          <HistoryStat
            icon={<Activity size={21} />}
            label="Performance"
            value={version3.performance || "N/A"}
          />

        </div>


        {/* ======================================================
            SMART INSIGHT CARD
        ====================================================== */}

        <div className="smart-insight-card">

          <div className="smart-insight-icon">
            <BrainCircuit size={24} />
          </div>

          <div className="smart-insight-content">

            <span>
              PERSONALIZED INSIGHT
            </span>

            <h3>
              {version3.insight ||
                "Not enough consultation data to generate an insight."}
            </h3>

            <p>
              This analysis is based on your recorded
              consultation duration data.
            </p>

          </div>

        </div>


        {/* ======================================================
            CONSULTATION TREND
        ====================================================== */}

        <div className="trend-analysis-card">

          <div className="trend-analysis-left">

            <span>
              CONSULTATION TREND
            </span>

            <h3>
              {version3.trend || "No Trend"}
            </h3>

            <p>
              Comparison between your recent and overall
              consultation duration.
            </p>

          </div>

          <div className="trend-analysis-icon">
            {getTrendIcon(version3.trend)}
          </div>

        </div>


        {/* ======================================================
            FASTEST / LONGEST
        ====================================================== */}

        <div className="history-stat-grid two-column">

          <HistoryStat
            icon={<Zap size={21} />}
            label="Fastest Visit"
            value={version3.fastestConsultation || 0}
            suffix="min"
          />

          <HistoryStat
            icon={<Clock3 size={21} />}
            label="Longest Visit"
            value={version3.longestConsultation || 0}
            suffix="min"
          />

        </div>

      </section>

    </div>
  );
}


// ============================================================
// STAT COMPONENT
// ============================================================

function HistoryStat({
  icon,
  label,
  value,
  suffix,
}) {
  return (
    <div className="history-stat-card">

      <div className="history-stat-icon">
        {icon}
      </div>

      <div className="history-stat-content">

        <span>
          {label}
        </span>

        <strong>
          {value}

          {suffix && (
            <small>
              {" "}
              {suffix}
            </small>
          )}

        </strong>

      </div>

    </div>
  );
}


// ============================================================
// DATE
// ============================================================

function formatDate(date) {

  if (!date) {
    return "--";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// ============================================================
// DATE + TIME
// ============================================================

function formatDateTime(date) {

  if (!date) {
    return "--";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


// ============================================================
// TREND ICON
// ============================================================

function getTrendIcon(trend) {

  if (trend === "Improving") {
    return <TrendingDown size={34} />;
  }

  if (trend === "Increasing") {
    return <TrendingUp size={34} />;
  }

  if (trend === "Stable") {
    return <Minus size={34} />;
  }

  return <Activity size={34} />;
}


export default ConsultationHistory;