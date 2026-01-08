import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import FileSaver from "file-saver";

export const generateDocx = (text: string) => {
  // Split text by newlines to create paragraphs
  const lines = text.split('\n');
  
  const children = lines.map(line => {
    // Basic heuristic for headings (can be improved)
    if (line.toUpperCase() === line && line.length > 3 && line.length < 50) {
       return new Paragraph({
        text: line,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      });
    }
    
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: "Calibri",
          size: 22, // 11pt
        }),
      ],
      spacing: { after: 100 },
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
            new Paragraph({
                text: "Optimized Resume",
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 300 }
            }),
            ...children
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    FileSaver.saveAs(blob, "Optimized_Resume.docx");
  });
};