import { jsPDF } from "jspdf";
import type { PackageDetail, TourPackage } from "@/types";

/**
 * Downloads a comprehensive, beautifully formatted PDF document of the tour package details.
 * Contains:
 * - Header & Hero Details (Name, Duration, Category, Route, Price, Rating)
 * - 01 Overview & Highlights
 * - 02 Complete Day-by-Day Itinerary
 * - 03 Inclusions, Exclusions & Important Notes
 * - 04 Terms, Cancellation & Policies
 * - 05 Contact Us & Helplines
 */
export function downloadPackageDetails(
  pkg: TourPackage,
  detail: PackageDetail,
  detailedInclusions: string[],
  detailedExclusions: string[],
  importantInclusionNotes: string[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let yPos = margin;

  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900
  const brandColor: [number, number, number] = [30, 58, 138]; // blue-900 / navy
  const accentColor: [number, number, number] = [217, 119, 6]; // amber-600
  const mutedColor: [number, number, number] = [100, 116, 139]; // slate-500

  const checkPageBreak = (neededHeight: number) => {
    if (yPos + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      yPos = margin + 5;
    }
  };

  const drawSectionHeader = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setFillColor(30, 58, 138); // brand navy
    doc.rect(margin, yPos, 3, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...brandColor);
    doc.text(title.toUpperCase(), margin + 6, yPos + 5.5);

    yPos += 12;
  };

  // --- HEADER BANNER ---
  doc.setFillColor(...brandColor);
  doc.rect(margin, yPos, contentWidth, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("IRCTC TOURISM", margin + 6, yPos + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("OFFICIAL PACKAGE BROCHURE & ITINERARY", margin + 6, yPos + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`CODE: ${pkg.code}`, margin + contentWidth - 6, yPos + 12, { align: "right" });

  yPos += 28;

  // --- HERO DETAILS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  const nameLines = doc.splitTextToSize(pkg.name, contentWidth);
  doc.text(nameLines, margin, yPos);
  yPos += nameLines.length * 6.5 + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...mutedColor);
  doc.text(
    `${pkg.nights} Nights / ${pkg.days} Days  |  Category: ${pkg.category}  |  Mode: ${pkg.travelMode}`,
    margin,
    yPos
  );
  yPos += 7;

  // Summary box
  checkPageBreak(28);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);

  // Row 1
  doc.setFont("helvetica", "bold");
  doc.text("Origin:", margin + 4, yPos + 6);
  doc.setFont("helvetica", "normal");
  doc.text(pkg.from, margin + 20, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.text("Destination:", margin + 90, yPos + 6);
  doc.setFont("helvetica", "normal");
  doc.text(pkg.region, margin + 115, yPos + 6);

  // Row 2
  doc.setFont("helvetica", "bold");
  doc.text("Departure:", margin + 4, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.text(pkg.departure, margin + 24, yPos + 12);

  doc.setFont("helvetica", "bold");
  doc.text("Starting Fare:", margin + 90, yPos + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text(`Rs. ${pkg.price.toLocaleString("en-IN")} per person`, margin + 115, yPos + 12);

  // Row 3
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Rating:", margin + 4, yPos + 18);
  doc.setFont("helvetica", "normal");
  doc.text(`* ${pkg.rating.toFixed(1)} / 5.0 (${pkg.reviews.toLocaleString("en-IN")} reviews)`, margin + 20, yPos + 18);

  yPos += 30;

  // --- 01 OVERVIEW ---
  drawSectionHeader("01. Overview & Highlights");

  if (pkg.blurb) {
    checkPageBreak(15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    const blurbLines = doc.splitTextToSize(pkg.blurb, contentWidth);
    checkPageBreak(blurbLines.length * 4.5);
    doc.text(blurbLines, margin, yPos);
    yPos += blurbLines.length * 4.5 + 4;
  }

  if (pkg.highlights && pkg.highlights.length > 0) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...brandColor);
    doc.text("Tour Highlights:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    pkg.highlights.forEach((h) => {
      const hLines = doc.splitTextToSize(`• ${h}`, contentWidth - 4);
      checkPageBreak(hLines.length * 4.5);
      doc.text(hLines, margin + 2, yPos);
      yPos += hLines.length * 4.5 + 1;
    });
    yPos += 3;
  }

  // --- 02 ITINERARY ---
  drawSectionHeader("02. Day-by-Day Itinerary");

  pkg.itinerary.forEach((d) => {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...brandColor);
    doc.text(`DAY ${d.day}: ${d.title.toUpperCase()}`, margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    const detailLines = doc.splitTextToSize(d.detail, contentWidth - 4);
    checkPageBreak(detailLines.length * 4.5 + 3);
    doc.text(detailLines, margin + 2, yPos);
    yPos += detailLines.length * 4.5 + 5;
  });

  // --- 03 INCLUSIONS & EXCLUSIONS ---
  drawSectionHeader("03. Inclusions, Exclusions & Notes");

  checkPageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 101, 52); // green-800
  doc.text("Inclusions:", margin, yPos);
  yPos += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  detailedInclusions.forEach((inc) => {
    const incLines = doc.splitTextToSize(`[Y] ${inc}`, contentWidth - 4);
    checkPageBreak(incLines.length * 4.5);
    doc.text(incLines, margin + 2, yPos);
    yPos += incLines.length * 4.5 + 1;
  });
  yPos += 3;

  checkPageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(153, 27, 27); // red-800
  doc.text("Exclusions:", margin, yPos);
  yPos += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  detailedExclusions.forEach((exc) => {
    const excLines = doc.splitTextToSize(`[X] ${exc}`, contentWidth - 4);
    checkPageBreak(excLines.length * 4.5);
    doc.text(excLines, margin + 2, yPos);
    yPos += excLines.length * 4.5 + 1;
  });
  yPos += 3;

  if (importantInclusionNotes && importantInclusionNotes.length > 0) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...accentColor);
    doc.text("Important Notes & Advisories:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    importantInclusionNotes.forEach((note, idx) => {
      const noteLines = doc.splitTextToSize(`${idx + 1}. ${note}`, contentWidth - 4);
      checkPageBreak(noteLines.length * 4.5);
      doc.text(noteLines, margin + 2, yPos);
      yPos += noteLines.length * 4.5 + 1.5;
    });
    yPos += 3;
  }

  // --- 04 TERMS & POLICY ---
  drawSectionHeader("04. Terms & Policy");

  detail.policy.forEach((p) => {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...brandColor);
    doc.text(p.title.toUpperCase(), margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);

    if (p.points) {
      p.points.forEach((pt) => {
        const ptLines = doc.splitTextToSize(`• ${pt}`, contentWidth - 4);
        checkPageBreak(ptLines.length * 4.5);
        doc.text(ptLines, margin + 2, yPos);
        yPos += ptLines.length * 4.5 + 1;
      });
    }

    if (p.bands) {
      p.bands.forEach((b) => {
        const bandText = `• ${b.label}: ${
          b.percent !== undefined ? `${b.percent}% fee` : b.flat !== undefined ? `Rs. ${b.flat} fee` : ""
        }`;
        const bLines = doc.splitTextToSize(bandText, contentWidth - 4);
        checkPageBreak(bLines.length * 4.5);
        doc.text(bLines, margin + 2, yPos);
        yPos += bLines.length * 4.5 + 1;
      });
    }

    if (p.topics) {
      p.topics.forEach((t) => {
        checkPageBreak(8);
        doc.setFont("helvetica", "bold");
        doc.text(`[${t.title}]`, margin + 2, yPos);
        yPos += 4.5;

        doc.setFont("helvetica", "normal");
        t.points.forEach((pt) => {
          const ptLines = doc.splitTextToSize(`• ${pt}`, contentWidth - 8);
          checkPageBreak(ptLines.length * 4.5);
          doc.text(ptLines, margin + 4, yPos);
          yPos += ptLines.length * 4.5 + 1;
        });
      });
    }

    yPos += 3;
  });

  // --- 05 CONTACT & BOARDING ---
  drawSectionHeader("05. Contact Us & Helplines");

  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...primaryColor);
  doc.text("IRCTC Tourist Facilitation Centre", margin, yPos);
  yPos += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("National Helpline: 1800-110-139 / 011-23345044", margin + 2, yPos);
  yPos += 4.5;
  doc.text("Email: tourism@irctc.com | Website: www.irctctourism.com", margin + 2, yPos);
  yPos += 6;

  if (detail.boarding && detail.boarding.length > 0) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("Boarding & De-Boarding Stations:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const stationList = detail.boarding.map((b) => `${b.station} (${b.code})`).join(" · ");
    const stationLines = doc.splitTextToSize(stationList, contentWidth - 4);
    doc.text(stationLines, margin + 2, yPos);
    yPos += stationLines.length * 4.5 + 4;
  }

  // --- FOOTERS ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text("IRCTC Tourism • Official Package Details", margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  }

  // Save the PDF
  const fileName = `${pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tour-details.pdf`;
  doc.save(fileName);
}
