import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage } from "../firebase";

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
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = (h / w) * MAX; w = MAX; }
          else { w = (w / h) * MAX; h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", 0.75);
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
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);

  useEffect(() => {
    const key = `walnory_uploaded_${id}`;
    if (localStorage.getItem(key)) setAlreadyUploaded(true);
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setEventData(docSnap.data());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Maximum 4 photos allowed");
      e.target.value = "";
      return;
    }
    setPhotos(files);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
  };

  const handleUpload = async () => {
    if (!guestName || !message) {
      alert("Please enter your name and message");
      return;
    }
    if (false) {
      alert("Please select at least one photo or video");
      return;
    }

    try {
      setUploading(true);
      const uploadedFiles = [];

      for (let i = 0; i < photos.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${photos.length}...`);
        const compressed = await compressImage(photos[i]);
        const storageRef = ref(storage, `memories/${id}/${Date.now()}-${compressed.name}`);
        await uploadBytes(storageRef, compressed);
        const url = await getDownloadURL(storageRef);
        uploadedFiles.push({ url, type: "image" });
      }

      if (video) {
        setUploadProgress("Uploading video...");
        const storageRef = ref(storage, `memories/${id}/${Date.now()}-${video.name}`);
        await uploadBytes(storageRef, video);
        const url = await getDownloadURL(storageRef);
        uploadedFiles.push({ url, type: "video" });
      }

      setUploadProgress("Saving your memories...");

      await addDoc(collection(db, "memories"), {
        eventId: id,
        guestName,
        message,
        files: uploadedFiles,
        createdAt: new Date(),
      });

      localStorage.setItem(`walnory_uploaded_${id}`, "true");
      setUploaded(true);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", color: "#9d948c" }}>
        Loading...
      </div>
    );
  }

  if (!eventData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", color: "#9d948c" }}>
        Event not found
      </div>
    );
  }

  if (alreadyUploaded) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "680px", width: "100%", background: "white", borderRadius: "26px", padding: "48px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>💝</div>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>WALNORY</div>
          <h2 style={{ fontSize: "26px", color: "#2d2926", marginBottom: "16px", fontWeight: 500 }}>
            You've Already Shared Your Memories
          </h2>
          <p style={{ color: "#7d736b", lineHeight: 1.8, fontSize: "15px" }}>
            Thank you for being part of this special day. 💕
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "16px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "680px", margin: "0 auto", background: "white", borderRadius: "26px", padding: "28px 22px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", boxSizing: "border-box" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "12px" }}>PRIVATE EVENT</div>
          <h1 style={{ fontSize: "clamp(26px,8vw,46px)", lineHeight: 1.1, marginBottom: "10px", color: "#2d2926", wordBreak: "break-word" }}>
            {eventData.coupleNames}
          </h1>
          <p style={{ opacity: 0.6, fontSize: "14px", marginBottom: "4px" }}>{eventData.eventName}</p>
          <p style={{ opacity: 0.5, fontSize: "13px" }}>{eventData.venue}</p>
        </div>

        {uploaded ? (
          <div style={{ background: "#f8f5f0", padding: "40px 24px", borderRadius: "22px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💝</div>
            <h2 style={{ fontSize: "26px", marginBottom: "14px", color: "#2d2926", fontWeight: 500 }}>Thank You</h2>
            <p style={{ lineHeight: 1.8, opacity: 0.7, fontSize: "15px" }}>
              Your memories have been successfully shared with the couple.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input
              placeholder="Your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={inputStyle}
            />

            <textarea
              placeholder="Leave a beautiful message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />

            {/* Fotoğraf */}
            <div style={{ background: "#f8f5f0", borderRadius: "18px", padding: "18px", border: "2px dashed #d8cec2" }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "12px" }}>
                📷 PHOTOS (MAX 4)
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#2d2926",
                  color: "white",
                  border: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginBottom: photos.length > 0 ? "10px" : "0",
                  boxSizing: "border-box",
                }}
              />
              {photos.length > 0 && photos.map((f, i) => (
                <div key={i} style={{ background: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#4f4740", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>
                  📷 {f.name}
                </div>
              ))}
            </div>

            {/* Video */}
            <div style={{ background: "#f8f5f0", borderRadius: "18px", padding: "18px", border: "2px dashed #d8cec2" }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "12px" }}>
                🎥 SHORT VIDEO (MAX 1 — 15-20 SEC)
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#2d2926",
                  color: "white",
                  border: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginBottom: video ? "10px" : "0",
                  boxSizing: "border-box",
                }}
              />
              {video && (
                <div style={{ background: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#4f4740", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  🎥 {video.name}
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                padding: "18px",
                borderRadius: "18px",
                border: "none",
                background: "#2d2926",
                color: "white",
                fontSize: "14px",
                letterSpacing: "1px",
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.8 : 1,
                width: "100%",
              }}
            >
              {uploading ? uploadProgress || "UPLOADING..." : "UPLOAD MEMORIES"}
            </button>

            {uploading && (
              <div style={{ textAlign: "center", fontSize: "13px", color: "#9d948c", marginTop: "-8px" }}>
                Please wait, do not close this page...
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "15px",
  border: "1px solid #e8e0d8",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#fff",
  outline: "none",
};

export default EventPage;