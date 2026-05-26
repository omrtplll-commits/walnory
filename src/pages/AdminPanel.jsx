import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

// GÜVENLİK: Admin şifresi — istersen değiştir
const ADMIN_PASSWORD = "walnory2024admin";

function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tokenCount, setTokenCount] = useState(10);
  const [packageType, setPackageType] = useState("basic");
  const [generating, setGenerating] = useState(false);
  const [generatedTokens, setGeneratedTokens] = useState([]);
  const [stats, setStats] = useState({ total: 0, basic: 0, premium: 0, used: 0, unused: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [allTokens, setAllTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchStats();
    } else {
      alert("Wrong password!");
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const snapshot = await getDocs(collection(db, "tokens"));
      let basic = 0, premium = 0, used = 0, unused = 0;
      snapshot.forEach((doc) => {
        const d = doc.data();
        if (d.package === "premium") premium++; else basic++;
        if (d.used) used++; else unused++;
      });
      setStats({ total: snapshot.size, basic, premium, used, unused });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAllTokens = async () => {
    setLoadingTokens(true);
    try {
      const snapshot = await getDocs(collection(db, "tokens"));
      const tokens = [];
      snapshot.forEach((doc) => {
        tokens.push({ id: doc.id, ...doc.data() });
      });
      tokens.sort((a, b) => (a.used === b.used ? 0 : a.used ? 1 : -1));
      setAllTokens(tokens);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTokens(false);
    }
  };

  const generateTokens = async () => {
    if (tokenCount < 1 || tokenCount > 500) {
      alert("Please enter a number between 1 and 500");
      return;
    }

    setGenerating(true);
    setGeneratedTokens([]);
    const newTokens = [];

    try {
      for (let i = 0; i < tokenCount; i++) {
        const token = `WAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

        await setDoc(doc(collection(db, "tokens"), token), {
          active: true,
          used: false,
          package: packageType,
          createdAt: new Date(),
          usedAt: null,
          usedBy: null,
        });

        newTokens.push(token);
      }

      setGeneratedTokens(newTokens);
      fetchStats();
      alert(`✅ ${tokenCount} ${packageType.toUpperCase()} tokens created!`);
    } catch (err) {
      console.error(err);
      alert("Error generating tokens");
    } finally {
      setGenerating(false);
    }
  };

  const copyAllTokens = () => {
    const text = generatedTokens.join("\n");
    navigator.clipboard.writeText(text);
    alert("All tokens copied!");
  };

  const exportCSV = () => {
    let csv = "Token;Package;Used;UsedBy;UsedAt\r\n";
    allTokens.forEach((t) => {
      csv += `${t.id};${t.package || "basic"};${t.used ? "YES" : "NO"};${t.usedBy || ""};${t.usedAt ? new Date(t.usedAt.seconds * 1000).toLocaleDateString() : ""}\r\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `walnory-tokens-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "16px" }}>WALNORY</div>
          <h2 style={{ fontSize: "24px", color: "#2d2926", marginBottom: "32px" }}>Admin Panel</h2>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #e8e0d8", fontSize: "15px", boxSizing: "border-box", marginBottom: "16px", outline: "none" }}
          />
          <button onClick={handleLogin} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "#2d2926", color: "white", fontSize: "14px", letterSpacing: "1px", cursor: "pointer" }}>
            LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom,#f8f5f0,#efe7dc)", padding: "40px 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ letterSpacing: "4px", fontSize: "11px", opacity: 0.4, marginBottom: "8px" }}>WALNORY</div>
          <h1 style={{ fontSize: "32px", color: "#2d2926", fontWeight: 700 }}>Admin Panel</h1>
        </div>

        {/* İstatistikler */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Total Tokens", value: stats.total, color: "#2d2926" },
            { label: "Basic", value: stats.basic, color: "#7d736b" },
            { label: "Premium", value: stats.premium, color: "#c4a882" },
            { label: "Used", value: stats.used, color: "#c0392b" },
            { label: "Available", value: stats.unused, color: "#27ae60" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{loadingStats ? "..." : s.value}</div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", opacity: 0.5, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sekmeler */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["generate", "tokens"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab === "tokens") fetchAllTokens(); }}
              style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: activeTab === tab ? "#2d2926" : "white", color: activeTab === tab ? "white" : "#2d2926", fontSize: "12px", letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase" }}>
              {tab === "generate" ? "Generate Tokens" : "All Tokens"}
            </button>
          ))}
        </div>

        {/* Token Üretme */}
        {activeTab === "generate" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "18px", color: "#2d2926", marginBottom: "24px" }}>Generate New Tokens</h3>

            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "160px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", opacity: 0.5, marginBottom: "8px" }}>COUNT</div>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={tokenCount}
                  onChange={(e) => setTokenCount(parseInt(e.target.value))}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e8e0d8", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "160px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", opacity: 0.5, marginBottom: "8px" }}>PACKAGE</div>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e8e0d8", fontSize: "16px", boxSizing: "border-box", outline: "none", background: "white" }}
                >
                  <option value="basic">Basic (20 days)</option>
                  <option value="premium">Premium (40 days)</option>
                </select>
              </div>
            </div>

            <button onClick={generateTokens} disabled={generating} style={{ padding: "16px 32px", borderRadius: "14px", border: "none", background: generating ? "#9d948c" : "#2d2926", color: "white", fontSize: "13px", letterSpacing: "1px", cursor: generating ? "not-allowed" : "pointer" }}>
              {generating ? "GENERATING..." : `GENERATE ${tokenCount} ${packageType.toUpperCase()} TOKENS`}
            </button>

            {/* Üretilen tokenlar */}
            {generatedTokens.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "13px", color: "#2d2926", fontWeight: 600 }}>✅ {generatedTokens.length} tokens created</div>
                  <button onClick={copyAllTokens} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #c4b8a8", background: "transparent", fontSize: "12px", cursor: "pointer" }}>
                    COPY ALL
                  </button>
                </div>
                <div style={{ background: "#f8f5f0", borderRadius: "12px", padding: "16px", maxHeight: "300px", overflowY: "auto" }}>
                  {generatedTokens.map((t, i) => (
                    <div key={i} style={{ fontFamily: "monospace", fontSize: "13px", padding: "4px 0", borderBottom: "1px solid #ece7df", color: "#4f4740" }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tüm Tokenlar */}
        {activeTab === "tokens" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", color: "#2d2926", margin: 0 }}>All Tokens</h3>
              <button onClick={exportCSV} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#2d2926", color: "white", fontSize: "12px", letterSpacing: "1px", cursor: "pointer" }}>
                ⬇ EXPORT CSV
              </button>
            </div>

            {loadingTokens ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9d948c" }}>Loading...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0ebe4" }}>
                      {["Token", "Package", "Status", "Used By", "Used At"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "10px", letterSpacing: "2px", opacity: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allTokens.map((t) => (
                      <tr key={t.id} style={{ borderBottom: "1px solid #f8f5f0" }}>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#2d2926" }}>{t.id}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: t.package === "premium" ? "#f5e6d0" : "#f0ebe4", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", letterSpacing: "1px" }}>
                            {(t.package || "basic").toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ color: t.used ? "#c0392b" : "#27ae60", fontWeight: 600, fontSize: "12px" }}>
                            {t.used ? "USED" : "AVAILABLE"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#7d736b", fontSize: "12px" }}>{t.usedBy || "—"}</td>
                        <td style={{ padding: "10px 12px", color: "#7d736b", fontSize: "12px" }}>
                          {t.usedAt ? new Date(t.usedAt.seconds * 1000).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;