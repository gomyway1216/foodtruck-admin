import React from 'react';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import * as emailUtil from '../../Util/emailUtil';
import PropTypes from 'prop-types';
import './email.scss';


const EmailButton = ({ email }) => {

  // Function to handle email click
  const handleEmailClick = (email) => {
    const subject = encodeURIComponent('Subject for the email');
    const body = encodeURIComponent('Hello,');
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  // Define the placeholder with the same dimensions as the IconButton
  const emailButtonPlaceholder = (
    <div className="email-button-placeholder"></div>
  );

  // Return either the IconButton or the placeholder based on the email validity
  return emailUtil.isValidEmail(email) ? (
    <IconButton edge="end" aria-label="email"
      onClick={() => handleEmailClick(email)} className="feedback-email">
      <EmailIcon />
    </IconButton>
  ) : emailButtonPlaceholder;
};

EmailButton.propTypes = {
  email: PropTypes.string
};

export default EmailButton;