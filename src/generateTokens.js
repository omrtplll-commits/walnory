import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const generateTokens =
  async () => {
    for (let i = 0; i < 200; i++) {
      const token =
        `WAL-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase()}`;

      await setDoc(
        doc(
          collection(
            db,
            "tokens"
          ),
          token
        ),
        {
          active: true,
          used: false,
        }
      );

      console.log(
        "Created:",
        token
      );
    }

    console.log(
      "200 TOKENS CREATED"
    );
  };

generateTokens();