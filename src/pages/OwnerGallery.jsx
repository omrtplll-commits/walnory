import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import JSZip from "jszip";

function OwnerGallery() {
  const { ownerId } = useParams();
  const [memories, setMemories] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState("");

  useEffect(() => {
    const eventQuery = query(
      collection(db, "events"),
      where("ownerId", "==", ownerId)
    );
    const unsubscribeEvents = onSnapshot(eventQuery, (eventSnapshot) => {
      if (eventSnapshot.empty) return;
      const eventId = eventSnapshot.docs[0].id;
      const memoriesQuery = query(
        collection(db, "memories"),
        where("eventId", "==", eventId)
      );
      const unsubscribeMemories = onSnapshot(memoriesQuery, (memoriesSnapshot) => {
        const items = memoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMemories(items);
      });
      return () => unsubscribeMemories();
    });
    return () => unsubscribeEvents();
  }, [ownerId]);

  const downloadMessage = (memory) => {
    const text = `Guest: ${memory.guestName}\n\nMessage:\n${memory.message}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${memory.guestName}-message.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadFile = async (fileUrl, fileType) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const extension = fileType === "video" ? "mp4" : "jpg";
      const fileName = `walnory-memory-${Date.now()}.${extension}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const downloadAllAsZip = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();
      let fileCount = 0;
      let total = 0;

      // Toplam dosya sayısını hesapla
      memories.forEach((m) => { total += (m.files?.length || 0); });

      for (const memory of memories) {
        if (!memory.files) continue;

        const guestFolder = zip.folder(memory.guestName || "guest");

        // Mesajı ekle
        if (memory.message) {
          guestFolder.file(
            "message.txt",
            `Guest: ${memory.guestName}\n\nMessage:\n${memory.message}`
          );
        }

        // Dosyaları ekle
        for (let i = 0; i < memory.files.length; i++) {
          const file = memory.files[i];
          fileCount++;
          setZipProgress(`Preparing ${fileCount} of ${total} files...`);

          try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const extension = file.type === "video" ? "mp4" : "jpg";
            const fileName = `${file.type}-${i + 1}.${extension}`;
            guestFolder.file(fileName, blob);
          } catch (err) {
            console.error("File fetch error:", err);
          }
        }
      }

      setZipProgress("Creating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `walnory-memories-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("ZIP failed:", error);
      alert("ZIP download failed. Please try again.");
    } finally {
      setZipping(false);
      setZipProgress("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8f5f0, #efe7dc)",
      padding: "40px 16px",
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ letterSpacing: "5px", fontSize: "10px", opacity: 0.4, marginBottom: "16px", textTransform: "uppercase", fontFamily: "sans-serif" }}>
            Private Owner Gallery
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "14px", color: "#2d2926", fontWeight: 700, lineHeight: 1.2 }}>
            Your Wedding Memories
          </h1>
          <div style={{ width: "40px", height: "1px", background: "#c4b8a8", margin: "0 auto 16px" }} />
          <p style={{ color: "#7d736b", fontSize: "14px", fontFamily: "sans-serif", marginBottom: "24px" }}>
            All guest photos, videos and messages — private to you.
          </p>

          {/* ZIP Download butonu */}
          {memories.length > 0 && (
            <button
              onClick={downloadAllAsZip}
              disabled={zipping}
              style={{
                background: zipping ? "#9d948c" : "#2d2926",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 28px",
                fontSize: "12px",
                letterSpacing: "1.5px",
                cursor: zipping ? "not-allowed" : "pointer",
                fontFamily: "sans-serif",
                textTransform: "uppercase",
              }}
            >
              {zipping ? zipProgress || "PREPARING..." : "⬇ DOWNLOAD ALL AS ZIP"}
            </button>
          )}
        </div>

        {/* Kartlar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {memories.length === 0 && (
            <div style={{ textAlign: "center", color: "#9d948c", fontSize: "14px", padding: "80px 0", fontFamily: "sans-serif" }}>
              No memories uploaded yet.
            </div>
          )}

          {memories.map((memory) => (
            <div key={memory.id} style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
              border: "1px solid rgba(196,184,168,0.25)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start", marginBottom: "20px" }}>

                {/* Sol: isim + mesaj */}
                <div>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: 0.35, marginBottom: "8px", textTransform: "uppercase", fontFamily: "sans-serif" }}>
                    Guest
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#2d2926", marginBottom: "10px", textTransform: "capitalize" }}>
                    {memory.guestName}
                  </div>
                  {memory.message && (
                    <p style={{ fontSize: "14px", color: "#5a5148", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                      "{memory.message}"
                    </p>
                  )}
                </div>

                {/* Sağ: thumbnail'lar */}
                {memory.files && memory.files.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: memory.files.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: "8px" }}>
                    {memory.files.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedMedia(file)}
                        style={{ width: "110px", height: "110px", borderRadius: "14px", overflow: "hidden", cursor: "pointer", background: "#ece7df", position: "relative", flexShrink: 0 }}
                      >
                        {file.type === "image" ? (
                          <img src={file.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <>
                            <video muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                              <source src={file.url + "#t=0.5"} />
                            </video>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
                              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid #2d2926", marginLeft: "3px" }} />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ height: "1px", background: "rgba(196,184,168,0.3)", marginBottom: "18px" }} />

              {/* Download butonları */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {memory.message && (
                  <button onClick={() => downloadMessage(memory)} style={outlineBtn}>
                    ↓ Message
                  </button>
                )}
                {memory.files?.map((file, index) => (
                  <button key={index} onClick={() => downloadFile(file.url, file.type)} style={solidBtn}>
                    ↓ {file.type === "image" ? "Photo" : "Video"}{memory.files.length > 1 ? ` ${index + 1}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div onClick={() => setSelectedMedia(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" }}>
          <div style={{ position: "absolute", top: "24px", right: "28px", color: "white", fontSize: "24px", cursor: "pointer", opacity: 0.6 }}>✕</div>
          {selectedMedia.type === "image" ? (
            <img src={selectedMedia.url} alt="" style={{ maxWidth: "90%", maxHeight: "85%", borderRadius: "16px" }} />
          ) : (
            <video controls autoPlay style={{ maxWidth: "90%", maxHeight: "85%", borderRadius: "16px" }}>
              <source src={selectedMedia.url} />
            </video>
          )}
          <button onClick={(e) => { e.stopPropagation(); downloadFile(selectedMedia.url, selectedMedia.type); }} style={{ position: "absolute", bottom: "28px", background: "white", color: "#2d2926", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontFamily: "sans-serif", textTransform: "uppercase" }}>
            ↓ Download
          </button>
        </div>
      )}
    </div>
  );
}

const outlineBtn = {
  background: "transparent", color: "#5a5148", border: "1px solid #c4b8a8",
  borderRadius: "8px", padding: "8px 16px", fontSize: "11px", letterSpacing: "1.5px",
  cursor: "pointer", fontFamily: "sans-serif", textTransform: "uppercase",
};

const solidBtn = {
  background: "#2d2926", color: "white", border: "none",
  borderRadius: "8px", padding: "8px 16px", fontSize: "11px", letterSpacing: "1.5px",
  cursor: "pointer", fontFamily: "sans-serif", textTransform: "uppercase",
};

export default OwnerGallery;