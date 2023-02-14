import * as fbConnect from './firebaseConnect';
import { addDoc, collection, deleteDoc, getDoc, getDocs, doc, Timestamp, 
  query, updateDoc, where } from 'firebase/firestore'; 

const DOC_ID_MISSING_ERR_MSG = 'Data is not saved correctly in server.'
        + ' Document id is not returned.';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getSchedule = async (eventId) => {
  const docRef = query(collection(getDbAccess(), 'schedule'), 
    where('eventId', '==', eventId));
  const querySnapshot = await getDocs(docRef);
  if(querySnapshot.docs.length !== 1) {
    throw new Error('Querying data with eventId: ' + eventId + 'is invalid!');
  }
  return querySnapshot.docs[0];
};

export const getScheduleForWeek = async () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 7);
  const date1 = Timestamp.fromDate(today);
  const date2 = Timestamp.fromDate(tomorrow);
  const response = [];
  const q = query(collection(getDbAccess(), 'schedule'), 
    where('start', '>=', date1), where('start', '<=', date2));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const schedule = {
      id: doc.id,
      event_id: doc.data().eventId,
      title: doc.data().title,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
      location: doc.data().location,
      mapUrl: doc.data().mapUrl,
      description: doc.data().description,
      disabled: doc.data().disabled,
      color: doc.data().color,
      editable: doc.data().editable,
      deletable: doc.data().deletable
    };
    response.push(schedule);
  });
  return response;
};

export const getScheduleWithRange = async (dateRange) => {
  const date1 = Timestamp.fromDate(dateRange.start);
  const date2 = Timestamp.fromDate(dateRange.end);
  const response = [];
  const q = query(collection(getDbAccess(), 'schedule'), 
    where('start', '>=', date1), where('start', '<=', date2));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const schedule = {
      id: doc.id,
      event_id: doc.data().eventId,
      title: doc.data().title,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
      location: doc.data().location,
      mapUrl: doc.data().mapUrl,
      description: doc.data().description,
      disabled: doc.data().disabled,
      color: doc.data().color,
      editable: doc.data().editable,
      deletable: doc.data().deletable
    };
    response.push(schedule);
  });
  return response;
};

export const addSchedule = async (item) => {
  console.log('addSchedule item', item);
  const insertingSchedule = {
    eventId: item.event_id,
    title: item.title,
    start: item.start,
    end: item.end,
    location: item.location,
    mapUrl: item.mapUrl,
    description: item.description
  };

  if(item.disabled) {
    insertingSchedule.disabled = item.disabled;
  }

  if(item.color) {
    insertingSchedule.color = item.color;
  }

  if(item.editable) {
    insertingSchedule.editable = item.editable;
  }

  if(item.deletable) {
    insertingSchedule.deletable = item.deletable;
  }

  const docRef = await addDoc(collection(getDbAccess(), 'schedule'), 
    insertingSchedule);

  if (!docRef.id) {
    throw new Error(DOC_ID_MISSING_ERR_MSG);
  }
};

export const updateSchedule = async (item) => {
  console.log('updateSchedule item', item);
  const updatingSchedule = {
    eventId: item.event_id,
    title: item.title,
    start: item.start,
    end: item.end,
    location: item.location,
    mapUrl: item.mapUrl,
    description: item.description
  };

  if(item.disabled) {
    updatingSchedule.disabled = item.disabled;
  }

  if(item.color) {
    updatingSchedule.color = item.color;
  }

  if(item.editable) {
    updatingSchedule.editable = item.editable;
  }

  if(item.deletable) {
    updatingSchedule.deletable = item.deletable;
  }


  const ref = doc(getDbAccess(), 'schedule', item.id);
  await updateDoc(ref, updatingSchedule);
};

export const deleteSchedule = async (eventId) => {
  const deletingDoc = await getSchedule(eventId);
  const docId = deletingDoc.id;
  await deleteDoc(doc(getDbAccess(), 'schedule', docId));
};