import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Documents() {
  const [fileUrl, setFileUrl] = useState("");
  const [numPages, setNumPages] = useState(null);

  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    setFileUrl(data.publicUrl);
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Documents</h2>

      <input type="file" onChange={uploadFile} />

      {fileUrl && (
        <div style={{ marginTop: "20px" }}>
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
}

export default Documents;