import React,{ useState } from 'react';
import { List, ListItem, IconButton, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 
import CheckIcon from '@mui/icons-material/Check';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import ViewValueDialog from '../Table/ViewValueDialog';
import './feedback-list.scss';

const FeedbackList = ({ valueList }) => {
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleItemClick = (item) => {
    setDialogItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogItem(null);
  };

  // Function to determine the color or icon for time urgency
  const getTimeUrgencyIndicator = (email, creationTime, hasResponded) => {
    const iconPlaceholder = <div className="icon-placeholder"></div>;

    if(!isValidEmail(email)) {
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

  const renderEmailButton = (email, item) => {
    // Define the placeholder with the same dimensions as the IconButton
    const emailButtonPlaceholder = (
      <div className="email-button-placeholder"></div>
    );
  
    // Return either the IconButton or the placeholder based on the email validity
    return isValidEmail(email) ? (
      <IconButton edge="end" aria-label="email" 
        onClick={() => handleEmailClick(email, item)} className="feedback-email">
        <EmailIcon />
      </IconButton>
    ) : emailButtonPlaceholder;
  };

  const isValidEmail = (email) => {
    // This regular expression covers most common email patterns
    // eslint-disable-next-line max-len
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle email click
  const handleEmailClick = (email, item) => {
    const subject = encodeURIComponent('Subject for the email');
    const body = encodeURIComponent('Hello,');
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  // Function to render stars for the rating
  const renderRating = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 
        <StarIcon key={i} className="rating-star" /> 
        : <StarOutlineIcon key={i} className="rating-star" />);
    }
    return <div className="rating">{stars}</div>;
  };

  return (
    <>
      <List dense className="feedback-list">
        {valueList.map((item) => (
          <ListItem className="list-item" key={item.id} onClick={() => handleItemClick(item)}>
            <div className="feedback-content">
              <div className="feedback-header">
                <Typography variant="subtitle1" className="feedback-name">{item.name}</Typography>
                <div className="feedback-title-actions">
                  {renderRating(item.rating)}
                  {getTimeUrgencyIndicator(item.email, item.creationTime, item.hasResponded)}
                </div>
              </div>
              <Typography variant="body2" color="textSecondary" className="feedback-title">{item.title}</Typography>
              <Typography variant="body2" 
                color="textSecondary" className="feedback-body">{item.body}</Typography>
              <div className="feedback-bottom-row">
                <div className="feedback-details">
                  <Typography variant="body2" 
                    color="textSecondary" className="feedback-location">{item.eventLocation}</Typography>
                  <Typography variant="body2" color="textSecondary" className="feedback-time">
                    {new Date(item.creationTime).toLocaleString([], {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      hour12: true
                    })}
                  </Typography>
                </div>
                {renderEmailButton(item.email, item)}
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <ViewValueDialog open={dialogOpen} onClose={handleDialogClose} item={dialogItem} />
    </>
  );
};

FeedbackList.propTypes = {
  valueList: PropTypes.array.isRequired,
};

export default FeedbackList;

