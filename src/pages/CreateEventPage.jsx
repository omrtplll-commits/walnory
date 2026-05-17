import { useState } from "react";

import { QRCodeCanvas } from "qrcode.react";

function CreateEventPage() {
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

  const eventLink =
    "https://walnory.vercel.app/event/demo";

  const handleCreate = () => {
    setCreated(true);
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

          <p
            style={{
              opacity: 0.7,
              lineHeight: "1.8",
              marginBottom: "40px",
            }}
          >
            Share your QR code with
            guests and start
            collecting beautiful
            memories instantly.
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
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: "24px",
              marginTop: "30px",
            }}
          >
            <div style={infoCard}>
              <h3 style={infoTitle}>
                Table QR Cards
              </h3>

              <p style={infoText}>
                Print small QR cards
                and place them on
                guest tables for easy
                photo and message
                sharing during your
                event.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoTitle}>
                Welcome Sign
              </h3>

              <p style={infoText}>
                Display your QR code
                on a large welcome
                sign at the entrance
                so guests can quickly
                access your gallery.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoTitle}>
                Luxury Print Options
              </h3>

              <p style={infoText}>
                You can print your QR
                designs locally,
                create DIY table
                cards, or order
                premium acrylic
                welcome signs and
                plexi table displays
                directly from our
                Etsy store.
              </p>
            </div>
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
        <div
          style={{
            letterSpacing: "4px",
            fontSize: "13px",
            opacity: 0.5,
            marginBottom: "18px",
          }}
        >
          CREATE EVENT
        </div>

        <h1
          style={{
            fontSize: "52px",
            marginBottom: "16px",
            color: "#2d2926",
          }}
        >
          Create Your Event
        </h1>

        <p
          style={{
            opacity: 0.7,
            lineHeight: "1.8",
            marginBottom: "40px",
          }}
        >
          Set up your private event
          page and start collecting
          beautiful memories from
          your guests.
        </p>

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
            style={{
              marginTop: "10px",
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
            CREATE EVENT
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

const infoCard = {
  background: "#f8f5f0",
  borderRadius: "24px",
  padding: "30px",
  textAlign: "left",
};

const infoTitle = {
  marginBottom: "16px",
  fontSize: "24px",
};

const infoText = {
  lineHeight: "1.8",
  opacity: 0.75,
};

export default CreateEventPage;