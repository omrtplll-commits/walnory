import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

function OwnerGallery() {
  const { token } = useParams();

  const [messages, setMessages] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState("");

  useEffect(() => {
    const q = query(
      collection(
        db,
        "events",
        token,
        "messages"
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setMessages(items);
      });

    return () => unsubscribe();
  }, []);

  const downloadImage = (url) => {
    const link =
      document.createElement("a");

    link.href = url;

    link.download = "walnory-photo";

    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f1eb",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "42px",
        }}
      >
        Owner Gallery
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "24px",
        }}
      >
        {messages.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            {item.imageUrl && (
              <>
                <img
                  src={item.imageUrl}
                  alt=""
                  onClick={() =>
                    setSelectedImage(
                      item.imageUrl
                    )
                  }
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    cursor: "pointer",
                  }}
                />

                <button
                  onClick={() =>
                    downloadImage(
                      item.imageUrl
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "12px",
                    background: "#222",
                    color: "white",
                    marginBottom: "16px",
                    cursor: "pointer",
                  }}
                >
                  DOWNLOAD PHOTO
                </button>
              </>
            )}

            <h3
              style={{
                marginBottom: "10px",
              }}
            >
              {item.name}
            </h3>

            <p
              style={{
                lineHeight: "1.6",
                opacity: 0.8,
              }}
            >
              {item.message}
            </p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          onClick={() =>
            setSelectedImage("")
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            zIndex: 999,
          }}
        >
          <img
            src={selectedImage}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "20px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default OwnerGallery;