export function Header() {
  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1e293b]">Encuestas</h1>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1e293b] rounded-full"></div>
        <span className="text-sm text-[#1e293b]">Logout</span>
      </div>
    </header>
  );
}