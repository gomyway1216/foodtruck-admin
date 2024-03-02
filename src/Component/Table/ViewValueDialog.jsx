import React from 'react';
import { Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PropTypes from 'prop-types';

const ViewValueDialog = ({ open, onClose, item }) => (
  <Dialog open={open} onClose={onClose} 
    aria-labelledby="view-value-dialog-title" fullWidth maxWidth="sm">
    <DialogTitle id="view-value-dialog-title">Detail View</DialogTitle>
    <DialogContent dividers>
      <List>
        {item && Object.keys(item).map((key, index) => (
          <React.Fragment key={key}>
            <ListItem>
              <ListItemText primary={key} secondary={item[key]} />
            </ListItem>
            {index < Object.keys(item).length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
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
