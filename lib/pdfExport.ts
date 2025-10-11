import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

/**
 * Export HTML element to PDF
 */
export async function exportElementToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'export.pdf',
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions
    const imgWidth = format === 'a4' ? 210 : 216; // A4: 210mm, Letter: 216mm
    const pageHeight = format === 'a4' ? 297 : 279; // A4: 297mm, Letter: 279mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF(orientation, 'mm', format);
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}

/**
 * Export post/page content to PDF
 */
export async function exportPostToPDF(
  title: string,
  content: string,
  author?: string,
  date?: string
): Promise<void> {
  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Add SUCCESS branding
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUCCESS', margin, yPosition);
  yPosition += 15;

  // Add title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8;

  // Add metadata
  if (author || date) {
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);

    if (author) {
      pdf.text(`By ${author}`, margin, yPosition);
      yPosition += 6;
    }

    if (date) {
      pdf.text(date, margin, yPosition);
      yPosition += 6;
    }

    pdf.setTextColor(0);
  }

  // Add separator line
  yPosition += 10;
  pdf.setDrawColor(211, 47, 47); // SUCCESS red
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Add content
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  // Strip HTML tags for plain text export
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  const contentLines = pdf.splitTextToSize(plainText, contentWidth);

  for (let i = 0; i < contentLines.length; i++) {
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.text(contentLines[i], margin, yPosition);
    yPosition += 7;
  }

  // Add footer with page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(150);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  pdf.save(filename);
}

/**
 * Export image with metadata to PDF
 */
export async function exportImageToPDF(
  imageUrl: string,
  title: string,
  metadata?: Record<string, string>
): Promise<void> {
  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 20;

  let yPosition = margin;

  // Add title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, margin, yPosition);
  yPosition += 15;

  try {
    // Load and add image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Calculate image dimensions to fit page
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = 200;
    let imgWidth = maxWidth;
    let imgHeight = (img.height * maxWidth) / img.width;

    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = (img.width * maxHeight) / img.height;
    }

    // Center image
    const xPosition = (pageWidth - imgWidth) / 2;

    pdf.addImage(img, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 15;

    // Add metadata
    if (metadata) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      for (const [key, value] of Object.entries(metadata)) {
        if (value) {
          pdf.text(`${key}: ${value}`, margin, yPosition);
          yPosition += 7;
        }
      }
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }

  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  pdf.save(filename);
}

/**
 * Export magazine cover to PDF
 */
export async function exportMagazineCoverToPDF(
  coverUrl: string,
  title: string,
  issueInfo?: string
): Promise<void> {
  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = coverUrl;
    });

    // Calculate dimensions to fill page (magazine cover style)
    const aspectRatio = img.width / img.height;
    let imgWidth = pageWidth;
    let imgHeight = pageWidth / aspectRatio;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = pageHeight * aspectRatio;
    }

    // Center on page
    const xPosition = (pageWidth - imgWidth) / 2;
    const yPosition = (pageHeight - imgHeight) / 2;

    pdf.addImage(img, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);

    // Add info on second page if provided
    if (issueInfo) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, 20, 30);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(issueInfo, 20, 45);
    }
  } catch (error) {
    console.error('Error loading cover image:', error);
  }

  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cover.pdf`;
  pdf.save(filename);
}
