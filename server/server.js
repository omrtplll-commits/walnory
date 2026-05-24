import express from "express";

import cors from "cors";

import axios from "axios";

const app = express();

app.use(cors());

app.get(
  "/download/:encodedUrl",
  async (req, res) => {

    try {

      const fileUrl =
        atob(
          req.params.encodedUrl
        );

      const response =
        await axios({
          url: fileUrl,
          method: "GET",
          responseType:
            "stream",
        });

      const contentType =
        response.headers[
          "content-type"
        ];

      let extension =
        "jpg";

      if (
        contentType?.includes(
          "png"
        )
      ) {
        extension = "png";
      }

      if (
        contentType?.includes(
          "jpeg"
        )
      ) {
        extension = "jpg";
      }

      if (
        contentType?.includes(
          "webp"
        )
      ) {
        extension = "webp";
      }

      if (
        contentType?.includes(
          "mp4"
        )
      ) {
        extension = "mp4";
      }

      const fileName =
        `walnory-${Date.now()}.${extension}`;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      res.setHeader(
        "Content-Type",
        contentType
      );

      response.data.pipe(
        res
      );

    } catch (error) {

      console.log(
        error.message
      );

      res
        .status(500)
        .send(
          "Download failed"
        );
    }
  }
);

app.listen(
  3001,
  () => {
    console.log(
      "Download server running on port 3001"
    );
  }
);