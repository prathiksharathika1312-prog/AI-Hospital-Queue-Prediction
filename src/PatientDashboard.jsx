import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Hospital,
  Ticket,
  Clock3,
  ClipboardList,
  Activity,
  Bell,
  UserRound,
  CheckCircle2,
  CircleCheck,
  Stethoscope,
  RefreshCw,
  MapPin,
  LogOut,
  ArrowRight,
} from "lucide-react";

import DigitalQueueToken from "./DigitalQueueToken";
import WaitingTime from "./WaitingTime";
import ConsultationHistory from "./ConsultationHistory";
import HospitalLoadPrediction from "./HospitalLoadPrediction";
import BestTimeToVisit from "./BestTimeToVisit";
import SmartQueueTurnAlert from "./SmartQueueTurnAlert";
import PatientVisitReadiness from "./PatientVisitReadiness";

function PatientDashboard({ patient, onLogout }) {
  // ============================================================
  // SCREEN STATES
  // ============================================================

  const [showQueueToken, setShowQueueToken] = useState(false);
  const [showWaitingTime, setShowWaitingTime] = useState(false);
  const [showConsultationHistory, setShowConsultationHistory] =
    useState(false);
  const [showHospitalLoad, setShowHospitalLoad] = useState(false);
  const [showBestTime, setShowBestTime] = useState(false);
  const [showTurnAlert, setShowTurnAlert] = useState(false);
  const [showVisitReadiness, setShowVisitReadiness] = useState(false);

  // ============================================================
  // QUEUE STATE
  // ============================================================

  const [queueToken, setQueueToken] = useState(null);

  // ============================================================
  // WAITING TIME STATE
  // ============================================================

  const [waitingTime, setWaitingTime] = useState(null);
  const [waitingTimeLoading, setWaitingTimeLoading] = useState(false);

  // ============================================================
  // CONSULTATION HISTORY STATE
  // ============================================================

  const [consultationHistory, setConsultationHistory] = useState(null);
  const [consultationHistoryLoading, setConsultationHistoryLoading] =
    useState(false);

  // ============================================================
  // BEST TIME TO VISIT STATE
  // ============================================================

  const [bestTime, setBestTime] = useState(null);
  const [bestTimeLoading, setBestTimeLoading] = useState(false);

  // ============================================================
  // GET ACTIVE QUEUE TOKEN
  // ============================================================

  const fetchQueueToken = async () => {
    if (!patient?._id) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/queue/patient/${patient._id}`
      );

      console.log("Active queue token:", response.data);

      setQueueToken(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setQueueToken(null);
      } else {
        console.error("Queue token fetch error:", error);
      }
    }
  };

  // ============================================================
  // GET WAITING TIME
  // ============================================================

  const fetchWaitingTime = async () => {
    if (!patient?._id) {
      return;
    }

    setWaitingTimeLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/queue/waiting-time/${patient._id}`
      );

      console.log("Waiting Time:", response.data);

      setWaitingTime(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setWaitingTime(null);
      } else {
        console.error("Waiting time fetch error:", error);
      }
    } finally {
      setWaitingTimeLoading(false);
    }
  };

  // ============================================================
  // GET CONSULTATION HISTORY
  // ============================================================

  const fetchConsultationHistory = async () => {
    if (!patient?._id) {
      return;
    }

    setConsultationHistoryLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/consultation-history/patient/${patient._id}`
      );

      console.log("Consultation History:", response.data);

      setConsultationHistory(response.data);
    } catch (error) {
      console.error("Consultation History Error:", error);
      setConsultationHistory(null);
    } finally {
      setConsultationHistoryLoading(false);
    }
  };

  // ============================================================
  // GET BEST TIME TO VISIT
  // ============================================================

  const fetchBestTime = async () => {
    if (!patient?._id) {
      return;
    }

    setBestTimeLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/best-time/${patient._id}`
      );

      console.log("Best Time:", response.data);

      setBestTime(response.data);
    } catch (error) {
      console.error("Best Time Error:", error);
      setBestTime(null);
    } finally {
      setBestTimeLoading(false);
    }
  };

  // ============================================================
  // INITIAL DATA FETCH
  // ============================================================

  useEffect(() => {
    if (!patient?._id) {
      return;
    }

    fetchQueueToken();
    fetchWaitingTime();
    fetchConsultationHistory();
    fetchBestTime();
  }, [patient?._id]);

  // ============================================================
  // AUTO REFRESH
  // EVERY 30 SECONDS
  // ============================================================

  useEffect(() => {
    if (!patient?._id) {
      return;
    }

    const interval = setInterval(() => {
      console.log("Dashboard auto refresh");

      fetchQueueToken();
      fetchWaitingTime();
      fetchConsultationHistory();
      fetchBestTime();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [patient?._id]);

  // ============================================================
  // RETURN TO DASHBOARD
  // ============================================================

  const returnToDashboard = () => {
    setShowQueueToken(false);
    setShowWaitingTime(false);
    setShowConsultationHistory(false);
    setShowHospitalLoad(false);
    setShowBestTime(false);
    setShowTurnAlert(false);
    setShowVisitReadiness(false);

    fetchQueueToken();
    fetchWaitingTime();
    fetchConsultationHistory();
    fetchBestTime();
  };

  // ============================================================
  // OPEN FEATURE WITH KEYBOARD SUPPORT
  // ============================================================

  const handleCardKeyDown = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  // ============================================================
  // QUEUE STATUS
  // ============================================================

  const queueStatus = queueToken?.status || "Not Joined";

  // ============================================================
  // QUEUE POSITION
  // ============================================================

  const queuePosition =
    queueToken?.queueNumber !== undefined &&
    queueToken?.queueNumber !== null
      ? `#${queueToken.queueNumber}`
      : "--";

  // ============================================================
  // WAITING TIME DISPLAY
  // ============================================================

  const displayWaitingTime = getDisplayWaitingTime(waitingTime);

  // ============================================================
  // CONSULTATION COUNT
  // ============================================================

  const consultationCount =
    consultationHistory?.version2?.totalConsultations ??
    consultationHistory?.version1?.consultations?.length ??
    0;

  // ============================================================
  // BEST TIME DISPLAY
  // ============================================================

  const recommendedTime = bestTime?.recommendedTime || "--";

  const expectedWaiting = bestTime?.expectedWaitingTime || "--";

  const expectedWorkload = bestTime?.expectedWorkload || "Loading...";

  // ============================================================
  // WORKLOAD CLASS
  // ============================================================

  const getWorkloadClass = (workload) => {
    const value = String(workload || "").toLowerCase();

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
  };

  // ============================================================
  // DIGITAL QUEUE TOKEN SCREEN
  // ============================================================

  if (showQueueToken) {
    return (
      <DigitalQueueToken
        patient={patient}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // WAITING TIME SCREEN
  // ============================================================

  if (showWaitingTime) {
    return (
      <WaitingTime
        patient={patient}
        waitingTime={waitingTime}
        loading={waitingTimeLoading}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // CONSULTATION HISTORY SCREEN
  // ============================================================

  if (showConsultationHistory) {
    return (
      <ConsultationHistory
        history={consultationHistory}
        loading={consultationHistoryLoading}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // HOSPITAL LOAD PREDICTION SCREEN
  // ============================================================

  if (showHospitalLoad) {
    return (
      <HospitalLoadPrediction
        patient={patient}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // BEST TIME TO VISIT SCREEN
  // ============================================================

  if (showBestTime) {
    return (
      <BestTimeToVisit
        patient={patient}
        bestTime={bestTime}
        loading={bestTimeLoading}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // SMART QUEUE TURN ALERT SCREEN
  // ============================================================

  if (showTurnAlert) {
    return (
      <SmartQueueTurnAlert
        patient={patient}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // PATIENT VISIT READINESS SCREEN
  // ============================================================

  if (showVisitReadiness) {
    return (
      <PatientVisitReadiness
        patient={patient}
        onBack={returnToDashboard}
      />
    );
  }

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="patient-dashboard">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div className="brand-section">

          <div className="brand-icon">
            <Hospital size={24} strokeWidth={2} />
          </div>

          <div>
            <h1>
              AI Hospital Queue
            </h1>

            <p>
              Smart Patient Management
            </p>
          </div>

        </div>

        <div className="header-right">

          <div className="patient-mini-profile">

            <div className="profile-avatar">
              {patient?.name
                ? patient.name.charAt(0).toUpperCase()
                : "P"}
            </div>

            <div className="header-patient-info">

              <span>
                Patient
              </span>

              <strong>
                {patient?.name || "Patient"}
              </strong>

            </div>

          </div>

          <button
            className="logout-btn"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </header>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="dashboard-content">

        {/* ====================================================
            WELCOME SECTION
        ==================================================== */}

        <section className="welcome-section">

          <div>

            <span className="welcome-label">
              PATIENT DASHBOARD
            </span>

            <h2>
              Good morning, {patient?.name || "Patient"}
            </h2>

            <p>
              Here's your current hospital queue status.
            </p>

          </div>

          <div className="system-status">

            <span className="status-dot"></span>

            <span>
              System Online
            </span>

          </div>

        </section>

        {/* ====================================================
            LIVE QUEUE SUMMARY
        ==================================================== */}

        <section className="dashboard-panel live-queue-summary">

          <div className="live-summary-header">

            <div>

              <span className="section-label">
                LIVE QUEUE
              </span>

              <h3>
                Your Current Queue Status
              </h3>

            </div>

            <span className="live-indicator">

              <span className="status-dot"></span>

              Live

            </span>

          </div>

          <div className="live-summary-grid">

            {/* TOKEN */}

            <div className="live-summary-item">

              <div className="live-summary-icon">
                <Ticket size={22} />
              </div>

              <div>

                <span>
                  Queue Token
                </span>

                <strong>
                  {queueToken?.tokenNumber || "--"}
                </strong>

              </div>

            </div>

            {/* QUEUE POSITION */}

            <div className="live-summary-item">

              <div className="live-summary-icon">
                <MapPin size={22} />
              </div>

              <div>

                <span>
                  Queue Position
                </span>

                <strong>
                  {queuePosition}
                </strong>

              </div>

            </div>

            {/* WAITING TIME */}

            <div className="live-summary-item">

              <div className="live-summary-icon">
                <Clock3 size={22} />
              </div>

              <div>

                <span>
                  Estimated Waiting
                </span>

                <strong>
                  {waitingTimeLoading
                    ? "..."
                    : waitingTime
                    ? waitingTime.status === "In Consultation"
                      ? "Now"
                      : `${displayWaitingTime} min`
                    : "--"}
                </strong>

              </div>

            </div>

            {/* STATUS */}

            <div className="live-summary-item">

              <div className="live-summary-icon">
                <Activity size={22} />
              </div>

              <div>

                <span>
                  Queue Status
                </span>

                <strong>
                  {queueStatus}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            AI QUEUE SERVICES HEADER
        ==================================================== */}

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              SMART SERVICES
            </span>

            <h3>
              AI Queue Services
            </h3>

          </div>

          <p>
            Select a service to view detailed information.
          </p>

        </div>

        {/* ====================================================
            FEATURE CARDS
        ==================================================== */}

        <section className="feature-grid">

          {/* ==================================================
              DIGITAL QUEUE TOKEN
          ================================================== */}

          <div
            className="dashboard-card clickable-card"
            onClick={() => setShowQueueToken(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () =>
                setShowQueueToken(true)
              )
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <Ticket size={24} />
              </div>

              <span className="card-label">
                QUEUE MANAGEMENT
              </span>

            </div>

            <h3>
              Digital Queue Token
            </h3>

            <div className="card-value">
              {queueToken?.tokenNumber || "--"}
            </div>

            <p>
              {queueToken
                ? "Your active digital queue token."
                : "Join the hospital queue digitally."}
            </p>

            <span className="feature-status">
              {queueToken
                ? queueToken.status
                : "Not Joined"}
            </span>

            <div className="card-click-hint">
              View token
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              WAITING TIME PREDICTION
          ================================================== */}

          <div
            className="dashboard-card clickable-card waiting-time-dashboard-card"
            onClick={() => {
              fetchWaitingTime();
              setShowWaitingTime(true);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () => {
                fetchWaitingTime();
                setShowWaitingTime(true);
              })
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <Clock3 size={24} />
              </div>

              <span className="card-label">
                AI PREDICTION
              </span>

            </div>

            <h3>
              Waiting Time Prediction
            </h3>

            <div className="card-value">

              {waitingTimeLoading ? (
                "..."
              ) : waitingTime ? (

                waitingTime.status === "In Consultation" ? (
                  "Now"
                ) : (
                  <>
                    {displayWaitingTime}
                    <small> min</small>
                  </>
                )

              ) : (

                <>
                  --
                  <small> min</small>
                </>

              )}

            </div>

            <p>
              AI prediction based on the real queue
              and consultation history.
            </p>

            <span className="feature-status">
              {waitingTime
                ? waitingTime.status || "Prediction Active"
                : "Join Queue"}
            </span>

            <div className="card-click-hint">
              View prediction
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              CONSULTATION HISTORY
          ================================================== */}

          <div
            className="dashboard-card clickable-card"
            onClick={() => {
              setShowConsultationHistory(true);
              fetchConsultationHistory();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () => {
                setShowConsultationHistory(true);
                fetchConsultationHistory();
              })
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <ClipboardList size={24} />
              </div>

              <span className="card-label">
                MEDICAL RECORDS
              </span>

            </div>

            <h3>
              Consultation History
            </h3>

            <div className="card-value">

              {consultationHistory
                ? consultationCount
                : "--"}

              <small>
                {consultationHistory
                  ? " records"
                  : ""}
              </small>

            </div>

            <p>
              View previous consultations, dates,
              duration, and intelligent insights.
            </p>

            <span className="feature-status">
              Available
            </span>

            <div className="card-click-hint">
              View history
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              HOSPITAL LOAD PREDICTION
          ================================================== */}

          <div
            className="dashboard-card clickable-card"
            onClick={() => setShowHospitalLoad(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () =>
                setShowHospitalLoad(true)
              )
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <Hospital size={24} />
              </div>

              <span className="card-label">
                AI PREDICTION
              </span>

            </div>

            <h3>
              Hospital Load Prediction
            </h3>

            <div className="card-value">
              AI
            </div>

            <p>
              Predict whether hospital workload
              is Low, Medium, or High.
            </p>

            <span className="feature-status">
              Live prediction
            </span>

            <div className="card-click-hint">
              View prediction
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              BEST TIME TO VISIT
          ================================================== */}

          <div
            className="dashboard-card best-time-card clickable-card"
            onClick={() => {
              fetchBestTime();
              setShowBestTime(true);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () => {
                fetchBestTime();
                setShowBestTime(true);
              })
            }
          >

            <div className="card-top">

              <div className="card-icon best-time-icon">
                <Clock3 size={24} />
              </div>

              <span className="card-label">
                AI RECOMMENDATION
              </span>

            </div>

            <h3>
              Best Time to Visit
            </h3>

            <div className="best-time">
              {bestTimeLoading
                ? "..."
                : recommendedTime}
            </div>

            <p>
              Recommended arrival time based on
              hospital activity and historical data.
            </p>

            <div className="expected-wait">
              Expected waiting:{" "}
              {expectedWaiting}
            </div>

            <span
              className={
                "status-badge " +
                getWorkloadClass(expectedWorkload)
              }
            >
              {expectedWorkload === "Low"
                ? "Low expected crowd"
                : expectedWorkload === "Medium"
                ? "Moderate expected crowd"
                : expectedWorkload === "High"
                ? "High expected crowd"
                : expectedWorkload}
            </span>

            <div className="card-click-hint">
              View recommendation
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              SMART QUEUE TURN ALERT
          ================================================== */}

          <div
            className="dashboard-card clickable-card"
            onClick={() => setShowTurnAlert(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () =>
                setShowTurnAlert(true)
              )
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <Bell size={24} />
              </div>

              <span className="card-label">
                SMART QUEUE
              </span>

            </div>

            <h3>
              Smart Queue Turn Alert
            </h3>

            <div className="card-value">
              {queueToken
                ? "Active"
                : "--"}
            </div>

            <p>
              Know when your consultation turn
              is getting closer.
            </p>

            <span className="feature-status">
              {queueToken
                ? "Active"
                : "Available"}
            </span>

            <div className="card-click-hint">
              View turn alert
              <ArrowRight size={16} />
            </div>

          </div>

          {/* ==================================================
              PATIENT VISIT READINESS
          ================================================== */}

          <div
            className="dashboard-card clickable-card"
            onClick={() => setShowVisitReadiness(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              handleCardKeyDown(event, () =>
                setShowVisitReadiness(true)
              )
            }
          >

            <div className="card-top">

              <div className="card-icon">
                <CheckCircle2 size={24} />
              </div>

              <span className="card-label">
                SMART ASSISTANT
              </span>

            </div>

            <h3>
              Patient Visit Readiness
            </h3>

            <div className="card-value">
              {queueToken
                ? "Ready Check"
                : "--"}
            </div>

            <p>
              Check whether you are ready for
              your consultation.
            </p>

            <span className="feature-status">
              Available
            </span>

            <div className="card-click-hint">
              Check readiness
              <ArrowRight size={16} />
            </div>

          </div>

        </section>

        {/* ====================================================
            QUEUE OVERVIEW
        ==================================================== */}

        <section className="dashboard-panel queue-overview">

          <div className="panel-heading">

            <div>

              <span className="section-label">
                QUEUE STATUS
              </span>

              <h3>
                Your Queue Journey
              </h3>

            </div>

            <span className="waiting-status">
              {queueStatus}
            </span>

          </div>

          <div className="queue-progress">

            {/* REGISTRATION */}

            <div className="progress-step active">

              <div className="step-circle">
                <CircleCheck size={20} />
              </div>

              <span>
                Registration
              </span>

            </div>

            <div className="progress-line active-line"></div>

            {/* QUEUE */}

            <div
              className={
                queueToken
                  ? "progress-step current"
                  : "progress-step"
              }
            >

              <div className="step-circle">
                {queueToken ? (
                  <CircleCheck size={20} />
                ) : (
                  "2"
                )}
              </div>

              <span>
                Queue
              </span>

            </div>

            <div
              className={
                queueToken
                  ? "progress-line active-line"
                  : "progress-line"
              }
            ></div>

            {/* CONSULTATION */}

            <div
              className={
                queueToken?.status === "Completed"
                  ? "progress-step active"
                  : queueToken?.status === "In Consultation"
                  ? "progress-step current"
                  : "progress-step"
              }
            >

              <div className="step-circle">

                {queueToken?.status === "Completed" ? (
                  <CircleCheck size={20} />
                ) : (
                  "3"
                )}

              </div>

              <span>
                Consultation
              </span>

            </div>

          </div>

          {/* QUEUE STATUS MESSAGE */}

          <div className="queue-status-message">

            {queueToken?.status === "In Consultation" ? (

              <>
                <span className="queue-message-icon">
                  <Stethoscope size={23} />
                </span>

                <div>

                  <strong>
                    Your consultation is in progress
                  </strong>

                  <p>
                    Please proceed with your consultation.
                  </p>

                </div>
              </>

            ) : queueToken?.status === "Completed" ? (

              <>
                <span className="queue-message-icon">
                  <CircleCheck size={23} />
                </span>

                <div>

                  <strong>
                    Consultation completed
                  </strong>

                  <p>
                    Your consultation has been completed.
                  </p>

                </div>
              </>

            ) : queueToken ? (

              <>
                <span className="queue-message-icon">
                  <Clock3 size={23} />
                </span>

                <div>

                  <strong>
                    You are currently waiting in the queue
                  </strong>

                  <p>
                    Your AI waiting-time prediction is updated
                    automatically.
                  </p>

                </div>
              </>

            ) : (

              <>
                <span className="queue-message-icon">
                  <Ticket size={23} />
                </span>

                <div>

                  <strong>
                    You have not joined the queue
                  </strong>

                  <p>
                    Open Digital Queue Token to join the queue.
                  </p>

                </div>
              </>

            )}

          </div>

        </section>

        {/* ====================================================
            BOTTOM SECTION
        ==================================================== */}

        <section className="bottom-grid">

          {/* ==================================================
              PATIENT INFORMATION
          ================================================== */}

          <div className="dashboard-panel">

            <div className="panel-title">

              <span className="panel-title-icon">
                <UserRound size={20} />
              </span>

              <div>

                <span className="section-label">
                  PROFILE
                </span>

                <h3>
                  Patient Information
                </h3>

              </div>

            </div>

            <div className="patient-details">

              <div className="detail-row">

                <span>
                  Patient Name
                </span>

                <strong>
                  {patient?.name || "--"}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  Age
                </span>

                <strong>
                  {patient?.age || "--"}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  Phone Number
                </span>

                <strong>
                  {patient?.phone || "--"}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  Symptoms
                </span>

                <strong>
                  {patient?.disease || "--"}
                </strong>

              </div>

            </div>

          </div>

          {/* ==================================================
              HOSPITAL STATUS
          ================================================== */}

          <div className="dashboard-panel">

            <div className="panel-title">

              <span className="panel-title-icon">
                <Hospital size={20} />
              </span>

              <div>

                <span className="section-label">
                  HOSPITAL
                </span>

                <h3>
                  Hospital Status
                </h3>

              </div>

            </div>

            <div className="hospital-status">

              <div className="large-status-icon">
                <CheckCircle2 size={28} />
              </div>

              <div>

                <h4>
                  All Systems Operational
                </h4>

                <p>
                  Queue management system is
                  running normally.
                </p>

              </div>

            </div>

            <div className="status-info">

              <span className="status-dot"></span>

              Hospital Queue System Online

            </div>

            <div className="hospital-status-note">

              <span>
                <RefreshCw size={17} />
              </span>

              <p>
                Queue data and AI predictions refresh
                automatically every 30 seconds.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            DASHBOARD FOOTER
        ==================================================== */}

        <div className="dashboard-footer">

          <span>
            AI Hospital Queue Management System
          </span>

          <span>
            Smart • Predictive • Real-Time
          </span>

        </div>

      </main>

    </div>
  );
}

// ============================================================
// WAITING TIME DISPLAY HELPER
// ============================================================

function getDisplayWaitingTime(data) {
  if (!data) {
    return 0;
  }

  if (data.status === "In Consultation") {
    return 0;
  }

  return Number(data.estimatedWaitingTime || 0);
}

export default PatientDashboard;