"use client";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  // Vercel эсвэл .env.local-аас түлхүүрийг унших
  const apiKey = process.env.NEXT_PUBLIC_D_ID_API_KEY;

  const generateVideo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const scriptText = e.target.script.value;

    try {
      // 1. POST Хүсэлт - Энд backtick ( ` ) ашигласан
      const response = await fetch("https://api.d-id.com/talks", {
        method: "POST",
        headers: {
  "Authorization": 'Basic ${apiKey}', // Энд заавал backtick ` байх ёстой'
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

      // 2. Статус шалгах - Энд бас backtick ( ` ) ашигласан
      const checkStatus = setInterval(async () => {
        const getRes = await fetch('https://api.d-id.com/talks/${data.id}',
          {headers: { "Authorization": 'Basic ${apiKey}' }
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
      }, 3000);

    } catch (err: any) {
      setError("Алдаа: " + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] shadow-2xl">
        <h1 className="text-3xl font-black text-yellow-400 italic mb-8 text-center uppercase tracking-tighter">AI AGENCY</h1>
        
        <form onSubmit={generateVideo} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold ml-2">Рекламны текст</label>
            <textarea 
              name="script" 
              required
              rows={3}
              className="w-full bg-black border border-zinc-800 p-5 rounded-3xl outline-none focus:border-yellow-400 transition text-sm"
              placeholder="Модельд хэлэх үгийг нь бичнэ үү..."
            />
          </div>

          <div className="bg-white p-5 rounded-3xl flex flex-col items-center justify-center border border-zinc-200 shadow-inner">
             <p className="text-[10px] text-black font-black mb-3 uppercase tracking-tighter">Төлбөр төлөх (9,900₮)</p>
             <div className="w-36 h-36 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/qr-code.png" 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                  onError={(e: any) => { e.currentTarget.src = "https://via.placeholder.com/150?text=QR+Missing"; }}
                />
             </div>
             <p className="text-[9px] text-zinc-500 mt-3 font-bold uppercase tracking-tight">Гүйлгээний утга: Өөрийн имэйл</p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-black py-5 rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition uppercase text-sm tracking-tight disabled:bg-zinc-800 disabled:text-zinc-600 shadow-xl shadow-yellow-400/10"
          >
            {loading ? "AI бичлэг бэлдэж байна..." : "Бичлэг үүсгэх"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-[10px] text-center font-bold uppercase">{error}</p>}

        {videoUrl && (
          <div className="mt-10 space-y-4 animate-in fade-in zoom-in duration-700 text-center">
            <video src={videoUrl} controls className="w-full rounded-3xl border-2 border-yellow-400 shadow-2xl" autoPlay />
            <a href={videoUrl} target="_blank" className="inline-block text-[10px] text-zinc-500 underline font-bold uppercase tracking-widest py-2">Бичлэгийг татаж авах</a>
          </div>
        )}
      </div>
    </main>
  );
}