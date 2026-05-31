import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage } from "../firebase";

// Renk temaları
const THEMES = {
  wedding: {
    bg: "linear-gradient(to bottom, #f8f5f0, #efe7dc)",
    card: "white",
    accent: "#2d2926",
    text: "#2d2926",
    sub: "#7d736b",
    dashed: "#d8cec2",
    inputBg: "#f8f5f0",
    btnBg: "#2d2926",
    label: "PRIVATE EVENT",
  },
  babyshower_girl: {
    bg: "linear-gradient(to bottom, #fff0f5, #ffe4ee)",
    card: "white",
    accent: "#c0547a",
    text: "#8b2252",
    sub: "#b07090",
    dashed: "#f0b8cc",
    inputBg: "#fff5f8",
    btnBg: "#c0547a",
    label: "BABY SHOWER 🎀",
  },
  babyshower_boy: {
    bg: "linear-gradient(to bottom, #f0f5ff, #deeaff)",
    card: "white",
    accent: "#3a6fc4",
    text: "#1a3f7a",
    sub: "#5a7ab0",
    dashed: "#a8c0e8",
    inputBg: "#f5f8ff",
    btnBg: "#3a6fc4",
    label: "BABY SHOWER 🍼",
  },
  babyshower_surprise: {
    bg: "linear-gradient(to bottom, #f0fff8, #deffee)",
    card: "white",
    accent: "#3a9c6c",
    text: "#1a5c3c",
    sub: "#5a8c70",
    dashed: "#a8d8bc",
    inputBg: "#f5fff8",
    btnBg: "#3a9c6c",
    label: "BABY SHOWER 🌿",
  },
  birthday: {
    bg: "linear-gradient(to bottom, #f8f0ff, #eedeff)",
    card: "white",
    accent: "#7c4ab0",
    text: "#4a1a7a",
    sub: "#8a6aa0",
    dashed: "#c8a8e8",
    inputBg: "#faf5ff",
    btnBg: "#7c4ab0",
    label: "BIRTHDAY 🎂",
  },
  corporate: {
    bg: "linear-gradient(to bottom, #f0f4f8, #dde4ec)",
    card: "white",
    accent: "#1a3a5c",
    text: "#1a3a5c",
    sub: "#4a6a8a",
    dashed: "#a8b8cc",
    inputBg: "#f5f8fc",
    btnBg: "#1a3a5c",
    label: "CORPORATE EVENT 🏢",
  },
};

const getTheme = (type) => THEMES[type] || THEMES.wedding;

const getWelcomeMessage = (eventData) => {
  const type = eventData?.eventType || "wedding";
  switch (type) {
    case "wedding": return "Share your memories with us";
    case "babyshower_girl":
    case "babyshower_boy":
    case "babyshower_surprise":
      return eventData?.babyName ? `Leave a message for baby ${eventData.babyName}` : "Leave a message for the baby";
    case "birthday":
      return eventData?.birthdayName ? `Wish ${eventData.birthdayName} a happy birthday! 🎉` : "Share your birthday wishes";
    case "corporate":
      return eventData?.eventName ? `Share your moments from ${eventData.eventName}` : "Share your moments";
    default: return "Share your memories with us";
  }
};

const getDisplayName = (eventData) => {
  const type = eventData?.eventType || "wedding";
  switch (type) {
    case "wedding": return eventData?.coupleNames || "";
    case "babyshower_girl":
    case "babyshower_boy":
    case "babyshower_surprise": return eventData?.babyName ? `Baby ${eventData.babyName}` : eventData?.parentNames || "";
    case "birthday": return eventData?.birthdayName || "";
    case "corporate": return eventData?.corporateEventName || eventData?.companyName || "";
    default: return "";
  }
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = (h / w) * MAX; w = MAX; }
          else { w = (w / h) * MAX; h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })), "image/jpeg", 0.75);
      };
    };
  });
};

