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

  const [selectedMedia, setSelectedMedia] =
    useState(null);

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

  const downloadMessage =
    (memory) => {

      const text =
        `Guest: ${memory.guestName}

Message:
${memory.message}`;

      const blob =
        new Blob([text], {
          type: "text/plain",
        });

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `${memory.guestName}-message.txt`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      URL.revokeObjectURL(
        url
      );
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        padding: "24px 14px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
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
              letterSpacing:
                "4px",
              fontSize: "12px",
              opacity: 0.5,
              marginBottom:
                "12px",
            }}
          >
            PRIVATE OWNER GALLERY
          </div>

          <h1
            style={{
              fontSize:
                "clamp(36px,8vw,68px)",
              marginBottom:
                "18px",
              color: "#2d2926",
            }}
          >
            Your Wedding Memories
          </h1>

          <p
            style={{
              color: "#6d645c",
              fontSize: "18px",
            }}
          >
            All uploaded guest photos,
            videos, and messages appear
            here privately for the event owner.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "18px",
          }}
        >
          {memories.map(
            (memory) => (
              <div
                key={memory.id}
                style={{
                  background:
                    "rgba(255,255,255,0.75)",
                  backdropFilter:
                    "blur(10px)",
                  borderRadius:
                    "28px",
                  padding: "24px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 340px",
                  gap: "20px",
                  alignItems:
                    "center",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize:
                        "12px",
                      letterSpacing:
                        "4px",
                      opacity: 0.5,
                      marginBottom:
                        "14px",
                    }}
                  >
                    GUEST
                  </div>

                  <h2
                    style={{
                      fontSize:
                        "52px",
                      margin:
                        "0 0 18px 0",
                      color:
                        "#2d2926",
                    }}
                  >
                    {
                      memory.guestName
                    }
                  </h2>

                  <p
                    style={{
                      fontSize:
                        "20px",
                      color:
                        "#4f4740",
                      lineHeight:
                        1.6,
                      marginBottom:
                        "22px",
                    }}
                  >
                    {
                      memory.message
                    }
                  </p>

                  <button
                    onClick={() =>
                      downloadMessage(
                        memory
                      )
                    }
                    style={{
                      background:
                        "#2d2926",
                      color:
                        "white",
                      border:
                        "none",
                      borderRadius:
                        "16px",
                      padding:
                        "14px 24px",
                      fontSize:
                        "15px",
                      cursor:
                        "pointer",
                    }}
                  >
                    DOWNLOAD MESSAGE
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3,1fr)",
                    gap: "10px",
                    justifyItems:
                      "end",
                  }}
                >
                  {memory.files?.map(
                    (
                      file,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        onClick={() =>
                          setSelectedMedia(
                            file
                          )
                        }
                        style={{
                          width:
                            "96px",
                          height:
                            "96px",
                          borderRadius:
                            "18px",
                          overflow:
                            "hidden",
                          cursor:
                            "pointer",
                          background:
                            "#ece7df",
                        }}
                      >
                        {file.type ===
                        "image" ? (
                          <img
                            src={
                              file.url
                            }
                            alt=""
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                              display:
                                "block",
                            }}
                          />
                        ) : (
                          <video
                            muted
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                              display:
                                "block",
                            }}
                          >
                            <source
                              src={
                                file.url
                              }
                            />
                          </video>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {selectedMedia && (
        <div
          onClick={() =>
            setSelectedMedia(
              null
            )
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 999,
            padding: "20px",
          }}
        >
          {selectedMedia.type ===
          "image" ? (
            <img
              src={
                selectedMedia.url
              }
              alt=""
              style={{
                maxWidth: "90%",
                maxHeight:
                  "90%",
                borderRadius:
                  "20px",
              }}
            />
          ) : (
            <video
              controls
              autoPlay
              style={{
                maxWidth: "90%",
                maxHeight:
                  "90%",
                borderRadius:
                  "20px",
              }}
            >
              <source
                src={
                  selectedMedia.url
                }
              />
            </video>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerGallery;