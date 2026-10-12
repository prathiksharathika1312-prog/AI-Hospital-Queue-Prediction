import React, { useEffect, useState } from "react";
import axios from "axios";

function DigitalQueueToken({ patient, onBack }) {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // ==========================================
  // GET EXISTING TOKEN
  // ==========================================

  useEffect(() => {

    if (patient?._id) {
      fetchToken();
    }

  }, [patient]);


  const fetchToken = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/queue/patient/${patient._id}`
      );

      setToken(response.data);
      setMessage("");

    } catch (error) {

      // 404 means no active token
      if (error.response?.status === 404) {

        setToken(null);

      } else {

        console.error(
          "Fetch token error:",
          error
        );

        setMessage(
          "Unable to check queue status."
        );
      }
    }
  };


  // ==========================================
  // JOIN QUEUE
  // ==========================================

  const joinQueue = async () => {

    if (!patient?._id) {

      setMessage(
        "Patient information is not available."
      );

      return;
    }


    try {

      setLoading(true);
      setMessage("");


      const response = await axios.post(
        "http://localhost:5000/queue/join",
        {
          patientId: patient._id,
        }
      );


      console.log(
        "Queue token:",
        response.data
      );


      setToken(response.data);

      setMessage(
        "Successfully joined the queue."
      );

    } catch (error) {

      console.error(
        "Join queue error:",
        error
      );


      setMessage(
        error.response?.data?.message ||
        "Unable to join queue."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // CANCEL TOKEN
  // ==========================================

  const cancelToken = async () => {

    if (!token?._id) {
      return;
    }


    try {

      setLoading(true);
      setMessage("");


      const response = await axios.put(
        `http://localhost:5000/queue/cancel/${token._id}`
      );


      console.log(
        "Cancel response:",
        response.data
      );


      setToken(null);

      setMessage(
        "Your queue token has been cancelled."
      );

    } catch (error) {

      console.error(
        "Cancel token error:",
        error
      );


      setMessage(
        error.response?.data?.message ||
        "Unable to cancel token."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="queue-token-page">


      {/* BACK BUTTON */}

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>


      {/* MAIN CARD */}

      <div className="queue-token-card">


        <div className="queue-icon">
          
        </div>


        <h1>
          Digital Queue Token
        </h1>


        <p className="queue-subtitle">
          Join the hospital queue digitally
        </p>


        {/* ==========================================
            NO TOKEN
        ========================================== */}

        {!token ? (

          <div className="join-section">

            <h2>
              No Active Token
            </h2>


            <p>
              You are not currently waiting
              in the hospital queue.
            </p>


            <button
              className="join-button"
              onClick={joinQueue}
              disabled={loading}
            >

              {loading
                ? "Joining Queue..."
                : "Join Queue"
              }

            </button>

          </div>

        ) : (

          /* ==========================================
             TOKEN EXISTS
          ========================================== */

          <div className="token-section">


            <p className="token-label">
              YOUR DIGITAL TOKEN
            </p>


            <div className="big-token">
              {token.tokenNumber}
            </div>


            <div className="queue-info">


              <div>

                <span>
                  Queue Position
                </span>

                <strong>
                  #{token.queueNumber}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {token.status}
                </strong>

              </div>


            </div>


            <button
              className="cancel-button"
              onClick={cancelToken}
              disabled={loading}
            >

              {loading
                ? "Cancelling..."
                : "Cancel Token"
              }

            </button>


          </div>

        )}


        {/* MESSAGE */}

        {message && (

          <p className="queue-message">
            {message}
          </p>

        )}

      </div>

    </div>
  );
}

export default DigitalQueueToken;