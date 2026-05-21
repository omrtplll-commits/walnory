import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

function OwnerGallery() {
  const { ownerId } =
    useParams();

  const [memories, setMemories] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState("");

  useEffect(() => {
    const eventQuery = query(
      collection(db, "events"),
      where(
        "ownerId",
        "==",
        ownerId
      )
    );

    const unsubscribeEvents =
      onSnapshot(
        eventQuery,
        (eventSnapshot) => {
          if (
            eventSnapshot.empty
          ) {
            return;
          }

          const eventId =
            eventSnapshot.docs[0].id;

          const memoriesQuery =
            query(
              collection(
                db,
                "memories"
              ),
              where(
                "eventId",
                "==",
                eventId
              )
            );

          const unsubscribeMemories =
            onSnapshot(
              memoriesQuery,
              (
                memoriesSnapshot
              ) => {
                const items =
                  memoriesSnapshot.docs.map(
                    (doc) => ({
                      id: doc.id,
                      ...doc.data(),
                    })
                  );

                setMemories(
                  items
                );
              }
            );

          return () =>
            unsubscribeMemories();
        }
      );

    return () =>
      unsubscribeEvents();
  }, [ownerId]);

  const downloadFile = (
    url
  ) => {
    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.setAttribute(
      "download",
      "walnory-memory"
    );

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              letterSpacing:
                "4px",
              fontSize: "12px",
              opacity: 0.5,
              marginBottom:
                "14px",
            }}
          >
            PRIVATE OWNER GALLERY
          </div>

          <h1
            style={{
              fontSize: "56px",
              color: "#2d2926",
              marginBottom: "18px",
            }}
          >
            Your Wedding Memories
          </h1>

          <p
            style={{
              opacity: 0.7,
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            All uploaded guest
            photos, videos, and
            messages appear here
            privately for the
            event owner.
          </p>
        </div>

        {memories.length ===
        0 ? (
          <div
            style={{
              background:
                "white",
              borderRadius:
                "30px",
              padding: "60px",
              textAlign:
                "center",
            }}
          >
            No memories uploaded
            yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: "20px",
            }}
          >
            {memories.map(
              (item) => (
                <div
                  key={item.id}
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "24px",
                    overflow:
                      "hidden",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.06)",
                  }}
                >
                  {item.fileUrl &&
                    item.fileType ===
                      "image" && (
                      <div
                        style={{
                          height:
                            "220px",
                          background:
                            "#f3f3f3",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          padding:
                            "12px",
                        }}
                      >
                        <img
                          src={
                            item.fileUrl
                          }
                          alt=""
                          onClick={() =>
                            setSelectedImage(
                              item.fileUrl
                            )
                          }
                          style={{
                            maxWidth:
                              "100%",
                            maxHeight:
                              "100%",
                            objectFit:
                              "contain",
                            cursor:
                              "pointer",
                            borderRadius:
                              "14px",
                          }}
                        />
                      </div>
                    )}

                  {item.fileUrl &&
                    item.fileType ===
                      "video" && (
                      <video
                        controls
                        style={{
                          width:
                            "100%",
                          height:
                            "220px",
                          objectFit:
                            "cover",
                          background:
                            "#000",
                        }}
                      >
                        <source
                          src={
                            item.fileUrl
                          }
                        />
                      </video>
                    )}

                  <div
                    style={{
                      padding:
                        "18px",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "12px",
                        opacity:
                          0.45,
                        marginBottom:
                          "8px",
                        letterSpacing:
                          "2px",
                      }}
                    >
                      GUEST
                    </div>

                    <h3
                      style={{
                        fontSize:
                          "24px",
                        marginBottom:
                          "14px",
                        color:
                          "#2d2926",
                      }}
                    >
                      {
                        item.guestName
                      }
                    </h3>

                    <p
                      style={{
                        lineHeight:
                          "1.8",
                        opacity:
                          0.72,
                        marginBottom:
                          "18px",
                        fontSize:
                          "15px",
                      }}
                    >
                      {
                        item.message
                      }
                    </p>

                    {item.fileUrl && (
                      <button
                        onClick={() =>
                          downloadFile(
                            item.fileUrl
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        OPEN FULL SIZE
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          onClick={() =>
            setSelectedImage("")
          }
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            padding: "30px",
            zIndex: 999,
          }}
        >
          <img
            src={selectedImage}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight:
                "90%",
              borderRadius:
                "20px",
            }}
          />
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#2d2926",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

export default OwnerGallery;