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

          await addDoc(
            collection(
              db,
              "memories"
            ),
            {
              eventId: id,
              guestName,
              message,
              fileUrl,
              fileType:
                file.type.startsWith(
                  "video/"
                )
                  ? "video"
                  : "image",
              createdAt:
                new Date(),
            }
          );
        }

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
          padding: "80px",
          textAlign: "center",
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
          padding: "80px",
          textAlign: "center",
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
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
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
          {
            eventData.coupleNames
          }
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginBottom: "12px",
          }}
        >
          {
            eventData.eventName
          }
        </p>

        <p
          style={{
            opacity: 0.7,
            marginBottom: "50px",
          }}
        >
          {
            eventData.venue
          }
        </p>

        {uploaded ? (
          <div
            style={{
              background:
                "#f8f5f0",
              padding: "50px",
              borderRadius:
                "28px",
              textAlign:
                "center",
            }}
          >
            <h2
              style={{
                fontSize: "40px",
                marginBottom:
                  "18px",
                color:
                  "#2d2926",
              }}
            >
              Thank You
            </h2>

            <p
              style={{
                lineHeight:
                  "1.9",
                opacity: 0.7,
                fontSize:
                  "17px",
              }}
            >
              Your memories have
              been successfully
              shared with the
              couple.
              <br />
              Thank you for being
              part of this special
              day.
            </p>
          </div>
        ) : (
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
                resize:
                  "none",
              }}
            />

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={
                handleFileChange
              }
              style={inputStyle}
            />

            <div
              style={{
                background:
                  "#f8f5f0",
                padding:
                  "18px",
                borderRadius:
                  "18px",
                lineHeight:
                  "1.8",
                fontSize:
                  "14px",
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
              • Your memories will
              be shared privately
              with the couple
              <br />
              • Selected files:
              {" "}
              <strong>
                {
                  selectedFiles.length
                }
              </strong>
            </div>

            <button
              onClick={
                handleUpload
              }
              disabled={uploading}
              style={{
                padding: "20px",
                borderRadius:
                  "18px",
                border: "none",
                background:
                  "#2d2926",
                color: "white",
                fontSize:
                  "16px",
                cursor:
                  "pointer",
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
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default EventPage;