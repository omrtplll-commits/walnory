import { db } from "./firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

const tokens = [
  "WAL-7F2K-91A",
  "WAL-4P8X-22M",
  "WAL-9T1D-74Q",
  "WAL-5R8L-33N",
  "WAL-2Z7K-18P",
  "WAL-6Q4M-81X",
  "WAL-1V9D-55T",
  "WAL-3H7P-62W",
  "WAL-8N2X-14R",
  "WAL-5K6Q-99L",
];

const uploadTokens =
  async () => {
    try {
      for (const token of tokens) {
        await setDoc(
          doc(
            db,
            "tokens",
            token
          ),
          {
            active: true,
            used: false,
          }
        );

        console.log(
          "Uploaded:",
          token
        );
      }

      console.log(
        "ALL TOKENS UPLOADED"
      );
    } catch (error) {
      console.error(error);
    }
  };

uploadTokens();