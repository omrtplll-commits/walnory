import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./src/firebase.js";

// AYARLAR — buradan değiştir
const TOKEN_COUNT = 10;        // kaç token üretilsin
const PACKAGE = "basic";       // "basic" veya "premium"

const generateTokens = async () => {
  console.log(`Generating ${TOKEN_COUNT} ${PACKAGE.toUpperCase()} tokens...`);

  for (let i = 0; i < TOKEN_COUNT; i++) {
    const token = `WAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    await setDoc(doc(collection(db, "tokens"), token), {
      active: true,
      used: false,
      package: PACKAGE,
      createdAt: new Date(),
      usedAt: null,
      usedBy: null,
    });

    console.log(`Created [${PACKAGE.toUpperCase()}]:`, token);
  }

  console.log(`✅ ${TOKEN_COUNT} ${PACKAGE.toUpperCase()} tokens created!`);
};

generateTokens();