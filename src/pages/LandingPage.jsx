import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate =
    useNavigate();

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        color: "#2d2926",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          padding:
            "90px 18px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1150px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              letterSpacing: "5px",
              fontSize: "12px",
              opacity: 0.6,
              marginBottom: "22px",
            }}
          >
            WALNORY
          </div>

          <h1
            style={{
              fontSize:
                "clamp(42px,9vw,78px)",
              lineHeight: "1.08",
              maxWidth: "950px",
              margin:
                "0 auto 28px",
            }}
          >
            Turn Wedding Moments
            Into Timeless Memories
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin:
                "0 auto 40px",
              fontSize:
                "clamp(16px,4vw,20px)",
              lineHeight: "1.9",
              opacity: 0.72,
            }}
          >
            A luxury wedding memory
            experience where guests
            instantly share photos,
            videos, and heartfelt
            messages through a
            beautifully designed QR
            experience.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "50px",
            }}
          >
            <button
              onClick={() =>
                navigate(
                  "/create"
                )
              }
              style={
                primaryButton
              }
            >
              CREATE EVENT
            </button>

            <button
              style={
                secondaryButton
              }
            >
              WATCH DEMO
            </button>
          </div>

          <div
            style={{
              opacity: 0.72,
              fontSize:
                "clamp(14px,3vw,16px)",
              lineHeight: "2",
              maxWidth: "850px",
              margin: "0 auto",
            }}
          >
            Print your QR designs
            locally or display them
            beautifully on your
            wedding tables with our
            premium products.
            <br />
            <br />
            Discover elegant card
            prints, luxury acrylic
            QR signs, and
            handcrafted wooden
            wedding displays
            available through our
            Etsy store.
            <br />
            <br />
            We know your special
            day is once in a
            lifetime — and we
            design every detail to
            make those memories
            unforgettable.
          </div>
        </div>
      </section>

      <section
        style={{
          padding:
            "10px 18px 90px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "55px",
            }}
          >
            <div
              style={{
                letterSpacing:
                  "4px",
                fontSize: "12px",
                opacity: 0.5,
                marginBottom:
                  "16px",
              }}
            >
              HOW IT WORKS
            </div>

            <h2
              style={{
                fontSize:
                  "clamp(36px,8vw,56px)",
              }}
            >
              Elegant & Effortless
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: "22px",
            }}
          >
            <div
              style={cardStyle}
            >
              <div
                style={numberStyle}
              >
                01
              </div>

              <h3
                style={titleStyle}
              >
                Purchase & Activate
              </h3>

              <p
                style={textStyle}
              >
                Purchase your
                WALNORY product
                through Etsy and
                receive a PDF with
                activation
                instructions.
                <br />
                <br />
                After sending your
                purchase
                confirmation to our
                support email, you
                will receive your
                private event token
                to activate your
                wedding page and QR
                experience.
              </p>
            </div>

            <div
              style={cardStyle}
            >
              <div
                style={numberStyle}
              >
                02
              </div>

              <h3
                style={titleStyle}
              >
                Display Your QR
              </h3>

              <p
                style={textStyle}
              >
                Place your QR card
                or acrylic sign on
                tables, entrances,
                or wedding areas so
                guests can instantly
                access your private
                memory page.
              </p>
            </div>

            <div
              style={cardStyle}
            >
              <div
                style={numberStyle}
              >
                03
              </div>

              <h3
                style={titleStyle}
              >
                Receive Memories
              </h3>

              <p
                style={textStyle}
              >
                Guests privately
                upload photos,
                videos, and heartfelt
                messages directly to
                your personal
                wedding memory
                vault.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding:
            "0 18px 90px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            background: "white",
            borderRadius: "30px",
            padding:
              "clamp(30px,6vw,70px)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              letterSpacing: "4px",
              fontSize: "12px",
              opacity: 0.5,
              marginBottom: "18px",
            }}
          >
            PHYSICAL PRODUCTS
          </div>

          <h2
            style={{
              fontSize:
                "clamp(36px,8vw,54px)",
              marginBottom: "28px",
            }}
          >
            Elegant Wedding QR
            Displays
          </h2>

          <p
            style={{
              lineHeight: "2",
              opacity: 0.72,
              fontSize:
                "clamp(15px,3vw,18px)",
              marginBottom: "24px",
            }}
          >
            WALNORY experiences can
            be used with printable
            wedding cards, luxury
            acrylic table signs,
            welcome boards, or
            framed displays.
          </p>

          <p
            style={{
              lineHeight: "2",
              opacity: 0.72,
              fontSize:
                "clamp(15px,3vw,18px)",
            }}
          >
            You can print your QR
            designs locally or
            order professionally
            designed products
            directly through our
            Etsy store.
          </p>
        </div>
      </section>

      <section
        style={{
          padding:
            "0 18px 90px",
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
                  "16px",
              }}
            >
              PRIVACY & TRUST
            </div>

            <h2
              style={{
                fontSize:
                  "clamp(36px,8vw,56px)",
              }}
            >
              Your Memories Stay
              Private
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: "22px",
            }}
          >
            <div
              style={cardStyle}
            >
              <h3
                style={titleStyle}
              >
                Private Uploads
              </h3>

              <p
                style={textStyle}
              >
                Uploaded photos,
                videos, and messages
                are only visible to
                the event owner.
              </p>
            </div>

            <div
              style={cardStyle}
            >
              <h3
                style={titleStyle}
              >
                Hidden Event Pages
              </h3>

              <p
                style={textStyle}
              >
                Event pages are not
                indexed by search
                engines and remain
                private to your
                guests.
              </p>
            </div>

            <div
              style={cardStyle}
            >
              <h3
                style={titleStyle}
              >
                Secure Memory Vault
              </h3>

              <p
                style={textStyle}
              >
                Your wedding
                memories are safely
                stored in your
                private WALNORY
                gallery experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop:
            "1px solid rgba(0,0,0,0.08)",
          padding:
            "36px 18px 50px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <div
            style={{
              opacity: 0.7,
              fontSize: "14px",
            }}
          >
            © WALNORY
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
              opacity: 0.7,
              fontSize: "13px",
            }}
          >
            <span>
              Privacy Policy
            </span>

            <span>
              Terms of Service
            </span>

            <span>KVKK</span>

            <span>
              Contact
            </span>

            <span>Etsy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const primaryButton = {
  padding: "18px 30px",
  borderRadius: "18px",
  border: "none",
  background: "#2d2926",
  color: "white",
  fontSize: "14px",
  letterSpacing: "1px",
  cursor: "pointer",
  minWidth: "190px",
};

const secondaryButton = {
  padding: "18px 30px",
  borderRadius: "18px",
  border: "1px solid #d8cec2",
  background: "transparent",
  color: "#2d2926",
  fontSize: "14px",
  letterSpacing: "1px",
  cursor: "pointer",
  minWidth: "190px",
};

const cardStyle = {
  background: "white",
  padding: "32px",
  borderRadius: "28px",
  boxShadow:
    "0 15px 40px rgba(0,0,0,0.06)",
};

const numberStyle = {
  fontSize: "13px",
  letterSpacing: "3px",
  opacity: 0.45,
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "28px",
  marginBottom: "18px",
  color: "#2d2926",
};

const textStyle = {
  lineHeight: "1.9",
  opacity: 0.72,
  fontSize: "15px",
};

export default LandingPage;