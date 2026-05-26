import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage } from "../firebase";

function EventPage() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);

  useEffect(() => {
    // Daha önce bu event'e yükleme yapılmış mı kontrol et
    const key = `walnory_uploaded_${id}`;
    if (localStorage.getItem(key)) {
      setAlreadyUploaded(true);
    }
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEventData(docSnap.data());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));

    if (imageFiles.length > 4) {
      alert("Maximum 4 photos allowed");
      e.target.value = "";
      return;
    }

    if (videoFiles.length > 1) {
      alert("Only 1 short video allowed");
      e.target.value = "";
      return;
    }

    if (imageFiles.length + videoFiles.length !== files.length) {
      alert("Only images and videos are allowed");
      e.target.value = "";
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!guestName || !message || selectedFiles.length === 0) {
      alert("Please fill all fields and select at least one file");
      return;
    }

    try {
      setUploading(true);

      const uploadedFiles = [];

      for (const file of selectedFiles) {
        const storageRef = ref(storage, `memories/${id}/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(storageRef);
        uploadedFiles.push({
          url: fileUrl,
          type: file.type.startsWith("video/") ? "video" : "image",
        });
      }

      await addDoc(collection(db, "memories"), {
        eventId: id,
        guestName,
        message,
        files: uploadedFiles,
        createdAt: new Date(),
      });

      // Bu cihazda yükleme yapıldı olarak işaretle
      const key = `walnory_uploaded_${id}`;
      localStorage.setItem(key, "true");

      setUploaded(true);
      setGuestName("");
      setMessage("");
      setSelectedFiles([]);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        fontSize: "15px",
        color: "#9d948c",
      }}>
        Loading...
      </div>
    );
  }

  if (!eventData) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        fontSize: "15px",
        color: "#9d948c",
      }}>
        Event not found
      </div>
    );
  }

  // Daha önce yükleme yapılmışsa
  if (alreadyUploaded) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          maxWidth: "680px",
          width: "100%",
          background: "white",
          borderRadius: "26px",
          padding: "48px 28px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>💝</div>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>
            WALNORY
          </div>
          <h2 style={{ fontSize: "28px", color: "#2d2926", marginBottom: "16px", fontWeight: 500 }}>
            You've Already Shared Your Memories
          </h2>
          <p style={{ color: "#7d736b", lineHeight: 1.8, fontSize: "15px" }}>
            Thank you for being part of this special day. Your photos, video and message have already been shared with the couple. 💕
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
      padding: "16px",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        background: "white",
        borderRadius: "26px",
        padding: "28px 22px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "12px" }}>
            PRIVATE EVENT
          </div>
          <h1 style={{
            fontSize: "clamp(28px,8vw,48px)",
            lineHeight: "1.1",
            marginBottom: "10px",
            color: "#2d2926",
            wordBreak: "break-word",
          }}>
            {eventData.coupleNames}
          </h1>
          <p style={{ opacity: 0.6, fontSize: "14px", marginBottom: "4px" }}>{eventData.eventName}</p>
          <p style={{ opacity: 0.5, fontSize: "13px" }}>{eventData.venue}</p>
        </div>

        {uploaded ? (
          <div style={{
            background: "#f8f5f0",
            padding: "40px 24px",
            borderRadius: "22px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💝</div>
            <h2 style={{ fontSize: "28px", marginBottom: "14px", color: "#2d2926", fontWeight: 500 }}>
              Thank You
            </h2>
            <p style={{ lineHeight: "1.8", opacity: 0.7, fontSize: "15px" }}>
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

            <div style={{
              background: "#f8f5f0",
              borderRadius: "20px",
              padding: "18px",
              border: "2px dashed #d8cec2",
            }}>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                style={{ width: "100%", marginBottom: "14px" }}
              />

              <div style={{ lineHeight: "1.9", fontSize: "13px", color: "#5c544d" }}>
                • Upload up to 4 photos<br />
                • 1 short video allowed (15-20 seconds)<br />
                • Shared privately with the couple
              </div>

              {selectedFiles.length > 0 && (
                <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} style={{
                      background: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#4f4740",
                    }}>
                      {file.type.startsWith("video/") ? "🎥" : "📷"} {file.name}
                    </div>
                  ))}
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
                opacity: uploading ? 0.7 : 1,
                width: "100%",
              }}
            >
              {uploading ? "UPLOADING..." : "UPLOAD MEMORIES"}
            </button>
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