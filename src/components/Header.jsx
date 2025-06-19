export function Header() {
  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1e293b]">Encuestas</h1>
      <div className="flex items-center gap-3">
        <button className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Logout</button>
      </div>
    </header>
  );
}