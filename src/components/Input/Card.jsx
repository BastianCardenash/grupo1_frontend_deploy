import React from 'react';

const Card = ({ title, content, icon }) => (
  <div className='card'>
    <h2>{title}</h2>
    <p>{content}</p>
    <div className='card-icon-container'>
      {icon && React.createElement(icon)}
    </div>
  </div>
);

export default Card;