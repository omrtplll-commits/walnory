import { useNavigate } from "react-router-dom";
import { getTranslation } from "../translations";

const t = getTranslation();

function LandingPage() {
  const navigate = useNavigate();
  const ETSY_URL = "https://www.etsy.com/shop/walnory";
  const TR_URL = "https://www.tabelastudio.com.tr";
  const isTurkish = navigator.language?.toLowerCase().startsWith("tr");

  return (
    <div style={{ background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", color: "#2d2926", overflowX: "hidden" }}>

      {/* HERO */}
      <section style={{ padding: "90px 18px 80px" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ letterSpacing: "5px", fontSize: "12px", opacity: 0.6, marginBottom: "22px" }}>WALNORY</div>
          <h1 style={{ fontSize: "clamp(42px,9vw,78px)", lineHeight: "1.08", maxWidth: "950px", margin: "0 auto 28px" }}>
            {t.heroTitle}
          </h1>
          <p style={{ maxWidth: "760px", margin: "0 auto 40px", fontSize: "clamp(16px,4vw,20px)", lineHeight: "1.9", opacity: 0.72 }}>
            {t.heroDesc}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "50px" }}>
            <button onClick={() => navigate("/create")} style={primaryButton}>{t.createEvent}</button>
            <button onClick={() => window.open(ETSY_URL, "_blank")} style={secondaryButton}>{t.visitEtsy}</button>
            {isTurkish && (
              <button onClick={() => window.open(TR_URL, "_blank")} style={{ ...secondaryButton, background: "#2d2926", color: "white", border: "none" }}>
                🇹🇷 Türkiye'den Satın Al
              </button>
            )}
            <button style={{ ...secondaryButton, opacity: 0.4, cursor: "default" }}>{t.watchDemo}</button>
          </div>
          <div style={{ opacity: 0.65, fontSize: "clamp(14px,3vw,16px)", lineHeight: "2", maxWidth: "750px", margin: "0 auto" }}>
            {t.heroFooter}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "10px 18px 90px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "55px" }}>
            <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "16px" }}>{t.howItWorks}</div>
            <h2 style={{ fontSize: "clamp(36px,8vw,56px)" }}>{t.elegantEffortless}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "22px" }}>
            {t.steps.map((card) => (
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
        <div style={{ maxWidth: "1100px", margin: "0 auto", background: "white", borderRadius: "30px", padding: "clamp(30px,6vw,70px)", boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}>
          <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "18px" }}>{t.physicalProducts}</div>
          <h2 style={{ fontSize: "clamp(36px,8vw,54px)", marginBottom: "28px" }}>{t.elegantDisplays}</h2>
          <p style={{ lineHeight: "2", opacity: 0.72, fontSize: "clamp(15px,3vw,18px)", marginBottom: "24px" }}>{t.physicalDesc1}</p>
          <p style={{ lineHeight: "2", opacity: 0.72, fontSize: "clamp(15px,3vw,18px)", marginBottom: "36px" }}>{t.physicalDesc2}</p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button onClick={() => window.open(ETSY_URL, "_blank")} style={primaryButton}>{t.shopEtsy}</button>
            {isTurkish && (
              <button onClick={() => window.open(TR_URL, "_blank")} style={{ ...primaryButton, background: "#8b7355" }}>
                🇹🇷 Türkiye'den Satın Al
              </button>
            )}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section style={{ padding: "0 18px 90px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div style={{ letterSpacing: "4px", fontSize: "12px", opacity: 0.5, marginBottom: "16px" }}>{t.privacyTrust}</div>
            <h2 style={{ fontSize: "clamp(36px,8vw,56px)" }}>{t.memoriesPrivate}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "22px" }}>
            {t.privacyCards.map((card) => (
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
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div style={{ opacity: 0.7, fontSize: "14px" }}>© WALNORY</div>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", opacity: 0.7, fontSize: "13px" }}>
            <span style={{ cursor: "pointer" }}>{t.privacyPolicy}</span>
            <span style={{ cursor: "pointer" }}>{t.termsOfService}</span>
            <span style={{ cursor: "pointer" }}>KVKK</span>
            <span style={{ cursor: "pointer" }}>{t.contact}</span>
            <span onClick={() => window.open(ETSY_URL, "_blank")} style={{ cursor: "pointer", fontWeight: 600 }}>Etsy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const primaryButton = {
  padding: "18px 30px", borderRadius: "18px", border: "none",
  background: "#2d2926", color: "white", fontSize: "14px",
  letterSpacing: "1px", cursor: "pointer", minWidth: "190px",
};

const secondaryButton = {
  padding: "18px 30px", borderRadius: "18px", border: "1px solid #d8cec2",
  background: "transparent", color: "#2d2926", fontSize: "14px",
  letterSpacing: "1px", cursor: "pointer", minWidth: "190px",
};

const cardStyle = {
  background: "white", padding: "32px", borderRadius: "28px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
};

const numberStyle = {
  fontSize: "13px", letterSpacing: "3px", opacity: 0.45, marginBottom: "20px",
};

const titleStyle = {
  fontSize: "24px", marginBottom: "16px", color: "#2d2926",
};

const textStyle = {
  lineHeight: "1.9", opacity: 0.72, fontSize: "15px",
};

export default LandingPage;