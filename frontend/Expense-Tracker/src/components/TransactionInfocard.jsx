import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  return (
    <div className="group relative flex items-center gap-4 mt-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-primary-dark">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex-1">
        <p className="text-base font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      <div className="flex items-center gap-2">
        {!hideDeleteBtn && (
          <button
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
            type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <h6 className="text-base font-semibold">
            {type === "income" ? "+" : "-"} ₹{Number(amount).toLocaleString("en-IN")}
          </h6>
          {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
