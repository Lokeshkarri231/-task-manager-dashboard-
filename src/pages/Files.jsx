import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Files() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getFiles();
  }, []);

  async function uploadFile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const fileName = `${user.id}-${file.name}`;

    await supabase.storage
      .from("files")
      .upload(fileName, file);

    const { data } = supabase.storage
      .from("files")
      .getPublicUrl(fileName);

    await supabase.from("files").insert({
      user_id: user.id,
      file_name: file.name,
      file_url: data.publicUrl,
    });

    getFiles();
  }

  async function getFiles() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setFiles(data || []);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Files</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadFile}>
        Upload
      </button>

      <h3>Your Files</h3>

      {files.map((f) => (
        <div key={f.id}>
          <a href={f.file_url} target="_blank">
            {f.file_name}
          </a>
        </div>
      ))}
    </div>
  );
}

export default Files;