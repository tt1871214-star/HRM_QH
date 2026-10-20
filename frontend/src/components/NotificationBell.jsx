// src/components/NotificationBell.jsx
import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const navigate = useNavigate();
  // Giả sử có 3 thông báo mới, sau này bạn lấy từ notificationService
  const count = 3; 

  return (
    <div 
      className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-all"
      onClick={() => navigate('/notifications')}
    >
      <Bell size={22} className="text-slate-600" />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          {count}
        </span>
      )}
    </div>
  );
}