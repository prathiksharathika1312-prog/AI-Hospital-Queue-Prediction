import React, { useEffect, useState } from "react";
import axios from "axios";

function WaitingTimePrediction({ patient }) {

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrediction = async () => {

    try {

      if (!patient || !patient._id) {
        setError("Patient information not available");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/queue/waiting-time/${patient._id}`
      );

      setPrediction(response.data);

      setError("");

    } catch (err) {

      console.error(
        "Waiting time prediction error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to calculate waiting time"
      );

    } finally {

      setLoading(false);

    }
  };


  // Initial prediction
  useEffect(() => {

    fetchPrediction();

  }, [patient]);


  // Refresh prediction every 30 seconds
  useEffect(() => {

    const interval = setInterval(() => {
      fetchPrediction();
    }, 30000);

    return () => {
      clearInterval(interval);
    };

  }, [patient]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="waiting-time-card">

        <div className="waiting-time-header">
          <div>
            <span className="feature-icon">🤖</span>

            <h2>
              AI Waiting Time Prediction
            </h2>

            <p>
              Analyzing current hospital queue...
            </p>
          </div>
        </div>

        <div className="waiting-time-loading">
          Calculating prediction...
        </div>

      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="waiting-time-card">

        <div className="waiting-time-header">

          <div>
            <span className="feature-icon">🤖</span>

            <h2>
              AI Waiting Time Prediction
            </h2>

            <p>
              Smart queue analysis
            </p>
          </div>

        </div>

        <div className="waiting-time-error">
          {error}
        </div>

      </div>
    );
  }


  if (!prediction) {
    return null;
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const waitingTime =
    prediction.estimatedWaitingTime;

  const patientsAhead =
    prediction.patientsAhead;

  const averageTime =
    prediction.averageConsultationTime;

  const confidence =
    prediction.confidence;

  const status =
    prediction.status;


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="waiting-time-card">

      {/* HEADER */}

      <div className="waiting-time-header">

        <div>

          <div className="waiting-time-title-row">

            <span className="feature-icon">
              🤖
            </span>

            <div>

              <h2>
                AI Waiting Time Prediction
              </h2>

              <p>
                Real-time queue prediction
              </p>

            </div>

          </div>

        </div>

        <div className="prediction-version">
          V3
        </div>

      </div>


      {/* ESTIMATED TIME */}

      <div className="estimated-time-section">

        <span className="estimated-label">
          ESTIMATED WAITING TIME
        </span>

        <div className="estimated-time">

          {status === "In Consultation"
            ? "Now"
            : `${waitingTime} min`
          }

        </div>

        <div className="waiting-status">

          {status === "In Consultation"
            ? "Your consultation is in progress"
            : "Waiting"
          }

        </div>

      </div>


      {/* INFORMATION GRID */}

      <div className="waiting-info-grid">

        <div className="waiting-info-box">

          <span>
            Queue Token
          </span>

          <strong>
            {prediction.tokenNumber}
          </strong>

        </div>


        <div className="waiting-info-box">

          <span>
            Queue Position
          </span>

          <strong>
            #{prediction.queuePosition}
          </strong>

        </div>


        <div className="waiting-info-box">

          <span>
            Patients Ahead
          </span>

          <strong>
            {patientsAhead}
          </strong>

        </div>


        <div className="waiting-info-box">

          <span>
            Avg. Consultation
          </span>

          <strong>
            {averageTime} min
          </strong>

        </div>

      </div>


      {/* PREDICTION DETAILS */}

      <div className="prediction-details">

        <div className="prediction-detail-row">

          <span>
            📊 Historical consultations
          </span>

          <strong>
            {prediction.historicalSamples}
          </strong>

        </div>


        <div className="prediction-detail-row">

          <span>
            🎯 Prediction confidence
          </span>

          <strong>
            {confidence}
          </strong>

        </div>


        {prediction.currentConsultationRemaining > 0 && (

          <div className="prediction-detail-row">

            <span>
              ⏱️ Current consultation remaining
            </span>

            <strong>
              {prediction.currentConsultationRemaining} min
            </strong>

          </div>

        )}

      </div>


      {/* FORMULA */}

      <div className="prediction-formula">

        <div className="formula-title">
          🧮 Prediction Calculation
        </div>

        <div className="formula-text">

          {patientsAhead} patients ×{" "}
          {averageTime} min average
          consultation

        </div>

      </div>


      {/* REFRESH */}

      <button
        className="refresh-prediction-button"
        onClick={fetchPrediction}
      >
        🔄 Refresh Prediction
      </button>


      <div className="prediction-footer">

        Prediction automatically updates
        every 30 seconds

      </div>

    </div>
  );
}

export default WaitingTimePrediction;