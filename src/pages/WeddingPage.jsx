import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
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

  const [message, setMessage] =
    useState("");

  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    const docRef = doc(
      db,
      "events",
      token
    );

    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setEventData(snap.data());
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const submitMessage = async () => {
    if (!message || !name) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    if (image) {
      const imageRef = ref(
        storage,
        `eventPhotos/${token}/${Date.now()}`
      );

      await uploadBytes(imageRef, image);

      imageUrl = await getDownloadURL(
        imageRef
      );
    }

    await addDoc(
      collection(
        db,
        "events",
        token,
        "messages"
      ),
      {
        name,
        message,
        imageUrl,
        createdAt: serverTimestamp(),
      }
    );

    setMessage("");
    setName("");
    setImage(null);
    setPreview("");

    setLoading(false);

    alert(
      "Your memory has been added ✨"
    );
  };

  if (!eventData) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #f8f5f0, #efe7dc)",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "white",
          borderRadius: "32px",
          padding: "50px 35px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              letterSpacing: "4px",
              opacity: 0.5,
              marginBottom: "18px",
            }}
          >
            WEDDING MEMORIES
          </div>

          <h1
            style={{
              fontSize: "54px",
              marginBottom: "12px",
              fontWeight: "600",
              color: "#2d2926",
            }}
          >
            {eventData.coupleName}
          </h1>

          <div
            style={{
              width: "80px",
              height: "2px",
              background: "#d8c3a5",
              margin:
                "0 auto 20px auto",
            }}
          />

          <p
            style={{
              opacity: 0.7,
              lineHeight: "1.8",
              fontSize: "16px",
            }}
          >
            {eventData.eventDate}
            <br />
            {eventData.city}
            <br />
            {eventData.venueName}
          </p>
        </div>

        <textarea
          placeholder="Write your beautiful memory..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: "170px",
            padding: "20px",
            borderRadius: "20px",
            border:
              "1px solid #e5ddd2",
            marginBottom: "18px",
            resize: "none",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "#faf8f5",
          }}
        />

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border:
              "1px solid #e5ddd2",
            marginBottom: "18px",
            fontSize: "15px",
            boxSizing: "border-box",
            background: "#faf8f5",
          }}
        />

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <input
            type="file"
            onChange={handleImage}
          />
        </div>

        {preview && (
          <div
            style={{
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <img
              src={preview}
              alt="preview"
              style={{
                width: "180px",
                borderRadius: "20px",
                objectFit: "cover",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.12)",
              }}
            />
          </div>
        )}

        <button
          onClick={submitMessage}
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "18px",
            background:
              "linear-gradient(to right,#2d2926,#4a433d)",
            color: "white",
            fontSize: "16px",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Sending..."
            : "ADD MEMORY"}
        </button>
      </div>
    </div>
  );
}

export default WeddingPage;