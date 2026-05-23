import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { useParams } from "react-router-dom";

import {
  db,
  storage,
} from "../firebase";

function EventPage() {
  const { id } = useParams();

  const [eventData, setEventData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [guestName, setGuestName] =
    useState("");

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [uploading, setUploading] =
    useState(false);

  const [uploaded, setUploaded] =
    useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent =
    async () => {
      try {
        const docRef = doc(
          db,
          "events",
          id
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setEventData(
            docSnap.data()
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleFileChange =
    (e) => {
      const files =
        Array.from(
          e.target.files
        );

      const imageFiles =
        files.filter((file) =>
          file.type.startsWith(
            "image/"
          )
        );

      const videoFiles =
        files.filter((file) =>
          file.type.startsWith(
            "video/"
          )
        );

      if (
        imageFiles.length > 5
      ) {
        alert(
          "Maximum 5 photos allowed"
        );

        return;
      }

      if (
        videoFiles.length > 1
      ) {
        alert(
          "Only 1 short video allowed"
        );

        return;
      }

      setSelectedFiles(files);
    };

  const handleUpload =
    async () => {
      if (
        !guestName ||
        !message ||
        selectedFiles.length === 0
      ) {
        alert(
          "Please fill all fields"
        );

        return;
      }

      try {
        setUploading(true);

        const uploadedFiles = [];

        for (const file of selectedFiles) {
          const storageRef =
            ref(
              storage,
              `memories/${id}/${Date.now()}-${
                file.name
              }`
            );

          await uploadBytes(
            storageRef,
            file
          );

          const fileUrl =
            await getDownloadURL(
              storageRef
            );

          uploadedFiles.push({
            url: fileUrl,
            type:
              file.type.startsWith(
                "video/"
              )
                ? "video"
                : "image",
          });
        }

        await addDoc(
          collection(
            db,
            "memories"
          ),
          {
            eventId: id,
            guestName,
            message,
            files:
              uploadedFiles,
            createdAt:
              new Date(),
          }
        );

        setUploaded(true);

        setGuestName("");
        setMessage("");
        setSelectedFiles(
          []
        );
      } catch (error) {
        console.error(error);

        alert(
          "Upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background:
            "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        }}
      >
        Loading event...
      </div>
    );
  }

  if (!eventData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background:
            "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        }}
      >
        Event not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "16px",
        overflowX: "hidden",
        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
          background: "white",
          borderRadius: "26px",
          padding: "22px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",
          boxSizing:
            "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              letterSpacing: "4px",
              fontSize: "11px",
              opacity: 0.5,
              marginBottom: "12px",
            }}
          >
            PRIVATE EVENT
          </div>

          <h1
            style={{
              fontSize:
                "clamp(32px,8vw,54px)",
              lineHeight: "1.08",
              marginBottom: "12px",
              color: "#2d2926",
              wordBreak:
                "break-word",
            }}
          >
            {
              eventData.coupleNames
            }
          </h1>

          <p
            style={{
              opacity: 0.7,
              marginBottom: "5px",
              fontSize:
                "15px",
              wordBreak:
                "break-word",
            }}
          >
            {
              eventData.eventName
            }
          </p>

          <p
            style={{
              opacity: 0.6,
              fontSize:
                "14px",
              wordBreak:
                "break-word",
            }}
          >
            {
              eventData.venue
            }
          </p>
        </div>

        {uploaded ? (
          <div
            style={{
              background:
                "#f8f5f0",
              padding: "30px 20px",
              borderRadius:
                "22px",
              textAlign:
                "center",
            }}
          >
            <h2
              style={{
                fontSize:
                  "36px",
                marginBottom:
                  "16px",
                color:
                  "#2d2926",
              }}
            >
              Thank You
            </h2>

            <p
              style={{
                lineHeight:
                  "1.8",
                opacity: 0.72,
                fontSize:
                  "15px",
              }}
            >
              Your memories have
              been successfully
              shared with the
              couple.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "14px",
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
              rows={4}
              style={{
                ...inputStyle,
                resize:
                  "none",
              }}
            />

            <div
              style={{
                background:
                  "#f8f5f0",
                borderRadius:
                  "20px",
                padding: "18px",
                border:
                  "2px dashed #d8cec2",
                overflow:
                  "hidden",
              }}
            >
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={
                  handleFileChange
                }
                style={{
                  width: "100%",
                  marginBottom:
                    "14px",
                }}
              />

              <div
                style={{
                  lineHeight:
                    "1.8",
                  fontSize:
                    "13px",
                  color:
                    "#5c544d",
                }}
              >
                • Upload up to 5
                photos
                <br />
                • 1 short video
                allowed
                <br />
                • Recommended video
                length: 15-20 seconds
                <br />
                • Shared privately
                with the couple
              </div>

              {selectedFiles.length >
                0 && (
                <div
                  style={{
                    marginTop:
                      "16px",
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "8px",
                  }}
                >
                  {selectedFiles.map(
                    (
                      file,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={{
                          background:
                            "white",
                          padding:
                            "10px",
                          borderRadius:
                            "12px",
                          fontSize:
                            "12px",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          file.name
                        }
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              onClick={
                handleUpload
              }
              disabled={uploading}
              style={{
                padding: "18px",
                borderRadius:
                  "18px",
                border: "none",
                background:
                  "#2d2926",
                color: "white",
                fontSize:
                  "14px",
                letterSpacing:
                  "1px",
                cursor:
                  "pointer",
                width: "100%",
              }}
            >
              {uploading
                ? "UPLOADING..."
                : "UPLOAD MEMORIES"}
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
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#fff",
};

export default EventPage;