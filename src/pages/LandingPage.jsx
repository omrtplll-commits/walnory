import { useNavigate } from "react-router-dom";
import { getTranslation } from "../translations";
import { useState } from "react";

const t = getTranslation();

function LandingPage() {
  const navigate = useNavigate();
  const ETSY_URL = "https://www.etsy.com/shop/walnory";
  const TR_URL = "https://www.tabelastudio.com.tr";
  const isTurkish = navigator.language?.toLowerCase().startsWith("tr");
  const [modal, setModal] = useState(null); // "privacy" | "terms" | "kvkk" | "contact"

  const Modal = ({ title, children }) => (
    <div
      onClick={() => setModal(null)}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "680px", width: "100%", maxHeight: "80vh", overflowY: "auto", position: "relative" }}
      >
        <button onClick={() => setModal(null)} style={{ position: "absolute", top: "20px", right: "24px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#9d948c" }}>✕</button>
        <div style={{ letterSpacing: "3px", fontSize: "10px", opacity: 0.4, marginBottom: "12px", textTransform: "uppercase" }}>WALNORY</div>
        <h2 style={{ fontSize: "22px", color: "#2d2926", marginBottom: "24px", fontWeight: 700 }}>{title}</h2>
        <div style={{ fontSize: "14px", color: "#4f4740", lineHeight: 1.9 }}>{children}</div>
      </div>
    </div>
  );

  const P = ({ children }) => <p style={{ marginBottom: "14px" }}>{children}</p>;
  const H = ({ children }) => <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#2d2926", marginTop: "20px", marginBottom: "8px" }}>{children}</h3>;

  return (
    <div style={{ background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", color: "#2d2926", overflowX: "hidden", position: "relative" }}>

      {/* Gelin damat - ortada soluk */}
      <img
        src="https://firebasestorage.googleapis.com/v0/b/walnory.firebasestorage.app/o/1.png?alt=media&token=cfa88e65-e792-4532-b90d-239f25efac2d"
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "85%",
          width: "auto",
          opacity: 0.1,
          pointerEvents: "none",
          zIndex: 0,
          userSelect: "none",
        }}
      />


      

      {/* İçerik z-index */}
      <div style={{ position: "relative", zIndex: 1 }}>

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
            <span onClick={() => setModal("privacy")} style={{ cursor: "pointer" }}>{t.privacyPolicy}</span>
            <span onClick={() => setModal("terms")} style={{ cursor: "pointer" }}>{t.termsOfService}</span>
            {isTurkish && <span onClick={() => setModal("kvkk")} style={{ cursor: "pointer" }}>KVKK</span>}
            <span onClick={() => setModal("contact")} style={{ cursor: "pointer" }}>{t.contact}</span>
            <span onClick={() => window.open(ETSY_URL, "_blank")} style={{ cursor: "pointer", fontWeight: 600 }}>Etsy</span>
          </div>
        </div>
      </footer>

      {/* MODALler */}
      {modal === "privacy" && (
        <Modal title="Privacy Policy">
          <P>Last updated: May 2026</P>
          <P>WALNORY ("we", "us", or "our") operates the WALNORY wedding memory platform. This Privacy Policy explains how we collect, use, and protect your personal information.</P>
          <H>Information We Collect</H>
          <P>When you create an event, we collect your email address, event name, couple names, event date, and venue. When guests upload memories, we collect their name, message, photos, and videos.</P>
          <H>How We Use Your Information</H>
          <P>We use your information solely to provide the WALNORY service — creating your event page, storing uploaded memories, and sending you your owner gallery link.</P>
          <H>Data Storage</H>
          <P>Your data is stored securely on Google Firebase servers. Files are stored in Firebase Storage and event data in Firestore. Google's security standards apply to all stored data.</P>
          <H>Data Retention</H>
          <P>Basic package events and all associated files are automatically deleted 20 days after the event date. Premium package events are deleted after 40 days. After deletion, data cannot be recovered.</P>
          <H>Third Parties</H>
          <P>We do not sell, trade, or share your personal data with third parties. We use EmailJS to send transactional emails and Google Firebase for data storage.</P>
          <H>Your Rights</H>
          <P>You have the right to access, correct, or request deletion of your personal data. Contact us at hello@walnorystudio.com for any data-related requests.</P>
          <H>Contact</H>
          <P>hello@walnorystudio.com</P>
        </Modal>
      )}

      {modal === "terms" && (
        <Modal title="Terms of Service">
          <P>Last updated: May 2026</P>
          <P>By using WALNORY, you agree to these Terms of Service. Please read them carefully before using our platform.</P>
          <H>Service Description</H>
          <P>WALNORY provides a QR-based digital wedding memory platform allowing event guests to upload photos, videos, and messages, which are stored privately for the event owner.</P>
          <H>Activation Token</H>
          <P>Each purchase includes one single-use activation token. Tokens cannot be transferred, refunded, or reused once activated. Each token creates one event.</P>
          <H>Data Retention & Deletion</H>
          <P>Basic package: event data is deleted 20 days after the event date. Premium package: 40 days. WALNORY is not responsible for data loss if the owner fails to download their memories before the deletion date.</P>
          <H>Acceptable Use</H>
          <P>You agree not to upload illegal, harmful, or offensive content. WALNORY reserves the right to remove content that violates these terms without notice.</P>
          <H>Limitation of Liability</H>
          <P>WALNORY provides the service "as is". We are not liable for technical failures, data loss, or service interruptions. Our maximum liability is limited to the purchase price of your package.</P>
          <H>Intellectual Property</H>
          <P>You retain ownership of all content you upload. By uploading, you grant WALNORY a limited license to store and display your content solely for providing the service.</P>
          <H>Changes to Terms</H>
          <P>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</P>
          <H>Contact</H>
          <P>hello@walnorystudio.com</P>
        </Modal>
      )}

      {modal === "kvkk" && (
        <Modal title="KVKK Aydınlatma Metni">
          <P>Son güncelleme: Mayıs 2026</P>
          <P>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenmesine ilişkin aşağıdaki bilgileri sizinle paylaşmak isteriz.</P>
          <H>Veri Sorumlusu</H>
          <P>WALNORY (hello@walnorystudio.com) veri sorumlusu sıfatıyla kişisel verilerinizi işlemektedir.</P>
          <H>İşlenen Kişisel Veriler</H>
          <P>Etkinlik sahibi için: e-posta adresi, etkinlik adı, çift isimleri, etkinlik tarihi, mekan bilgisi. Misafirler için: isim, mesaj, fotoğraf ve video içerikleri.</P>
          <H>Kişisel Verilerin İşlenme Amacı</H>
          <P>Toplanan veriler yalnızca WALNORY hizmetinin sunulması amacıyla kullanılmaktadır. Verileriniz üçüncü kişilerle paylaşılmamakta, satılmamakta veya kiralanmamaktadır.</P>
          <H>Kişisel Verilerin Saklanma Süresi</H>
          <P>Basic paket: etkinlik tarihinden itibaren 20 gün. Premium paket: etkinlik tarihinden itibaren 40 gün. Süre sonunda tüm veriler kalıcı olarak silinmektedir.</P>
          <H>Kişisel Verilerin Aktarımı</H>
          <P>Verileriniz, Google Firebase altyapısında güvenli olarak saklanmaktadır. E-posta iletimi için EmailJS kullanılmaktadır. Bu hizmet sağlayıcılar dışında herhangi bir üçüncü tarafla veri paylaşımı yapılmamaktadır.</P>
          <H>KVKK Kapsamındaki Haklarınız</H>
          <P>KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme haklarına sahipsiniz.</P>
          <H>İletişim</H>
          <P>KVKK kapsamındaki taleplerinizi hello@walnorystudio.com adresine iletebilirsiniz.</P>
        </Modal>
      )}

      {modal === "contact" && (
        <Modal title="Contact Us">
          <P>We'd love to hear from you. For any questions, support requests, or partnership inquiries, please reach out to us.</P>
          <H>Email</H>
          <P><a href="mailto:hello@walnorystudio.com" style={{ color: "#2d2926" }}>hello@walnorystudio.com</a></P>
          <H>Response Time</H>
          <P>We typically respond within 24 hours on business days.</P>
          <H>For Turkish Customers</H>
          <P>Türkiye'deki müşterilerimiz için: <a href="https://www.tabelastudio.com.tr" target="_blank" rel="noreferrer" style={{ color: "#2d2926" }}>tabelastudio.com.tr</a></P>
          <H>Etsy Shop</H>
          <P><a href="https://www.etsy.com/shop/walnory" target="_blank" rel="noreferrer" style={{ color: "#2d2926" }}>etsy.com/shop/walnory</a></P>
        </Modal>
      )}

      </div>
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