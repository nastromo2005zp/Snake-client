import React from 'react';

const Cell = (props) => {
    return (
    <div className={`cell ${props.type}`}></div>
    );
};

export default Cell;