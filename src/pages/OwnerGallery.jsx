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

  const downloadFile =
    async (
      url,
      fileName
    ) => {
      try {
        const response =
          await fetch(url, {
            mode: "cors",
          });

        const blob =
          await response.blob();

        const blobUrl =
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href =
          blobUrl;

        a.download =
          fileName;

        document.body.appendChild(
          a
        );

        a.click();

        document.body.removeChild(
          a
        );

        URL.revokeObjectURL(
          blobUrl
        );
      } catch (error) {
        console.error(error);

        alert(
          "Download failed"
        );
      }
    };

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

      link.download = `${memory.guestName}-message.txt`;

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
            Your Wedding
            Memories
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
                    "white",
                  borderRadius:
                    "24px",
                  padding: "22px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 320px",
                  gap: "24px",
                  alignItems:
                    "start",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize:
                        "11px",
                      letterSpacing:
                        "2px",
                      opacity: 0.45,
                      marginBottom:
                        "10px",
                    }}
                  >
                    GUEST
                  </div>

                  <h2
                    style={{
                      fontSize:
                        "34px",
                      color:
                        "#2d2926",
                      marginBottom:
                        "14px",
                    }}
                  >
                    {
                      memory.guestName
                    }
                  </h2>

                  <p
                    style={{
                      lineHeight:
                        "1.8",
                      opacity: 0.75,
                      marginBottom:
                        "20px",
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
                      border:
                        "none",
                      background:
                        "#2d2926",
                      color:
                        "white",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "14px",
                      cursor:
                        "pointer",
                      fontSize:
                        "12px",
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
                      >
                        <div
                          onClick={() =>
                            setSelectedMedia(
                              file
                            )
                          }
                          style={{
                            width:
                              "100%",
                            aspectRatio:
                              "1/1",
                            borderRadius:
                              "14px",
                            overflow:
                              "hidden",
                            cursor:
                              "pointer",
                            background:
                              "#f3eee8",
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

                        <button
                          onClick={() =>
                            downloadFile(
                              file.url,
                              `memory-${index}`
                            )
                          }
                          style={{
                            width:
                              "100%",
                            marginTop:
                              "6px",
                            border:
                              "none",
                            borderRadius:
                              "10px",
                            padding:
                              "8px",
                            background:
                              "#2d2926",
                            color:
                              "white",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                          }}
                        >
                          DOWNLOAD
                        </button>
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
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "30px",
            zIndex: 999,
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
                maxWidth:
                  "90%",
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
                maxWidth:
                  "90%",
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