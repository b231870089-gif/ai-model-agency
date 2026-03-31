"use client";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const generateVideo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const scriptText = e.target.script.value;

    // МАНАЙ API KEY ЭНД
    const apiKey = "YjIzMTg3MDA4OUBnbWFpbC5jb20:o10Dtzr_3-9nUVeIdLTRl"; 

    try {
      // 1. Бичлэг хийх хүсэлт илгээх
      const response = await fetch("https://api.d-id.com/talks", {
        method: "POST",
        headers: {
          "Authorization": Basic ${apiKey},
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script: {
            type: "text",
            input: scriptText,
            provider: { type: "microsoft", voice_id: "mn-MN-BatchBold" }
          },
          source_url: "https://create-images-results.d-id.com/api_docs/assets/noelle.png",
          config: { fluent: "false", pad_audio: "0" }
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "API Алдаа");

      // 2. Бичлэг бэлэн болохыг хүлээж шалгах (Polling)
      const checkStatus = setInterval(async () => {
        const getRes = await fetch(https://api.d-id.com/talks/${data.id}, {
          headers: { "Authorization": Basic ${apiKey} }
        });
        const finalData = await getRes.json();
        
        if (finalData.status === "completed") {
          setVideoUrl(finalData.result_url);
          setLoading(false);
          clearInterval(checkStatus);
        } else if (finalData.status === "error") {
          setError("Бичлэг хийхэд алдаа гарлаа.");
          setLoading(false);
          clearInterval(checkStatus);
        }
      }, 3000); // 3 секунд тутамд шалгана

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] shadow-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-yellow-400 italic leading-none">AI MODEL</h1>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Automatic Video Agency</p>
        </div>
        
        <form onSubmit={generateVideo} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold ml-2">Рекламны текст</label>
            <textarea 
              name="script" 
              required
              rows={4}
              className="w-full bg-black border border-zinc-800 p-5 rounded-3xl outline-none focus:border-yellow-400 transition text-sm"
              placeholder="Миний AI модельд хэлэх үгийг нь бичиж өгнө үү..."
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-black py-5 rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition uppercase text-sm tracking-tight disabled:bg-zinc-700"
          >
            {loading ? "AI бичлэг бэлдэж байна..." : "Бичлэг үүсгэх"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-xs text-center">{error}</p>}

        {videoUrl && (
          <div className="mt-10 space-y-4 animate-in fade-in zoom-in duration-700">
            <video src={videoUrl} controls className="w-full rounded-3xl border-2 border-yellow-400 shadow-2xl" autoPlay />
            <a href={videoUrl} download className="block text-center text-xs text-zinc-500 underline">Бичлэгийг татаж авах</a>
          </div>
        )}
      </div>
    </main>
  );
}