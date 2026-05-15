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

  const [name, setName] = useState("");

  const [image, setImage] =
    useState(null);

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

    setLoading(false);

    alert("MESSAGE SENT 🎉");
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
        background: "#f5f1eb",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          {eventData.coupleName}
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.7,
            marginBottom: "40px",
          }}
        >
          {eventData.eventDate}
          <br />
          {eventData.city}
          <br />
          {eventData.venueName}
        </p>

        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: "140px",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            marginBottom: "16px",
            resize: "none",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
          style={{
            marginBottom: "20px",
          }}
        />

        <button
          onClick={submitMessage}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background: "black",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Sending..."
            : "SEND MESSAGE"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "16px",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default WeddingPage;