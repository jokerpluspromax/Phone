import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function PhoneCard({ phone, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title">
          📞 {phone.phone_number}
        </h5>
        <p className="card-text">
          📝 {phone.department_name}
        </p>
        <p className="card-text">
          Vị trí: {phone.location}
        </p>
        <p className="ml-2">
          {phone.users && phone.users.split(', ').map((user, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span>👤</span>
              <span>{user}</span>
            </div>
          ))}
        </p>

        {isAdmin && (
          <div className="mt-3">
            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(phone)}>Sửa</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(phone.id)}>Xóa</button>
          </div>
        )}
      </div>
    </div>


  );

  /*return (
    <div
      className="card w-72 h-40 bg-white shadow-md rounded-lg p-4 flex flex-col justify-between relative"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{phone.phone_number}</h2>
          <p className="text-sm text-gray-600">{phone.location}</p>
          <p className="text-sm text-gray-600">{phone.department_name}</p>
        </div>

        <div className="text-right text-sm text-gray-700">
          {phone.users && phone.users.split(', ').map((user, index) => (
            <div key={index}>{user}</div>
          ))}
        </div>
        
      </div>
    </div>
  );*/
};

export default PhoneCard;
