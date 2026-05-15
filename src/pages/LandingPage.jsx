import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function LandingPage() {
  const [coupleName, setCoupleName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [packageType, setPackageType] = useState("basic");

  const createEvent = async () => {
    const token = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await setDoc(doc(db, "events", token), {
      token,
      coupleName,
      eventDate,
      city,
      venueName,
      packageType,
      createdAt: Date.now(),
    });

    alert(
      `EVENT CREATED 🎉

Welcome:
${window.location.origin}/welcome/${token}

Gallery:
${window.location.origin}/gallery/${token}`
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f1eb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          WALNORY EVENT PANEL
        </h1>

        <input
          placeholder="Couple Name"
          value={coupleName}
          onChange={(e) =>
            setCoupleName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) =>
            setEventDate(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Venue Name"
          value={venueName}
          onChange={(e) =>
            setVenueName(e.target.value)
          }
          style={inputStyle}
        />

        <select
          value={packageType}
          onChange={(e) =>
            setPackageType(e.target.value)
          }
          style={inputStyle}
        >
          <option value="basic">Basic</option>
          <option value="premium">
            Premium
          </option>
        </select>

        <button
          onClick={createEvent}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: "black",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          CREATE EVENT
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default LandingPage;