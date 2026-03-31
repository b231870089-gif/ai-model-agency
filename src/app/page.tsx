"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const generateVideo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVideoUrl("");

    const scriptText = e.target.script.value;

    if (!scriptText.trim()) {
      setError("Текст хоосон байна");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ script: scriptText })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 🔁 polling
      const checkStatus = async () => {
        const statusRes = await fetch(/api/status/${data.id});
        const statusData = await statusRes.json();

        if (statusData.status === "completed") {
          setVideoUrl(statusData.result_url);
          setLoading(false);
        } else if (statusData.status === "error") {
          setError("Video үүсгэхэд алдаа гарлаа");
          setLoading(false);
        } else {
          setTimeout(checkStatus, 3000);
        }
      };

      checkStatus();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-[30px] border border-zinc-800 shadow-2xl">
        
        <h1 className="text-3xl font-black text-yellow-400 mb-2 italic">
          AI AGENCY
        </h1>

        <p className="text-zinc-500 text-xs mb-6">
          Automatic Video Generator
        </p>

        <form onSubmit={generateVideo} className="space-y-6">
          <textarea
            name="script"
            placeholder="Энд текстээ бич..."
            className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-4 rounded-2xl"
          >
            {loading ? "⏳ Бэлдэж байна..." : "🎥 БИЧЛЭГ ҮҮСГЭХ"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {videoUrl && (
          <div className="mt-6 space-y-4">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-xl border border-yellow-400"
            />
            <a
              href={videoUrl}
              target="_blank"
              className="block text-center text-sm underline"
            >
              Татаж авах
            </a>
          </div>
        )}

      </div>
    </main>
  );
}