import { useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const SITE_URL = "https://walnory.com";
const EMAILJS_SERVICE_ID = "service_zlv4rjh";
const EMAILJS_TEMPLATE_ID = "template_gsovbjb";
const EMAILJS_PUBLIC_KEY = "1vTVlmEhBIlqGkfXu";

const EVENT_TYPES = [
  { value: "wedding", label: "💍 Wedding / Engagement" },
  { value: "babyshower_girl", label: "🎀 Baby Shower — Girl" },
  { value: "babyshower_boy", label: "🍼 Baby Shower — Boy" },
  { value: "babyshower_surprise", label: "🌿 Baby Shower — Surprise" },
  { value: "birthday", label: "🎂 Birthday" },
  { value: "corporate", label: "🏢 Corporate Event" },
];

function CreateEventPage() {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState("wedding");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Wedding fields
  const [coupleNames, setCoupleNames] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");

  // Baby Shower fields
  const [babyName, setBabyName] = useState("");
  const [parentNames, setParentNames] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Birthday fields
  const [birthdayName, setBirthdayName] = useState("");
  const [age, setAge] = useState("");

  // Corporate fields
  const [companyName, setCompanyName] = useState("");
  const [corporateEventName, setCorporateEventName] = useState("");

  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventLink, setEventLink] = useState("");
  const [ownerLink, setOwnerLink] = useState("");
  const [packageType, setPackageType] = useState("");
  const [deleteDate, setDeleteDate] = useState("");

  const getEventTitle = () => {
    switch (eventType) {
      case "wedding": return coupleNames;
      case "babyshower_girl":
      case "babyshower_boy":
      case "babyshower_surprise": return babyName ? `Baby ${babyName}` : "Baby Shower";
      case "birthday": return birthdayName;
      case "corporate": return corporateEventName || companyName;
      default: return "";
    }
  };

  const handleCreate = async () => {
    if (!email) { alert("Please enter your email address"); return; }
    if (!token) { alert("Please enter your activation token"); return; }

    try {
      setLoading(true);

      const tokenRef = doc(db, "tokens", token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) { alert("Invalid token"); setLoading(false); return; }
      const tokenData = tokenSnap.data();
      if (tokenData.used) { alert("This token has already been used"); setLoading(false); return; }
      if (!tokenData.active) { alert("Inactive token"); setLoading(false); return; }

      const pkg = tokenData.package || "basic";
      const days = pkg === "premium" ? 40 : 20;
      const eventDateObj = new Date(eventDate || dueDate || new Date());
      const deleteDateObj = new Date(eventDateObj);
      deleteDateObj.setDate(deleteDateObj.getDate() + days);
      const deleteDateStr = deleteDateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      const ownerId = crypto.randomUUID();

      const eventData = {
        token, ownerId, email,
        eventType,
        createdAt: new Date(),
        package: pkg,
        deleteAt: deleteDateObj,
      };

      // Event tipine göre alanları ekle
      if (eventType === "wedding") {
        eventData.coupleNames = coupleNames;
        eventData.eventName = eventName;
        eventData.venue = venue;
        eventData.eventDate = eventDate;
      } else if (eventType.startsWith("babyshower")) {
        eventData.babyName = babyName;
        eventData.parentNames = parentNames;
        eventData.dueDate = dueDate;
        eventData.eventDate = dueDate;
      } else if (eventType === "birthday") {
        eventData.birthdayName = birthdayName;
        eventData.age = age;
        eventData.eventDate = eventDate;
        eventData.eventName = `${birthdayName}'s Birthday`;
      } else if (eventType === "corporate") {
        eventData.companyName = companyName;
        eventData.eventName = corporateEventName;
        eventData.venue = venue;
        eventData.eventDate = eventDate;
      }

      const docRef = await addDoc(collection(db, "events"), eventData);
      await updateDoc(tokenRef, { used: true, usedAt: new Date(), usedBy: email });

      const generatedLink = `${SITE_URL}/event/${docRef.id}`;
      const generatedOwnerLink = `${SITE_URL}/owner/${ownerId}`;

      setEventLink(generatedLink);
      setOwnerLink(generatedOwnerLink);
      setPackageType(pkg);
      setDeleteDate(deleteDateStr);

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_name: getEventTitle() || email,
        email,
        owner_link: generatedOwnerLink,
        event_link: generatedLink,
        event_name: getEventTitle(),
      }, EMAILJS_PUBLIC_KEY);

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
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "walnory-qr.png";
    link.click();
  };

  if (created) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "60px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", borderRadius: "32px", padding: "50px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ letterSpacing: "4px", fontSize: "13px", opacity: 0.5, marginBottom: "18px" }}>EVENT READY</div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", marginBottom: "18px", color: "#2d2926" }}>
            Your WALNORY Experience Is Ready ✨
          </h1>
          <p style={{ opacity: 0.7, lineHeight: "1.8", marginBottom: "8px" }}>
            Your owner link and QR code have been sent to <strong>{email}</strong>
          </p>
          <div style={{ background: packageType === "premium" ? "#f0ede8" : "#fff8f0", border: `1px solid ${packageType === "premium" ? "#c4b8a8" : "#f0c080"}`, borderRadius: "14px", padding: "16px 24px", margin: "24px 0", fontSize: "13px", color: "#4f4740", lineHeight: 1.7 }}>
            <strong>{packageType === "premium" ? "⭐ PREMIUM" : "📦 BASIC"} PACKAGE</strong><br />
            Gallery available for <strong>{packageType === "premium" ? "40" : "20"} days</strong> after your event.<br />
            <span style={{ color: "#c0392b", fontWeight: 600 }}>⚠ Deletion date: {deleteDate}</span><br />
            <span style={{ opacity: 0.7, fontSize: "12px" }}>Please download all memories before this date.</span>
          </div>
          <div style={{ background: "white", padding: "24px", borderRadius: "24px", width: "fit-content", margin: "0 auto 30px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <QRCodeCanvas id="walnoryQR" value={eventLink} size={220} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>GUEST EVENT LINK</div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>{eventLink}</div>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "10px" }}>PRIVATE OWNER LINK</div>
            <div style={{ background: "#f8f5f0", padding: "18px", borderRadius: "18px", wordBreak: "break-all", fontSize: "14px" }}>{ownerLink}</div>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => handleCopy(eventLink)} style={buttonStyle}>COPY EVENT LINK</button>
            <button onClick={() => handleCopy(ownerLink)} style={buttonStyle}>COPY OWNER LINK</button>
            <button onClick={handleDownload} style={buttonStyle}>DOWNLOAD QR</button>
            <button onClick={() => navigate(`/owner/${ownerLink.split("/owner/")[1]}`)} style={buttonStyle}>OPEN GALLERY</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "60px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "white", borderRadius: "32px", padding: "50px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}>

        <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>CREATE EVENT</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", marginBottom: "8px", color: "#2d2926", fontWeight: 700 }}>Create Your Event</h1>
        <p style={{ fontSize: "14px", opacity: 0.5, marginBottom: "36px", lineHeight: 1.6 }}>Your gallery link and QR code will be sent to your email automatically.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Email + Token */}
          <input placeholder="Your Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input placeholder="Activation Token" value={token} onChange={(e) => setToken(e.target.value)} style={inputStyle} />

          {/* Event Type Seçimi */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.4, marginBottom: "12px" }}>EVENT TYPE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEventType(type.value)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: eventType === type.value ? "2px solid #2d2926" : "1.5px solid #e8e0d8",
                    background: eventType === type.value ? "#2d2926" : "white",
                    color: eventType === type.value ? "white" : "#4f4740",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wedding / Engagement */}
          {eventType === "wedding" && (
            <>
              <input placeholder="Couple / Host Names" value={coupleNames} onChange={(e) => setCoupleNames(e.target.value)} style={inputStyle} />
              <input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={inputStyle} />
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
              <input placeholder="Venue Location (optional)" value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle} />
            </>
          )}

          {/* Baby Shower */}
          {eventType.startsWith("babyshower") && (
            <>
              <input placeholder="Baby Name (optional)" value={babyName} onChange={(e) => setBabyName(e.target.value)} style={inputStyle} />
              <input placeholder="Mother & Father Names" value={parentNames} onChange={(e) => setParentNames(e.target.value)} style={inputStyle} />
              <input type="date" placeholder="Due Date / Birth Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
            </>
          )}

          {/* Birthday */}
          {eventType === "birthday" && (
            <>
              <input placeholder="Name" value={birthdayName} onChange={(e) => setBirthdayName(e.target.value)} style={inputStyle} />
              <input placeholder="Age (optional)" type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
            </>
          )}

          {/* Corporate */}
          {eventType === "corporate" && (
            <>
              <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
              <input placeholder="Event Name" value={corporateEventName} onChange={(e) => setCorporateEventName(e.target.value)} style={inputStyle} />
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={inputStyle} />
              <input placeholder="Venue Location (optional)" value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle} />
            </>
          )}

          <button onClick={handleCreate} disabled={loading} style={{ padding: "20px", borderRadius: "18px", border: "none", background: "#2d2926", color: "white", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "1px" }}>
            {loading ? "CREATING..." : "CREATE EVENT"}
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