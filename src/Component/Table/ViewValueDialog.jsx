import React from 'react';
import { Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PropTypes from 'prop-types';

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toLocaleString([], { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  return date;
};

const ViewValueDialog = ({ open, onClose, item }) => (
  <Dialog open={open} onClose={onClose} 
    aria-labelledby="view-value-dialog-title" fullWidth maxWidth="sm">
    <DialogTitle id="view-value-dialog-title">Detail View</DialogTitle>
    <DialogContent dividers>
      <List>
        {item && Object.keys(item).map((key, index) => {
          const value = item[key];
          let displayValue = '';

          if (value === undefined || value === null) {
            displayValue = 'Empty'; // Placeholder for undefined or null values
          } else if (key === 'creationTime' && value instanceof Date) {
            displayValue = formatDate(value);
          } else {
            displayValue = value.toString();
          }

          return (
            <React.Fragment key={key}>
              <ListItem>
                <ListItemText primary={key} secondary={displayValue} />
              </ListItem>
              {index < Object.keys(item).length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

ViewValueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object
};

export default ViewValueDialog;
