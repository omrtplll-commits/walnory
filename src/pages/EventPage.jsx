import { useState } from "react";

function EventPage() {
  const [message, setMessage] =
    useState("");

  const [guestName, setGuestName] =
    useState("");

  const handleUpload = () => {
    alert(
      "Memory uploaded successfully"
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
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
          PRIVATE EVENT
        </div>

        <h1
          style={{
            fontSize: "52px",
            marginBottom: "16px",
            color: "#2d2926",
          }}
        >
          Emily & Daniel
        </h1>

        <p
          style={{
            opacity: 0.7,
            lineHeight: "1.8",
            marginBottom: "50px",
          }}
        >
          Thank you for being part
          of our special day.
          Upload your favorite
          memories and leave a
          heartfelt message for us.
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
            placeholder="Your Name"
            value={guestName}
            onChange={(e) =>
              setGuestName(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <textarea
            placeholder="Leave a beautiful message..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            rows={6}
            style={{
              ...inputStyle,
              resize: "none",
            }}
          />

          <input
            type="file"
            style={inputStyle}
          />

          <button
            onClick={handleUpload}
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
            UPLOAD MEMORY
          </button>
        </div>

        <div
          style={{
            marginTop: "70px",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
              fontSize: "36px",
            }}
          >
            Shared Memories
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            <div style={galleryCard}>
              Guest Photo
            </div>

            <div style={galleryCard}>
              Guest Photo
            </div>

            <div style={galleryCard}>
              Guest Photo
            </div>
          </div>
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

const galleryCard = {
  height: "220px",
  borderRadius: "24px",
  background: "#f3eee7",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
};

export default EventPage;