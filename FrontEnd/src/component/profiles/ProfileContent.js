import React, { useState } from 'react';
import ContentArea from './ContentArea';

export default function ProfileContent() {

  const menuItems = [
    { label: 'Home', content: 'Home 컨텐츠' },
    { label: 'Idea', content: 'Idea 컨텐츠' },
    { label: 'Supporter', content: 'Supporter 컨텐츠' },
  ];
  
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="profile-container">
      {/* 사이드바 */}
      <div className="sidebar">
        <ul>
          {menuItems.map((menu, index) => (
            <li key={index} onClick={() => handleMenuClick(menu)}>
              {menu.label}
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 컨텐츠 영역 */}
      <ContentArea content={selectedMenu.content} />
    </div>
  );
}
