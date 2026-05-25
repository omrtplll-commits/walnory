import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function OwnerGallery() {
  const { ownerId } = useParams();
  const [memories, setMemories] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

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

  // Mesajı .txt olarak indir
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

  // Fotoğraf veya videoyu indir (blob yöntemi - CORS bypass)
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8f5f0, #efe7dc)",
      padding: "24px 16px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            letterSpacing: "4px",
            fontSize: "11px",
            opacity: 0.45,
            marginBottom: "10px",
            textTransform: "uppercase",
          }}>
            Private Owner Gallery
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 42px)",
            marginBottom: "12px",
            color: "#2d2926",
            fontWeight: 400,
          }}>
            Your Wedding Memories
          </h1>
          <p style={{ color: "#6d645c", fontSize: "15px" }}>
            All guest photos, videos and messages — private to you.
          </p>
        </div>

        {/* Bellek Kartları */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {memories.length === 0 && (
            <div style={{ textAlign: "center", color: "#9d948c", fontSize: "15px", padding: "60px 0" }}>
              No memories uploaded yet.
            </div>
          )}

          {memories.map((memory) => (
            <div key={memory.id} style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              {/* Üst satır: isim + mesaj */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  opacity: 0.4,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}>
                  Guest
                </div>
                <div style={{ fontSize: "22px", fontWeight: 500, color: "#2d2926", marginBottom: "8px" }}>
                  {memory.guestName}
                </div>
                {memory.message && (
                  <p style={{ fontSize: "15px", color: "#4f4740", lineHeight: 1.6, margin: 0 }}>
                    {memory.message}
                  </p>
                )}
              </div>

              {/* Thumbnail'lar */}
              {memory.files && memory.files.length > 0 && (
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}>
                  {memory.files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedMedia(file)}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        cursor: "pointer",
                        background: "#ece7df",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <>
                          <video
                            muted
                            playsInline
                            preload="metadata"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          >
                            <source src={file.url + "#t=0.5"} />
                          </video>
                          <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(0,0,0,0.2)",
                          }}>
                            <div style={{
                              width: 0, height: 0,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderLeft: "14px solid rgba(255,255,255,0.9)",
                              marginLeft: "3px",
                            }} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Download butonları */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {memory.message && (
                  <button
                    onClick={() => downloadMessage(memory)}
                    style={{
                      background: "transparent",
                      color: "#2d2926",
                      border: "1.5px solid #2d2926",
                      borderRadius: "10px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    DOWNLOAD MESSAGE
                  </button>
                )}

                {memory.files?.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => downloadFile(file.url, file.type)}
                    style={{
                      background: "#2d2926",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    {file.type === "image" ? "📷" : "🎥"} DOWNLOAD {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999, padding: "20px",
          }}
        >
          <div style={{
            position: "absolute", top: "20px", right: "24px",
            color: "white", fontSize: "28px", cursor: "pointer", opacity: 0.7,
          }}>✕</div>

          {selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.url}
              alt=""
              style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "16px" }}
            />
          ) : (
            <video
              controls
              autoPlay
              style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "16px" }}
            >
              <source src={selectedMedia.url} />
            </video>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); downloadFile(selectedMedia.url, selectedMedia.type); }}
            style={{
              position: "absolute", bottom: "24px",
              background: "white", color: "#2d2926",
              border: "none", borderRadius: "12px",
              padding: "12px 28px", fontSize: "13px",
              letterSpacing: "1px", cursor: "pointer",
            }}
          >
            DOWNLOAD THIS FILE
          </button>
        </div>
      )}
    </div>
  );
}

export default OwnerGallery;