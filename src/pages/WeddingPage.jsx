import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "../firebase";

function WeddingPage() {
  const { token } = useParams();

  const [eventData, setEventData] =
    useState(null);

  const [name, setName] = useState("");

  const [message, setMessage] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const messagesRef = collection(
    db,
    "events",
    token,
    "messages"
  );

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    const docRef = doc(db, "events", token);

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      setEventData(snapshot.data());
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    setSelectedImage(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // FOTO YÜKLE
      if (selectedFile) {
        const imageRef = ref(
          storage,
          `eventPhotos/${Date.now()}-${selectedFile.name}`
        );

        const uploadResult =
          await uploadBytes(
            imageRef,
            selectedFile
          );

        imageUrl =
          await getDownloadURL(
            uploadResult.ref
          );

        console.log(
          "IMAGE URL:",
          imageUrl
        );
      }

      // FIRESTORE KAYIT
      await addDoc(messagesRef, {
        name,
        message,
        imageUrl,
        createdAt: Date.now(),
      });

      alert("Your message has been delivered ✨");

      setName("");
      setMessage("");
      setSelectedFile(null);
      setSelectedImage(null);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #f8f5f0, #efe7dc)",
        padding: "24px 16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {success && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            right: "20px",
            background: "#2f2a24",
            color: "white",
            padding: "16px",
            borderRadius: "14px",
            textAlign: "center",
            zIndex: 999,
          }}
        >
          Your message has been delivered ✨
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <p
            style={{
              letterSpacing: "4px",
              color: "#9f8b73",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            WALNORY
          </p>

          <h1
            style={{
              fontFamily:
                "Cormorant Garamond, serif",
              fontSize: "clamp(42px, 8vw, 64px)",
              color: "#2f2a24",
            }}
          >
            {eventData?.coupleName}
          </h1>

          <p>{eventData?.location}</p>

          <p>{eventData?.eventDate}</p>
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            padding: "22px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              rows={5}
              style={{
                ...inputStyle,
                resize: "none",
              }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {selectedImage && (
              <img
                src={selectedImage}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "18px",
                  maxHeight: "320px",
                  objectFit: "cover",
                }}
              />
            )}

            <button
              type="submit"
              style={{
                background: "#2f2a24",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "14px",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  background: "rgba(255,255,255,0.8)",
  boxSizing: "border-box",
};

export default WeddingPage;