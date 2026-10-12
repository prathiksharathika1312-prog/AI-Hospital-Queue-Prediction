function Dashboard({ setPage, patient }) {

  const handleLogout = () => {
    setPage("login");
  };

  return (
    <div>

      <h1>AI Hospital Queue</h1>

      <h2>Patient Dashboard</h2>

      {patient && (
        <div>

          <h3>
            Welcome, {patient.name} 
          </h3>

          <p>
            Age: {patient.age}
          </p>

          <p>
            Phone: {patient.phone}
          </p>

          <p>
            Disease: {patient.disease}
          </p>

        </div>
      )}

      <hr />

      <h3>Appointments</h3>

      <p>
        No appointments yet.
      </p>

      <button>
        Book Appointment
      </button>

      <hr />

      <h3>Queue Status</h3>

      <p>
        You are currently not in the queue.
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;