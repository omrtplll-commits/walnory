export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  let fileUrl;
  try {
    // URL'yi decode et (base64 değil, encodeURIComponent kullanıyoruz)
    fileUrl = decodeURIComponent(url);
  } catch (err) {
    return res.status(400).send("Invalid url parameter");
  }

  // Sadece Firebase Storage URL'lerine izin ver (güvenlik)
  if (
    !fileUrl.includes("firebasestorage.googleapis.com") &&
    !fileUrl.includes("firebasestorage.app")
  ) {
    return res.status(403).send("Forbidden: only Firebase Storage URLs allowed");
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return res.status(502).send("Failed to fetch file from storage");
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // Uzantıyı belirle
    let extension = "jpg";
    if (contentType.includes("png"))  extension = "png";
    if (contentType.includes("jpeg")) extension = "jpg";
    if (contentType.includes("webp")) extension = "webp";
    if (contentType.includes("mp4"))  extension = "mp4";
    if (contentType.includes("mov"))  extension = "mov";
    if (contentType.includes("quicktime")) extension = "mov";

    const fileName = `walnory-memory-${Date.now()}.${extension}`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", contentType);

    // Dosyayı stream et
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));

  } catch (error) {
    console.error("Download error:", error.message);
    return res.status(500).send("Download failed");
  }
}