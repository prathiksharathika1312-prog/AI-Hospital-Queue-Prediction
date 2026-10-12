import { useState } from "react";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import PatientDashboard from "./PatientDashboard";

function App() {
  // Which page should be displayed?
  const [page, setPage] = useState("login");

  // Store the patient who successfully logged in
  const [loggedInPatient, setLoggedInPatient] = useState(null);

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    setLoggedInPatient(null);
    setPage("login");
  };

  // ================================
  // REGISTER PAGE
  // ================================

  if (page === "register") {
    return <Register setPage={setPage} />;
  }

  // ================================
  // LOGIN PAGE
  // ================================

  if (page === "login") {
    return (
      <Login
        setPage={setPage}
        setLoggedInPatient={setLoggedInPatient}
      />
    );
  }

  // ================================
  // PATIENT DASHBOARD
  // ================================

  if (page === "dashboard") {
    return (
      <PatientDashboard
        patient={loggedInPatient}
        onLogout={handleLogout}
      />
    );
  }

  // Default page
  return null;
}

export default App;