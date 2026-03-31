"use client";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false); // Төлбөр төлөгдсөн эсэхийг хянах

  const apiKey = process.env.NEXT_PUBLIC_D_ID_API_KEY;

  const handlePayment = () => {
    // Энд чи ирээдүйд банкны API холбож болно. 
    // Одоохондоо хэрэглэгч QR уншуулаад "Төлбөр төлсөн" гэж дарахад ажиллахаар тохируулъя.
    setPaid(true);
    alert("Төлбөр баталгаажлаа. Одоо бичлэгээ үүсгэж болно.");
  };

  const generateVideo = async (e: any) => {
    e.preventDefault();
    if (!paid) {
      setError("Уучлаарай, эхлээд төлбөрөө төлнө үү!");
      return;
    }

    setLoading(true);
    setError("");
    const scriptText = e.target.script.value;

    try {
      const response = await fetch("https://api.d-id.com/talks", {
        method: "POST",
        headers: {
          "Authorization": 'Basic ${apiKey}',
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

      const checkStatus = setInterval(async () => {
        const getRes = await fetch('https://api.d-id.com/talks/${data.id}', {
          headers: { "Authorization": 'Basic ${apiKey}' }
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
        <h1 className="text-3xl font-black text-yellow-400 italic mb-8 text-center uppercase">AI AGENCY</h1>
        
        <form onSubmit={generateVideo} className="space-y-6">
          <textarea 
            name="script" 
            required
            className="w-full bg-black border border-zinc-800 p-5 rounded-3xl outline-none focus:border-yellow-400 text-sm"
            placeholder="Рекламны текстээ энд бичнэ үү..."
            rows={3}
          />

          {/* Төлбөрийн хэсэг */}
          <div className="bg-white p-6 rounded-3xl flex flex-col items-center justify-center border border-zinc-200">
             <p className="text-[12px] text-black font-black mb-4 uppercase tracking-tighter">Төлбөр төлөх (9,900₮)</p>
             <div className="w-40 h-40 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-200 shadow-inner">
                <img 
                  src="/qr-code.png" 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
             </div>
             <p className="text-[10px] text-zinc-500 mt-4 font-bold uppercase">Гүйлгээний утга: Өөрийн имэйл</p>
             
             {!paid ? (
               <button 
                 type="button"
                 onClick={handlePayment}
                 className="mt-4 bg-black text-white text-[10px] px-6 py-2 rounded-full font-bold hover:bg-zinc-800 transition"
               >
                 Төлбөр төлсөн гэдгээ баталгаажуулах
               </button>
             ) : (
               <p className="mt-4 text-green-600 text-[10px] font-bold uppercase">✓ Төлбөр баталгаажсан</p>
             )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !paid}
            className="w-full bg-yellow-400 text-black font-black py-5 rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition uppercase text-sm disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {loading ? "Бичлэг бэлдэж байна..." : paid ? "Бичлэг үүсгэх" : "Эхлээд төлбөрөө төлнө үү"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-[10px] text-center font-bold uppercase">{error}</p>}

        {videoUrl && (
          <div className="mt-10 space-y-4 text-center animate-in fade-in zoom-in">
            <video src={videoUrl} controls className="w-full rounded-3xl border-2 border-yellow-400 shadow-2xl" />
            <a href={videoUrl} download className="inline-block bg-zinc-800 text-white text-[10px] px-8 py-3 rounded-full font-bold uppercase tracking-widest">Татаж авах</a>
          </div>
        )}
      </div>
    </main>
  );
}