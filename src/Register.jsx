import { useState } from "react";
import axios from "axios";

function Register({ setPage }) {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    phone: "",
    disease: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending patient:", patient);

      const response = await axios.post(
        "http://localhost:5000/patients/add",
        patient
      );

      console.log("Registration response:", response.data);

      alert("Patient registered successfully!");

      setPage("login");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Error adding patient"
      );
    }
  };

  return (
    <div>
      <h1>AI Hospital Queue</h1>

      <h2>Patient Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Patient Name"
          value={patient.name}
          onChange={(e) =>
            setPatient({
              ...patient,
              name: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Age"
          value={patient.age}
          onChange={(e) =>
            setPatient({
              ...patient,
              age: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={patient.phone}
          onChange={(e) =>
            setPatient({
              ...patient,
              phone: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Disease / Symptoms"
          value={patient.disease}
          onChange={(e) =>
            setPatient({
              ...patient,
              disease: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Create Password"
          value={patient.password}
          onChange={(e) =>
            setPatient({
              ...patient,
              password: e.target.value,
            })
          }
        />

        <button type="submit">
          Register
        </button>

      </form>

      <p>Already have an account?</p>

      <button
        type="button"
        onClick={() => setPage("login")}
      >
        Back to Login
      </button>
    </div>
  );
}

export default Register;
