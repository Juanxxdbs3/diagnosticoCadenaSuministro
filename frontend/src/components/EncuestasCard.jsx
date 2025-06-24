import { useNavigate } from "react-router-dom";

export function EncuestasCard(props) {
  const { title } = props;
  const navigate = useNavigate();

  function handleClick() {
    navigate("/dashboard");
  };

  return (
    <div onClick={handleClick} className="border border-[#cbd5e1] bg-white shadow-md w-64 h-40 p-4 flex flex-col justify-between rounded-lg hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h3 className="text-[#1e293b] font-semibold text-lg">{title}</h3>
      </div>
    </div>
  );
}