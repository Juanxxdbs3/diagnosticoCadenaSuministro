import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();

  const back = () => {
    // Aquí podrías eliminar token si usas JWT
    navigate("/encuestas");
  };
  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1e293b]">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button onClick={back} className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Back</button>
        <button className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Logout</button>
      </div>
    </header>
  );
}