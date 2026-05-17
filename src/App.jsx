import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import CreateEventPage from "./pages/CreateEventPage";

function App() {
  const [authorized, setAuthorized] =
    useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  const [token, setToken] =
    useState("");

  const validTokens = [
    "WAL-48291",
    "WAL-19374",
    "WAL-77125",
  ];

  const handleTokenCheck = () => {
    if (
      validTokens.includes(token)
    ) {
      setAuthorized(true);
      setShowPopup(false);
    } else {
      alert(
        "Invalid token"
      );
    }
  };

  if (authorized) {
    return <CreateEventPage />;
  }

  return (
    <>
      <LandingPage />

      <button
        onClick={() =>
          setShowPopup(true)
        }
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          padding: "18px 26px",
          borderRadius: "18px",
          border: "none",
          background: "#2d2926",
          color: "white",
          cursor: "pointer",
          zIndex: 999,
          fontSize: "15px",
        }}
      >
        ENTER TOKEN
      </button>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "28px",
              width: "90%",
              maxWidth: "420px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Enter Your Token
            </h2>

            <p
              style={{
                opacity: 0.7,
                marginBottom: "20px",
                lineHeight: "1.7",
              }}
            >
              Enter the private
              token sent to your
              email after Etsy
              verification.
            </p>

            <input
              value={token}
              onChange={(e) =>
                setToken(
                  e.target.value
                )
              }
              placeholder="WAL-XXXXX"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border:
                  "1px solid #ddd",
                marginBottom: "18px",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={
                handleTokenCheck
              }
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background:
                  "#2d2926",
                color: "white",
                cursor: "pointer",
                marginBottom:
                  "12px",
              }}
            >
              CONTINUE
            </button>

            <button
              onClick={() =>
                setShowPopup(
                  false
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border:
                  "1px solid #ddd",
                background:
                  "white",
                cursor: "pointer",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;