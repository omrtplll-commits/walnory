import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { QRCodeCanvas } from "qrcode.react";

import { useNavigate } from "react-router-dom";

function CreateEventPage() {
  const navigate =
    useNavigate();

  const [eventName, setEventName] =
    useState("");

  const [coupleNames, setCoupleNames] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [venue, setVenue] =
    useState("");

  const [created, setCreated] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [eventLink, setEventLink] =
    useState("");

  const handleCreate =
    async () => {
      try {
        setLoading(true);

        const docRef =
          await addDoc(
            collection(
              db,
              "events"
            ),
            {
              eventName,
              coupleNames,
              eventDate,
              venue,
              createdAt:
                new Date(),
            }
          );

        const generatedLink = `http://localhost:5173/event/${docRef.id}`;

        setEventLink(
          generatedLink
        );

        setCreated(true);

        console.log(
          "Event saved:",
          docRef.id
        );
      } catch (error) {
        console.error(error);

        alert(
          "Firebase save error"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      eventLink
    );

    alert("Link copied");
  };

  const handleDownload = () => {
    const canvas =
      document.getElementById(
        "walnoryQR"
      );

    const pngUrl =
      canvas.toDataURL(
        "image/png"
      );

    const downloadLink =
      document.createElement(
        "a"
      );

    downloadLink.href = pngUrl;

    downloadLink.download =
      "walnory-qr.png";

    downloadLink.click();
  };

  const openEventPage =
    () => {
      navigate(
        eventLink.replace(
          "http://localhost:5173",
          ""
        )
      );
    };

  if (created) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            background: "white",
            borderRadius: "32px",
            padding: "50px",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              letterSpacing: "4px",
              fontSize: "13px",
              opacity: 0.5,
              marginBottom: "18px",
            }}
          >
            EVENT READY
          </div>

          <h1
            style={{
              fontSize: "52px",
              marginBottom: "18px",
              color: "#2d2926",
            }}
          >
            Your QR Experience
            Is Ready
          </h1>

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "24px",
              width: "fit-content",
              margin:
                "0 auto 30px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <QRCodeCanvas
              id="walnoryQR"
              value={eventLink}
              size={220}
            />
          </div>

          <div
            style={{
              background: "#f8f5f0",
              padding: "18px",
              borderRadius: "18px",
              marginBottom: "20px",
              wordBreak:
                "break-all",
            }}
          >
            {eventLink}
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent:
                "center",
              flexWrap: "wrap",
              marginBottom: "50px",
            }}
          >
            <button
              onClick={handleCopy}
              style={buttonStyle}
            >
              COPY LINK
            </button>

            <button
              onClick={
                handleDownload
              }
              style={buttonStyle}
            >
              DOWNLOAD QR
            </button>

            <button
              onClick={
                openEventPage
              }
              style={buttonStyle}
            >
              OPEN EVENT PAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          borderRadius: "32px",
          padding: "50px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            marginBottom: "40px",
          }}
        >
          Create Your Event
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "20px",
          }}
        >
          <input
            placeholder="Event Name"
            value={eventName}
            onChange={(e) =>
              setEventName(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Couple / Host Names"
            value={coupleNames}
            onChange={(e) =>
              setCoupleNames(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) =>
              setEventDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="Venue Location"
            value={venue}
            onChange={(e) =>
              setVenue(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "none",
              background:
                "#2d2926",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "CREATING..."
              : "CREATE EVENT"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "18px 28px",
  borderRadius: "18px",
  border: "none",
  background: "#2d2926",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
};

export default CreateEventPage;