import { useState } from "react";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { QRCodeCanvas } from "qrcode.react";

import { useNavigate } from "react-router-dom";

import generateMemoryPdf from "../utils/generateMemoryPdf";

function CreateEventPage() {
  const navigate =
    useNavigate();

  const [token, setToken] =
    useState("");

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

  const [ownerLink, setOwnerLink] =
    useState("");

  const handleCreate =
    async () => {
      try {
        setLoading(true);

        const tokenRef = doc(
          db,
          "tokens",
          token
        );

        const tokenSnap =
          await getDoc(
            tokenRef
          );

        if (
          !tokenSnap.exists()
        ) {
          alert(
            "Invalid token"
          );

          setLoading(false);

          return;
        }

        const tokenData =
          tokenSnap.data();

        if (
          tokenData.used
        ) {
          alert(
            "This token has already been used"
          );

          setLoading(false);

          return;
        }

        if (
          !tokenData.active
        ) {
          alert(
            "Inactive token"
          );

          setLoading(false);

          return;
        }

        const ownerId =
          crypto.randomUUID();

        const docRef =
          await addDoc(
            collection(
              db,
              "events"
            ),
            {
              token,
              ownerId,
              eventName,
              coupleNames,
              eventDate,
              venue,
              createdAt:
                new Date(),
            }
          );

        await updateDoc(
          tokenRef,
          {
            used: true,
          }
        );

        const generatedLink = `http://localhost:5173/event/${docRef.id}`;

        const generatedOwnerLink = `http://localhost:5173/owner/${ownerId}`;

        setEventLink(
          generatedLink
        );

        setOwnerLink(
          generatedOwnerLink
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

  const handleCopy = (
    value
  ) => {
    navigator.clipboard.writeText(
      value
    );

    alert("Copied");
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

  const handlePdfDownload =
    () => {
      generateMemoryPdf({
        coupleNames,
        eventDate,
        guestLink:
          eventLink,
        ownerLink,
      });
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
            maxWidth: "900px",
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
            Your WALNORY
            Experience Is Ready
          </h1>

          <p
            style={{
              opacity: 0.7,
              lineHeight: "1.8",
              marginBottom: "40px",
            }}
          >
            Please save your
            private owner link
            securely. This link
            gives access to all
            uploaded guest photos,
            videos, and messages
            after your event.
          </p>

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
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                opacity: 0.5,
                marginBottom: "10px",
              }}
            >
              GUEST EVENT LINK
            </div>

            <div
              style={{
                background:
                  "#f8f5f0",
                padding: "18px",
                borderRadius:
                  "18px",
                wordBreak:
                  "break-all",
              }}
            >
              {eventLink}
            </div>
          </div>

          <div
            style={{
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                opacity: 0.5,
                marginBottom: "10px",
              }}
            >
              PRIVATE OWNER LINK
            </div>

            <div
              style={{
                background:
                  "#f8f5f0",
                padding: "18px",
                borderRadius:
                  "18px",
                wordBreak:
                  "break-all",
              }}
            >
              {ownerLink}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent:
                "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                handleCopy(
                  eventLink
                )
              }
              style={buttonStyle}
            >
              COPY EVENT LINK
            </button>

            <button
              onClick={() =>
                handleCopy(
                  ownerLink
                )
              }
              style={buttonStyle}
            >
              COPY OWNER LINK
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
                handlePdfDownload
              }
              style={buttonStyle}
            >
              DOWNLOAD PDF
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
            placeholder="Activation Token"
            value={token}
            onChange={(e) =>
              setToken(
                e.target.value
              )
            }
            style={inputStyle}
          />

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