import React from 'react';
import PropTypes from 'prop-types';
import './Cart.css';

const Cart = ({ count }) => {
  return (
    <button className="btn btn-warning m-1">
      <i className="bi bi-cart nav-item p-2"></i>
      <span>{count}</span>
    </button>
  )
};

Cart.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Cart;
