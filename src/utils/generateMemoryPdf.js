import jsPDF from "jspdf";

const generateMemoryPdf = ({
  coupleNames,
  eventDate,
  guestLink,
  ownerLink,
}) => {
  const doc = new jsPDF();

  doc.setFillColor(
    248,
    245,
    240
  );

  doc.rect(
    0,
    0,
    210,
    297,
    "F"
  );

  doc.setTextColor(
    45,
    41,
    38
  );

  doc.setFontSize(30);

  doc.text(
    "WALNORY",
    20,
    30
  );

  doc.setFontSize(14);

  doc.text(
    "Wedding Memory Experience",
    20,
    40
  );

  doc.setDrawColor(
    180,
    170,
    160
  );

  doc.line(
    20,
    48,
    190,
    48
  );

  doc.setFontSize(20);

  doc.text(
    "Event Details",
    20,
    70
  );

  doc.setFontSize(12);

  doc.text(
    `Couple / Host: ${coupleNames}`,
    20,
    85
  );

  doc.text(
    `Event Date: ${eventDate}`,
    20,
    95
  );

  doc.setFontSize(20);

  doc.text(
    "Important Links",
    20,
    120
  );

  doc.setFontSize(10);

  doc.text(
    "Guest Upload Page:",
    20,
    135
  );

  doc.text(
    guestLink,
    20,
    143
  );

  doc.text(
    "Private Owner Gallery:",
    20,
    158
  );

  doc.text(
    ownerLink,
    20,
    166
  );

  doc.setFontSize(20);

  doc.text(
    "Quick Instructions",
    20,
    192
  );

  doc.setFontSize(11);

  doc.text(
    "- Share your QR code during your event.",
    20,
    206
  );

  doc.text(
    "- Guests can upload photos, videos and messages instantly.",
    20,
    216
  );

  doc.text(
    "- Keep your private owner link secure.",
    20,
    226
  );

  doc.text(
    "- Save this PDF safely for future access.",
    20,
    236
  );

  doc.setFontSize(20);

  doc.text(
    "Printing Notes",
    20,
    258
  );

  doc.setFontSize(10);

  doc.text(
    "- Use the original QR file when printing.",
    20,
    270
  );

  doc.text(
    "- Do not stretch or distort the QR code.",
    20,
    278
  );

  doc.text(
    "- You may print locally or use WALNORY premium acrylic and table display products.",
    20,
    286
  );

  doc.save(
    "walnory-memory-package.pdf"
  );
};

export default generateMemoryPdf;