import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const ETSY_URL = "https://www.etsy.com/shop/walnory"; // Etsy mağaza linkini buraya yaz

  return (
    <div style={{
      background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
      color: "#2d2926",
      overflowX: "hidden",
    }}>

      {/* HERO */}
      <section style={{ padding: "90px 18px 80px" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ letterSpacing: "5px", fontSize: "12px", opacity: 0.6, marginBottom: "22px" }}>
            WALNORY
          </div>

          <h1 style={{
            fontSize: "clamp(42px,9vw,78px)",
            lineHeight: "1.08",
            maxWidth: "950px",
            margin: "0 auto 28px",
          }}>
            Turn Wedding Moments Into Timeless Memories
          </h1>

          <p style={{
            maxWidth: "760px",
            margin: "0 auto 40px",
            fontSize: "clamp(16px,4vw,20px)",
            lineHeight: "1.9",
            opacity: 0.72,
          }}>
            A luxury wedding memory experience where guests instantly share photos, videos, and heartfelt messages through a beautifully designed QR experience.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "50px",
          }}>
            <button onClick={() => navigate("/create")} style={primaryButton}>
              CREATE EVENT
            </button>
            <button
              onClick={() => window.open(ETSY_URL, "_blank")}
              style={secondaryButton}
            >
              VISIT ETSY STORE
            </button>
            <button style={{ ...secondaryButton, opacity: 0.5, cursor: "default" }}>
              WATCH DEMO
            </button>
          </div>

          <div style={{
            opacity: 0.65,
            fontSize: "clamp(14px,3vw,16px)",
            lineHeight: "2",
            maxWidth: "750px",
            margin: "0 auto",
          }}>
            We know your special day is once in a lifetime — and we design every detail to make those memories unforgettable.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "10px 18px 90px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "55px" }}>
            <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "16px" }}>
              HOW IT WORKS
            </div>
            <h2 style={{ fontSize: "clamp(36px,8vw,56px)" }}>
              Elegant & Effortless
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "22px",
          }}>
            {[
              {
                num: "01",
                title: "Purchase & Activate",
                text: "Purchase your WALNORY product through Etsy and receive your private event token to activate your wedding page and QR experience.",
              },
              {
                num: "02",
                title: "Display Your QR",
                text: "Place your QR card or acrylic sign on tables, entrances, or wedding areas so guests can instantly access your private memory page.",
              },
              {
                num: "03",
                title: "Guests Upload",
                text: "Guests scan the QR code and privately upload their photos, videos, and heartfelt messages — no app download required.",
              },
              {
                num: "04",
                title: "Receive Memories",
                text: "All uploads appear instantly in your private owner gallery. View, download, and keep every memory from your special day.",
              },
            ].map((card) => (
              <div key={card.num} style={cardStyle}>
                <div style={numberStyle}>{card.num}</div>
                <h3 style={titleStyle}>{card.title}</h3>
                <p style={textStyle}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHYSICAL PRODUCTS */}
      <section style={{ padding: "0 18px 90px" }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          borderRadius: "30px",
          padding: "clamp(30px,6vw,70px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        }}>
          <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "18px" }}>
            PHYSICAL PRODUCTS
          </div>

          <h2 style={{ fontSize: "clamp(36px,8vw,54px)", marginBottom: "28px" }}>
            Elegant Wedding QR Displays
          </h2>

          <p style={{ lineHeight: "2", opacity: 0.72, fontSize: "clamp(15px,3vw,18px)", marginBottom: "24px" }}>
            WALNORY experiences can be used with printable wedding cards, luxury acrylic table signs, welcome boards, or framed displays.
          </p>

          <p style={{ lineHeight: "2", opacity: 0.72, fontSize: "clamp(15px,3vw,18px)", marginBottom: "36px" }}>
            You can print your QR designs locally or order professionally designed products directly through our Etsy store.
          </p>

          <button
            onClick={() => window.open(ETSY_URL, "_blank")}
            style={primaryButton}
          >
            SHOP ON ETSY
          </button>
        </div>
      </section>

      {/* PRIVACY */}
      <section style={{ padding: "0 18px 90px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "16px" }}>
              PRIVACY & TRUST
            </div>
            <h2 style={{ fontSize: "clamp(36px,8vw,56px)" }}>
              Your Memories Stay Private
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "22px",
          }}>
            {[
              {
                title: "Private Uploads",
                text: "Uploaded photos, videos, and messages are only visible to the event owner — never public.",
              },
              {
                title: "Hidden Event Pages",
                text: "Event pages are not indexed by search engines and remain completely private to your guests.",
              },
              {
                title: "Secure Memory Vault",
                text: "Your wedding memories are safely stored in your private WALNORY gallery experience.",
              },
            ].map((card) => (
              <div key={card.title} style={cardStyle}>
                <h3 style={titleStyle}>{card.title}</h3>
                <p style={textStyle}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "36px 18px 50px" }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
        }}>
          <div style={{ opacity: 0.7, fontSize: "14px" }}>© WALNORY</div>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", opacity: 0.7, fontSize: "13px" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            <span style={{ cursor: "pointer" }}>KVKK</span>
            <span style={{ cursor: "pointer" }}>Contact</span>
            <span
              onClick={() => window.open(ETSY_URL, "_blank")}
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Etsy
            </span>
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
  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
};

const numberStyle = {
  fontSize: "13px",
  letterSpacing: "3px",
  opacity: 0.45,
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: "16px",
  color: "#2d2926",
};

const textStyle = {
  lineHeight: "1.9",
  opacity: 0.72,
  fontSize: "15px",
};

export default LandingPage;