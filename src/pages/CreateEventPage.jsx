import { useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { getTranslation } from "../translations";

const t = getTranslation();

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
  const [packageType, setPackageType] = useState("");
  const [deleteDate, setDeleteDate] = useState("");

  const handleCreate = async () => {
    if (!email) { alert(t.enterEmail); return; }
    if (!eventDate) { alert(t.enterDate); return; }

    try {
      setLoading(true);

      const tokenRef = doc(db, "tokens", token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) { alert(t.invalidToken); setLoading(false); return; }

      const tokenData = tokenSnap.data();
      if (tokenData.used) { alert(t.tokenUsed); setLoading(false); return; }
      if (!tokenData.active) { alert(t.inactiveToken); setLoading(false); return; }

      const pkg = tokenData.package || "basic";
      const days = pkg === "premium" ? 40 : 20;
      const eventDateObj = new Date(eventDate);
      const deleteDateObj = new Date(eventDateObj);
      deleteDateObj.setDate(deleteDateObj.getDate() + days);
      const deleteDateStr = deleteDateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      const ownerId = crypto.randomUUID();

      const docRef = await addDoc(collection(db, "events"), {
        token, ownerId, eventName, coupleNames, eventDate, venue, email,
        package: pkg, deleteAt: deleteDateObj, createdAt: new Date(),
      });

      await updateDoc(tokenRef, { used: true, usedAt: new Date(), usedBy: email });

      const generatedLink = `${SITE_URL}/event/${docRef.id}`;
      const generatedOwnerLink = `${SITE_URL}/owner/${ownerId}`;

      setEventLink(generatedLink);
      setOwnerLink(generatedOwnerLink);
      setPackageType(pkg);
      setDeleteDate(deleteDateStr);

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_name: coupleNames || eventName,
        email: email,
        owner_link: generatedOwnerLink,
        event_link: generatedLink,
        event_name: eventName,
      }, EMAILJS_PUBLIC_KEY);

      setCreated(true);

    } catch (error) {
      console.error(error);
      alert(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    alert(t.copied);
  };

  const handleDownload = () => {
    const canvas = document.getElementById("walnoryQR");
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "walnory-qr.png";
    link.click();
  };

  if (created) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "60px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", borderRadius: "32px", padding: "50px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", textAlign: "center" }}>

          <div style={{ letterSpacing: "4px", fontSize: "13px", opacity: 0.5, marginBottom: "18px" }}>{t.eventReady}</div>

          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", marginBottom: "18px", color: "#2d2926" }}>
            {t.eventReadyTitle}
          </h1>

          <p style={{ opacity: 0.7, lineHeight: "1.8", marginBottom: "8px" }}>
            {t.eventReadyDesc} <strong>{email}</strong>
          </p>

          <div style={{ background: packageType === "premium" ? "#f0ede8" : "#fff8f0", border: `1px solid ${packageType === "premium" ? "#c4b8a8" : "#f0c080"}`, borderRadius: "14px", padding: "16px 24px", margin: "24px 0", fontSize: "13px", color: "#4f4740", lineHeight: 1.7 }}>
            <strong>{packageType === "premium" ? t.premiumPackage : t.basicPackage}</strong><br />
            {t.availableDays} <strong>{packageType === "premium" ? "40" : "20"}</strong> {t.daysAfter}<br />
            <span style={{ color: "#c0392b", fontWeight: 600 }}>{t.deletionDate} {deleteDate}</span><br />
            <span style={{ opacity: 0.7, fontSize: "12px" }}>{t.downloadWarning}</span>
          </div>

          <div style={{ background: "white", padding: "24px", borderRadius: "24px", width: "fit-content", margin: "0 auto 30px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <QRCodeCanvas id="walnoryQR" value={eventLink} size={220} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>{t.guestEventLink}</div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>{eventLink}</div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>{t.privateOwnerLink}</div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>{ownerLink}</div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => handleCopy(eventLink)} style={buttonStyle}>{t.copyEventLink}</button>
            <button onClick={() => handleCopy(ownerLink)} style={buttonStyle}>{t.copyOwnerLink}</button>
            <button onClick={handleDownload} style={buttonStyle}>{t.downloadQR}</button>
            <button onClick={() => navigate(`/owner/${ownerLink.split("/owner/")[1]}`)} style={buttonStyle}>{t.openGallery}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "60px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "white", borderRadius: "32px", padding: "50px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}>

        <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>{t.createEvent}</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", marginBottom: "8px", color: "#2d2926", fontWeight: 700 }}>
          {t.createYourEvent}
        </h1>
        <p style={{ fontSize: "14px", opacity: 0.5, marginBottom: "36px", lineHeight: 1.6 }}>
          {t.createEventDesc}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input placeholder={t.yourEmail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input placeholder={t.activationToken} value={token} onChange={(e) => setToken(e.target.value)} style={inputStyle} />
          <input placeholder={t.eventName} value={eventName} onChange={(e) => setEventName(e.target.value)} style={inputStyle} />
          <input placeholder={t.coupleNames} value={coupleNames} onChange={(e) => setCoupleNames(e.target.value)} style={inputStyle} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
          <input placeholder={t.venueLocation} value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle} />

          <button onClick={handleCreate} disabled={loading} style={{ padding: "20px", borderRadius: "18px", border: "none", background: "#2d2926", color: "white", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "1px" }}>
            {loading ? t.creating : t.createEvent}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "18px", borderRadius: "18px",
  border: "1px solid #e8e0d8", fontSize: "16px",
  boxSizing: "border-box", outline: "none",
};

const buttonStyle = {
  padding: "14px 24px", borderRadius: "14px", border: "none",
  background: "#2d2926", color: "white", cursor: "pointer",
  fontSize: "13px", letterSpacing: "1px",
};

export default CreateEventPage;