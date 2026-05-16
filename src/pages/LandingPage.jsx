function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#f8f5f0,#efe7dc)",
        color: "#2d2926",
      }}
    >
      <section
        style={{
          padding:
            "120px 20px 100px",
          textAlign: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            letterSpacing: "4px",
            fontSize: "13px",
            opacity: 0.6,
            marginBottom: "20px",
          }}
        >
          DIGITAL WEDDING EXPERIENCE
        </div>

        <h1
          style={{
            fontSize: "72px",
            lineHeight: "1.1",
            marginBottom: "24px",
            fontWeight: "600",
          }}
        >
          Capture Every
          <br />
          Wedding Memory
        </h1>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "20px",
            lineHeight: "1.8",
            opacity: 0.75,
          }}
        >
          Guests scan your QR code,
          upload photos, and leave
          heartfelt messages in one
          elegant private wedding
          gallery.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent:
              "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://etsy.com"
            target="_blank"
            rel="noreferrer"
            style={mainButton}
          >
            BUY ON ETSY
          </a>

          <button
            style={secondaryButton}
          >
            HOW IT WORKS
          </button>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding:
            "40px 20px 100px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "24px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={cardTitle}>
            1. Purchase
          </h2>

          <p style={cardText}>
            Purchase your digital
            wedding QR package from
            our Etsy store.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitle}>
            2. Receive Access
          </h2>

          <p style={cardText}>
            Send your purchase proof
            by email and receive your
            private access token.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitle}>
            3. Create Event
          </h2>

          <p style={cardText}>
            Use your token to create
            your personalized wedding
            memory page.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitle}>
            4. Share Memories
          </h2>

          <p style={cardText}>
            Guests scan the QR code,
            upload photos, and leave
            beautiful memories.
          </p>
        </div>
      </section>

      <section
        style={{
          background: "white",
          padding:
            "90px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "46px",
              marginBottom: "20px",
            }}
          >
            Private & Secure
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              lineHeight: "1.9",
              fontSize: "18px",
              opacity: 0.75,
            }}
          >
            All uploaded photos and
            messages are privately
            stored and only visible
            to the event owner.
            Walnory does not publish
            guest content publicly or
            index event galleries in
            search engines.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent:
                "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={badgeStyle}>
              Private Event Access
            </div>

            <div style={badgeStyle}>
              Secure Cloud Storage
            </div>

            <div style={badgeStyle}>
              No Public Indexing
            </div>

            <div style={badgeStyle}>
              KVKK Friendly
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          padding:
            "50px 20px",
          textAlign: "center",
          opacity: 0.6,
          fontSize: "14px",
        }}
      >
        © 2026 WALNORY
        <br />
        Digital Wedding Memory
        Experience
      </footer>
    </div>
  );
}

const mainButton = {
  padding: "18px 34px",
  background: "#2d2926",
  color: "white",
  borderRadius: "18px",
  textDecoration: "none",
  fontSize: "15px",
  letterSpacing: "1px",
};

const secondaryButton = {
  padding: "18px 34px",
  background: "transparent",
  border: "1px solid #2d2926",
  borderRadius: "18px",
  fontSize: "15px",
  cursor: "pointer",
};

const cardStyle = {
  background: "white",
  borderRadius: "28px",
  padding: "36px",
  boxShadow:
    "0 15px 40px rgba(0,0,0,0.06)",
};

const cardTitle = {
  marginBottom: "18px",
  fontSize: "28px",
};

const cardText = {
  lineHeight: "1.8",
  opacity: 0.75,
};

const badgeStyle = {
  padding: "14px 22px",
  borderRadius: "999px",
  background: "#f5f1eb",
  fontSize: "14px",
};

export default LandingPage;