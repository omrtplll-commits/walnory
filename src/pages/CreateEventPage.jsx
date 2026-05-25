import { useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const SITE_URL = "https://walnory.vercel.app";
const EMAILJS_SERVICE_ID = "service_zlv4rjh";
const EMAILJS_TEMPLATE_ID = "template_gsovbjb";
const EMAILJS_PUBLIC_KEY = "1vTVlmEhBIlqGkfXu";

function CreateEventPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [eventName, setEventName] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventLink, setEventLink] = useState("");
  const [ownerLink, setOwnerLink] = useState("");

  const handleCreate = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const tokenRef = doc(db, "tokens", token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) {
        alert("Invalid token");
        setLoading(false);
        return;
      }

      const tokenData = tokenSnap.data();

      if (tokenData.used) {
        alert("This token has already been used");
        setLoading(false);
        return;
      }

      if (!tokenData.active) {
        alert("Inactive token");
        setLoading(false);
        return;
      }

      const ownerId = crypto.randomUUID();

      const docRef = await addDoc(collection(db, "events"), {
        token,
        ownerId,
        eventName,
        coupleNames,
        eventDate,
        venue,
        email,
        createdAt: new Date(),
      });

      await updateDoc(tokenRef, { used: true, usedAt: new Date(), usedBy: email });

      const generatedLink = `${SITE_URL}/event/${docRef.id}`;
      const generatedOwnerLink = `${SITE_URL}/owner/${ownerId}`;

      setEventLink(generatedLink);
      setOwnerLink(generatedOwnerLink);

      // QR kod URL'sini oluştur
      const qrCanvas = document.getElementById("walnoryQR");
      const qrImageUrl = qrCanvas ? qrCanvas.toDataURL("image/png") : "";

      // EmailJS ile mail gönder
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name: coupleNames || eventName,
          email: email,
          owner_link: generatedOwnerLink,
          event_link: generatedLink,
          event_name: eventName,
          qr_code_url: qrImageUrl,
        },
        EMAILJS_PUBLIC_KEY
      );

      setCreated(true);

    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    alert("Copied!");
  };

  const handleDownload = () => {
    const canvas = document.getElementById("walnoryQR");
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "walnory-qr.png";
    downloadLink.click();
  };

  if (created) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "60px 20px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "32px",
          padding: "50px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}>
          <div style={{ letterSpacing: "4px", fontSize: "13px", opacity: 0.5, marginBottom: "18px" }}>
            EVENT READY
          </div>

          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", marginBottom: "18px", color: "#2d2926" }}>
            Your WALNORY Experience Is Ready ✨
          </h1>

          <p style={{ opacity: 0.7, lineHeight: "1.8", marginBottom: "16px" }}>
            Your owner link and QR code have been sent to <strong>{email}</strong>
          </p>

          <p style={{ opacity: 0.6, fontSize: "14px", lineHeight: "1.8", marginBottom: "40px" }}>
            Please also save your private owner link below. This link gives access to all uploaded guest memories.
          </p>

          {/* QR hidden for download, visible below */}
          <div style={{ display: "none" }}>
            <QRCodeCanvas id="walnoryQR" value={eventLink} size={220} />
          </div>

          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "24px",
            width: "fit-content",
            margin: "0 auto 30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}>
            <QRCodeCanvas value={eventLink} size={220} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>
              GUEST EVENT LINK
            </div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>
              {eventLink}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>
              PRIVATE OWNER LINK
            </div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>
              {ownerLink}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => handleCopy(eventLink)} style={buttonStyle}>COPY EVENT LINK</button>
            <button onClick={() => handleCopy(ownerLink)} style={buttonStyle}>COPY OWNER LINK</button>
            <button onClick={handleDownload} style={buttonStyle}>DOWNLOAD QR</button>
            <button onClick={() => navigate(`/owner/${ownerLink.split("/owner/")[1]}`)} style={buttonStyle}>
              OPEN GALLERY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
      padding: "60px 20px",
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "white",
        borderRadius: "32px",
        padding: "50px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
      }}>
        <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>
          CREATE EVENT
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", marginBottom: "40px", color: "#2d2926", fontWeight: 700 }}>
          Create Your Event
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            placeholder="Activation Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Couple / Host Names"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Venue Location"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Your Email Address (owner link will be sent here)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          {/* QR hidden, used for email */}
          <div style={{ display: "none" }}>
            <QRCodeCanvas id="walnoryQR" value={`${SITE_URL}/event/preview`} size={220} />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "none",
              background: "#2d2926",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              letterSpacing: "1px",
            }}
          >
            {loading ? "CREATING..." : "CREATE EVENT"}
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
  border: "1px solid #e8e0d8",
  fontSize: "16px",
  boxSizing: "border-box",
  outline: "none",
};

const buttonStyle = {
  padding: "14px 24px",
  borderRadius: "14px",
  border: "none",
  background: "#2d2926",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  letterSpacing: "1px",
};

export default CreateEventPage;