import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import QRCode from "qrcode";

function LandingPage() {
  const [coupleName, setCoupleName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [packageType, setPackageType] =
    useState("basic");

  const [qrImage, setQrImage] = useState("");
  const [welcomeLink, setWelcomeLink] =
    useState("");

  const createEvent = async () => {
    const token = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const welcomeUrl =
      `${window.location.origin}/welcome/${token}`;

    await setDoc(doc(db, "events", token), {
      token,
      coupleName,
      eventDate,
      city,
      venueName,
      packageType,
      createdAt: Date.now(),
    });

    const qrData =
      await QRCode.toDataURL(welcomeUrl);

    setQrImage(qrData);
    setWelcomeLink(welcomeUrl);
  };

  const downloadQR = () => {
    const link = document.createElement("a");

    link.href = qrImage;

    link.download = "walnory-qr.png";

    link.click();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      welcomeLink
    );

    alert("LINK COPIED ✅");
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
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
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
          style={buttonStyle}
        >
          CREATE EVENT
        </button>

        {qrImage && (
          <div
            style={{
              marginTop: "40px",
              textAlign: "center",
            }}
          >
            <img
              src={qrImage}
              alt="QR"
              style={{
                width: "220px",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                wordBreak: "break-all",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {welcomeLink}
            </div>

            <button
              onClick={downloadQR}
              style={buttonStyle}
            >
              DOWNLOAD QR
            </button>

            <button
              onClick={copyLink}
              style={{
                ...buttonStyle,
                marginTop: "12px",
                background: "#444",
              }}
            >
              COPY LINK
            </button>
          </div>
        )}
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

const buttonStyle = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  background: "black",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

export default LandingPage;