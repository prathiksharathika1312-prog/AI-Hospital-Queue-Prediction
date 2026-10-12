import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./HospitalLoadPrediction.css";

function HospitalLoadPrediction({ onBack }) {
  const [v1, setV1] = useState(null);
  const [v2, setV2] = useState(null);
  const [v3, setV3] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchHospitalLoad = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [responseV1, responseV2, responseV3] = await Promise.all([
        axios.get("http://localhost:5000/hospital-load/v1"),
        axios.get("http://localhost:5000/hospital-load/v2"),
        axios.get("http://localhost:5000/hospital-load/v3"),
      ]);

      console.log("Hospital Load V1:", responseV1.data);
      console.log("Hospital Load V2:", responseV2.data);
      console.log("Hospital Load V3:", responseV3.data);

      setV1(responseV1.data);
      setV2(responseV2.data);
      setV3(responseV3.data);
    } catch (err) {
      console.error("Hospital Load Prediction Error:", err);

      setError(
        "Unable to load hospital prediction. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitalLoad();

    const interval = setInterval(() => {
      fetchHospitalLoad(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchHospitalLoad]);

  const getLoadClass = (level) => {
    if (!level) return "";
    return level.toLowerCase();
  };

  if (loading) {
    return (
      <div className="hospital-load-page">
        <button className="hospital-back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div className="hospital-loading-card">
          <div className="hospital-loading-icon">
            <span className="hospital-loading-mark">AI</span>
          </div>

          <h1>Hospital Load Prediction</h1>

          <p>Analyzing current hospital workload...</p>

          <div className="hospital-loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hospital-load-page">
        <button className="hospital-back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div className="hospital-error-card">
          <div className="hospital-error-icon">
            <span className="hospital-error-mark">!</span>
          </div>

          <h1>Unable to Load Prediction</h1>

          <p>{error}</p>

          <button
            className="hospital-retry-button"
            onClick={() => fetchHospitalLoad()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hospital-load-page">

      {/* HEADER */}

      <header className="hospital-load-header">
        <div className="hospital-header-left">

          <button
            className="hospital-back-button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

          <div className="hospital-title-row">

            <div className="hospital-title-icon">
              <span className="hospital-title-mark">AI</span>
            </div>

            <div>
              <span className="hospital-section-label">
                AI ANALYTICS
              </span>

              <h1>
                Hospital Load Prediction
              </h1>

              <p>
                AI-powered prediction of the current hospital workload.
              </p>
            </div>

          </div>
        </div>

        <div className="hospital-live-area">

          <div className="hospital-live-status">
            <span className="hospital-live-dot"></span>

            <span>
              Live Prediction
            </span>
          </div>

          <span className="hospital-refresh-text">
            Updates automatically every 30 seconds
          </span>

          <button
            className="hospital-refresh-button"
            onClick={() => fetchHospitalLoad(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh Now"}
          </button>

        </div>
      </header>

      {/* MAIN CONTENT */}

      <main className="hospital-load-content">

        {/* CURRENT HOSPITAL LOAD */}

        {v3 && (
          <section className="hospital-main-prediction">

            <div className="hospital-main-prediction-header">

              <div>
                <span className="hospital-card-label">
                  CURRENT HOSPITAL LOAD
                </span>

                <h2>
                  AI Workload Prediction
                </h2>
              </div>

              <div className="hospital-ai-icon">
                <span className="hospital-ai-mark">AI</span>
              </div>

            </div>

            <div className="hospital-prediction-center">

              <div
                className={`hospital-load-level ${getLoadClass(
                  v3.loadLevel
                )}`}
              >
                {v3.loadLevel}
              </div>

              <div className="hospital-confidence">

                <span>
                  Prediction Confidence
                </span>

                <strong>
                  {v3.confidence}%
                </strong>

              </div>

            </div>

            <div className="hospital-score-box">

              <span>
                LOAD SCORE
              </span>

              <strong>
                {v3.loadScore}
              </strong>

            </div>

          </section>
        )}

        {/* AI ANALYSIS */}

        {v3 && (
          <section className="hospital-analysis-card">

            <div className="hospital-analysis-heading">

              <div className="hospital-analysis-icon">
                <span className="hospital-analysis-mark">AI</span>
              </div>

              <div>

                <span>
                  AI ANALYSIS
                </span>

                <h2>
                  Prediction Insight
                </h2>

              </div>

            </div>

            <p className="hospital-analysis-text">
              {v3.predictionExplanation}
            </p>

            <div className="hospital-analysis-details">

              <div>
                <span>
                  Prediction Model
                </span>

                <strong>
                  Intelligent Workload Analysis
                </strong>
              </div>

              <div>
                <span>
                  Historical Samples
                </span>

                <strong>
                  {v3.historicalSamples}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* LIVE QUEUE DATA */}

        {v3 && (
          <section className="hospital-section">

            <div className="hospital-section-heading">

              <div>

                <span className="hospital-card-label">
                  LIVE QUEUE DATA
                </span>

                <h2>
                  Current Hospital Activity
                </h2>

              </div>

              <div className="hospital-live-badge">
                <span></span>
                LIVE
              </div>

            </div>

            <div className="hospital-activity-grid">

              <div className="hospital-activity-card">

                <div className="hospital-activity-icon">
                  <span>AP</span>
                </div>

                <div>

                  <span>
                    Active Patients
                  </span>

                  <strong>
                    {v3.activePatients}
                  </strong>

                  <small>
                    In active queue
                  </small>

                </div>

              </div>

              <div className="hospital-activity-card">

                <div className="hospital-activity-icon">
                  <span>WQ</span>
                </div>

                <div>

                  <span>
                    Waiting Patients
                  </span>

                  <strong>
                    {v3.waitingPatients}
                  </strong>

                  <small>
                    Currently waiting
                  </small>

                </div>

              </div>

              <div className="hospital-activity-card">

                <div className="hospital-activity-icon">
                  <span>IC</span>
                </div>

                <div>

                  <span>
                    In Consultation
                  </span>

                  <strong>
                    {v3.patientsInConsultation}
                  </strong>

                  <small>
                    Being consulted
                  </small>

                </div>

              </div>

              <div className="hospital-activity-card">

                <div className="hospital-activity-icon">
                  <span>AT</span>
                </div>

                <div>

                  <span>
                    Avg Consultation
                  </span>

                  <strong>
                    {v3.averageConsultationTime}
                    <small className="hospital-unit">
                      {" "}min
                    </small>
                  </strong>

                  <small>
                    Historical average
                  </small>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* PREDICTION FACTORS */}

        {v3 && v3.factors && (
          <section className="hospital-section">

            <div className="hospital-section-heading">

              <div>

                <span className="hospital-card-label">
                  PREDICTION FACTORS
                </span>

                <h2>
                  Workload Factors
                </h2>

              </div>

            </div>

            <div className="hospital-factor-grid">

              <div className="hospital-factor-card">
                <span>
                  Queue Activity
                </span>

                <strong>
                  {v3.factors.queueActivity}
                </strong>
              </div>

              <div className="hospital-factor-card">
                <span>
                  Waiting Queue
                </span>

                <strong>
                  {v3.factors.waitingQueue}
                </strong>
              </div>

              <div className="hospital-factor-card">
                <span>
                  Current Consultations
                </span>

                <strong>
                  {v3.factors.currentConsultations}
                </strong>
              </div>

              <div className="hospital-factor-card">
                <span>
                  Consultation Duration
                </span>

                <strong>
                  {v3.factors.consultationDuration}
                  <small>
                    {" "}min
                  </small>
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* MODEL EVOLUTION */}

        <section className="hospital-section">

          <div className="hospital-section-heading">

            <div>

              <span className="hospital-card-label">
                MODEL EVOLUTION
              </span>

              <h2>
                Current Prediction Model
              </h2>

            </div>

          </div>

          <div className="hospital-model-card">

            <div className="hospital-model-indicator">
              <span className="hospital-model-mark">
                AI
              </span>
            </div>

            <div className="hospital-model-content">

              <h3>
                Intelligent Workload Analysis
              </h3>

              <p>
                Uses live queue activity, consultation history,
                waiting patients, current consultations, and
                average consultation duration to estimate the
                current hospital workload.
              </p>

              {v3 && (
                <div className="hospital-model-result">

                  <div>
                    <span>
                      Current Load
                    </span>

                    <strong>
                      {v3.loadLevel}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Confidence
                    </span>

                    <strong>
                      {v3.confidence}%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Historical Samples
                    </span>

                    <strong>
                      {v3.historicalSamples}
                    </strong>
                  </div>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* FOOTER NOTE */}

        <div className="hospital-monitoring-note">

          <div className="hospital-monitoring-icon">
            <span className="hospital-monitoring-mark">
              AI
            </span>
          </div>

          <div>

            <strong>
              AI Hospital Workload Monitoring
            </strong>

            <p>
              Prediction is calculated from real-time queue
              activity and historical consultation data.
            </p>

          </div>

        </div>

        {/* AUTO REFRESH */}

        <div className="hospital-auto-refresh">

          <span className="hospital-refresh-dot"></span>

          Hospital load updates automatically every 30 seconds

          {refreshing && (
            <span className="hospital-refreshing-text">
              • Updating...
            </span>
          )}

        </div>

      </main>

    </div>
  );
}

export default HospitalLoadPrediction;