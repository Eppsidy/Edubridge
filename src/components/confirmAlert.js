import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // required CSS

const handleDelete = () => {
  confirmAlert({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to remove this item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          // perform delete
        }
      },
      {
        label: 'No',
        onClick: () => {} // do nothing
      }
    ]
  });
};
