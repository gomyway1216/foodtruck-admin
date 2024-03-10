import React from 'react';
import PropTypes from 'prop-types';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import './rating.scss';

const Rating = ({ rating }) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating ?
      <StarIcon key={i} className="rating-star" />
      : <StarOutlineIcon key={i} className="rating-star" />);
  }
  return <div className="rating">{stars}</div>;
};

Rating.propTypes = {
  rating: PropTypes.number.isRequired
};

export default Rating;