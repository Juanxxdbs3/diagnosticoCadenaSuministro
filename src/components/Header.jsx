export function Header() {
  return (
    <header className="w-full border-b border-black flex items-center justify-between px-4 py-2">
      <h1 className="text-xl font-semibold text-[#8B1C1C]">Encuestas</h1>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border-4 border-[#8B1C1C] rounded-full"></div>
        <span className="text-xs">Logout</span>
      </div>
    </header>
  );
}