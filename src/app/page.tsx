export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-20 flex flex-col items-center">
      <nav className="w-full max-w-4xl flex justify-between items-center mb-16">
        <div className="text-2xl font-black italic tracking-tighter">AI.MODEL.MN</div>
        <div className="text-[10px] font-bold bg-yellow-400 text-black px-3 py-1 rounded-full uppercase">Alpha Version</div>
      </nav>

      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight italic">
            РЕКЛАМАНД <br /> <span className="text-yellow-400">МОДЕЛЬ</span> <br /> ХЭРЭГГҮЙ.
          </h1>
          <p className="text-gray-400 text-lg">
            Барааныхаа зургийг оруулаад, текстээ бич. Манай AI модель 5 минутад таны өмнөөс яриад өгнө.
          </p>
        </div>

        <div className="flex-1 w-full bg-[#111] p-8 rounded-[40px] border border-gray-800 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-2">1. Барааны зураг (Image)</label>
              <input type="file" className="w-full bg-black border border-gray-800 p-3 rounded-2xl text-xs" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-2">2. Рекламны текст (Script)</label>
              <textarea 
                rows={4} 
                className="w-full bg-black border border-gray-800 p-4 rounded-2xl outline-none focus:border-yellow-400 text-sm transition"
                placeholder="Сайн байна уу, энэ бол манай шинэ загвар..."
              />
            </div>

            <div className="bg-gray-900/30 p-6 rounded-3xl border border-dashed border-gray-700 text-center">
               <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">Төлбөр төлөх (9,900₮)</p>
               <div className="w-32 h-32 bg-white/10 mx-auto rounded-2xl flex items-center justify-center border border-white/5">
                 <span className="text-[10px] text-gray-500 italic font-medium text-center px-4 leading-tight">Төлбөрийн QR энд байрлана</span>
               </div>
            </div>

            <button className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition uppercase text-xs tracking-widest">
              Бичлэг захиалах
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-gray-600 text-[9px] tracking-[4px] uppercase font-medium">
        © 2026 AI.MODEL.MN - Next Gen Marketing
      </footer>
    </main>
  );
}