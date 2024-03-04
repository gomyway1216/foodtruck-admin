import * as fbConnect from './firebaseConnect';
import { collection, getDocs, query } from 'firebase/firestore';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getFeedbackList = async () => {
  const response = [];
  const q = query(collection(getDbAccess(), 'feedback'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const feedback = {
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      title: doc.data().title,
      body: doc.data().body,
      rating: doc.data().rating,
      creationTime: doc.data().creationTime.toDate(),
      eventLocation: doc.data().eventLocation,
      hasResponded: doc.data().hasResponded,
      tags: doc.data().tags
    };
    response.push(feedback);
  });
  return response;
};

export const getFeedbackTypeList = async () => {
  const response = [];
  const q = query(collection(getDbAccess(), 'feedbackType'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const feedbackType = {
      id: doc.id,
      name: doc.data().name
    };
    response.push(feedbackType);
  });
  return response;
};