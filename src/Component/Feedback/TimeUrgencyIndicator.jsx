import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import * as emailUtil from '../../Util/emailUtil';
import PropTypes from 'prop-types';
import './time-urgency-indicator.scss';

const TimeUrgencyIndicator = ({ email, creationTime, hasResponded }) => {
  const iconPlaceholder = <div className="icon-placeholder"></div>;

  if (!emailUtil.isValidEmail(email)) {
    return iconPlaceholder;
  }

  if (hasResponded) {
    return <CheckIcon className="responded-indicator" />;
  }

  const currentTime = new Date();
  const creationDate = new Date(creationTime);
  const hoursPassed = (currentTime - creationDate) / (1000 * 60 * 60);

  if (hoursPassed > 24) {
    return <AccessTimeIcon className="overdue-indicator" />;
  } else if (hoursPassed > 12) {
    return <AccessTimeIcon className="urgent-indicator" />;
  } else {
    return <AccessTimeIcon className="normal-indicator" />;
  }
};

TimeUrgencyIndicator.propTypes = {
  email: PropTypes.string,
  creationTime: PropTypes.instanceOf(Date),
  hasResponded: PropTypes.bool
};

export default TimeUrgencyIndicator;