function EventPage() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`walnory_uploaded_${id}`)) setAlreadyUploaded(true);
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const docSnap = await getDoc(doc(db, "events", id));
      if (docSnap.exists()) setEventData(docSnap.data());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const theme = getTheme(eventData?.eventType);

  const uploadFileWithProgress = (file, path, onProgress) => new Promise((resolve, reject) => {
    const task = uploadBytesResumable(ref(storage, path), file);
    task.on("state_changed", (s) => onProgress(Math.round(s.bytesTransferred / s.totalBytes * 100)),
      reject, async () => resolve(await getDownloadURL(task.snapshot.ref)));
  });

  const handleUpload = async () => {
    if (!guestName || !message) { alert("Please enter your name and message"); return; }
    try {
      setUploading(true);
      const uploadedFiles = [];
      const total = photos.length + (video ? 1 : 0);
      let done = 0;

      for (let i = 0; i < photos.length; i++) {
        setUploadStep(`Uploading photo ${i + 1} of ${photos.length}...`);
        const compressed = await compressImage(photos[i]);
        const url = await uploadFileWithProgress(compressed, `memories/${id}/${Date.now()}-${compressed.name}`,
          (p) => setUploadProgress(Math.round(((done + p / 100) / total) * 100)));
        uploadedFiles.push({ url, type: "image" });
        done++;
        setUploadProgress(Math.round((done / total) * 100));
      }

      if (video) {
        setUploadStep("Uploading video...");
        const url = await uploadFileWithProgress(video, `memories/${id}/${Date.now()}-${video.name}`,
          (p) => setUploadProgress(Math.round(((done + p / 100) / total) * 100)));
        uploadedFiles.push({ url, type: "video" });
        setUploadProgress(100);
      }

      setUploadStep("Saving your memories...");
      await addDoc(collection(db, "memories"), { eventId: id, guestName, message, files: uploadedFiles, createdAt: new Date() });
      localStorage.setItem(`walnory_uploaded_${id}`, "true");
      setUploaded(true);
    } catch (e) {
      console.error(e);
      alert("Upload failed. Please check your connection and try again.");
    } finally { setUploading(false); setUploadProgress(0); setUploadStep(""); }
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f5f0", color: "#9d948c" }}>Loading...</div>;
  if (!eventData) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f5f0", color: "#9d948c" }}>Event not found</div>;

  if (alreadyUploaded) return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "680px", width: "100%", background: theme.card, borderRadius: "26px", padding: "48px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>💝</div>
        <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>WALNORY</div>
        <h2 style={{ fontSize: "26px", color: theme.text, marginBottom: "16px", fontWeight: 500 }}>You've Already Shared Your Memories</h2>
        <p style={{ color: theme.sub, lineHeight: 1.8, fontSize: "15px" }}>Thank you for being part of this special day. 💕</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "16px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "680px", margin: "0 auto", background: theme.card, borderRadius: "26px", padding: "28px 22px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", boxSizing: "border-box" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "12px", color: theme.accent }}>{theme.label}</div>
          <h1 style={{ fontSize: "clamp(26px,8vw,46px)", lineHeight: 1.1, marginBottom: "10px", color: theme.text, wordBreak: "break-word" }}>
            {getDisplayName(eventData)}
          </h1>
          <p style={{ color: theme.sub, fontSize: "15px", fontStyle: "italic" }}>{getWelcomeMessage(eventData)}</p>
          {eventData.venue && <p style={{ opacity: 0.5, fontSize: "13px", marginTop: "4px" }}>{eventData.venue}</p>}
        </div>

        {uploaded ? (
          <div style={{ background: theme.inputBg, padding: "40px 24px", borderRadius: "22px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💝</div>
            <h2 style={{ fontSize: "26px", marginBottom: "14px", color: theme.text, fontWeight: 500 }}>Thank You</h2>
            <p style={{ lineHeight: 1.8, opacity: 0.7, fontSize: "15px", color: theme.text }}>Your memories have been successfully shared.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input placeholder="Your Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ ...inputStyle, borderColor: theme.dashed }} />
            <textarea placeholder="Leave a beautiful message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} style={{ ...inputStyle, resize: "none", borderColor: theme.dashed }} />

            <div style={{ background: theme.inputBg, borderRadius: "18px", padding: "18px", border: `2px dashed ${theme.dashed}` }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "12px", color: theme.text }}>📷 PHOTOS (MAX 4)</div>
              <input type="file" accept="image/*" multiple onChange={(e) => { const f = Array.from(e.target.files); if (f.length > 4) { alert("Max 4 photos"); e.target.value = ""; return; } setPhotos(f); }}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", background: theme.btnBg, color: "white", border: "none", fontSize: "13px", cursor: "pointer", boxSizing: "border-box", marginBottom: photos.length > 0 ? "10px" : "0" }} />
              {photos.map((f, i) => <div key={i} style={{ background: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>📷 {f.name}</div>)}
            </div>

            <div style={{ background: theme.inputBg, borderRadius: "18px", padding: "18px", border: `2px dashed ${theme.dashed}` }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "12px", color: theme.text }}>🎥 SHORT VIDEO (MAX 1 — 15-20 SEC)</div>
              <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files[0]; if (!f) return; if (f.size > 100 * 1024 * 1024) { alert("Video too large. Max 100MB."); e.target.value = ""; return; } setVideo(f); }}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", background: theme.btnBg, color: "white", border: "none", fontSize: "13px", cursor: "pointer", boxSizing: "border-box", marginBottom: video ? "10px" : "0" }} />
              {video && <div style={{ background: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎥 {video.name} — {(video.size / (1024 * 1024)).toFixed(1)} MB</div>}
            </div>

            <button onClick={handleUpload} disabled={uploading} style={{ padding: "18px", borderRadius: "18px", border: "none", background: theme.btnBg, color: "white", fontSize: "14px", letterSpacing: "1px", cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.8 : 1, width: "100%" }}>
              {uploading ? uploadStep || "UPLOADING..." : "UPLOAD MEMORIES"}
            </button>

            {uploading && (
              <div style={{ marginTop: "-8px" }}>
                <div style={{ background: theme.inputBg, borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: theme.btnBg, borderRadius: "10px", width: `${uploadProgress}%`, transition: "width 0.3s ease" }} />
                </div>
                <div style={{ textAlign: "center", fontSize: "12px", color: theme.sub, marginTop: "6px" }}>
                  {uploadProgress}% — Please wait, do not close this page...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "15px", borderRadius: "15px",
  border: "1px solid #e8e0d8", fontSize: "15px",
  boxSizing: "border-box", background: "#fff", outline: "none",
};

export default EventPage;