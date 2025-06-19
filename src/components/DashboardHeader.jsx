export function DashboardHeader() {
  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1e293b]">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 border-2 border-[#1e293b] rounded hover:bg-[#e2e8f0] transition"></button>
        <div className="w-8 h-8 border-4 border-[#1e293b] rounded-full"></div>
        <span className="text-sm text-[#1e293b]">Back</span>
        <span className="text-sm text-[#1e293b]">Logout</span>
      </div>
    </header>
  );
}