import * as fbConnect from './firebaseConnect';
import { addDoc, collection, getDoc, getDocs, doc, Timestamp, 
  query, updateDoc, where } from 'firebase/firestore'; 
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as dateUtil from '../Util/dateUtil';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getDailySummaryList = async (id) => {
  const response = [];
  const querySnapshot = await getDocs(collection(
    getDbAccess(), 'menu', id, 'history'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const summaryDoc = querySnapshot.docs[i];
    const dailySummary = {
      id: summaryDoc.id,
      date: summaryDoc.data().date,
      costPerCount: summaryDoc.data().costPerCount,
      soldCount: summaryDoc.data().soldCount, 
      canceledCount: summaryDoc.data().canceledCount,
      price: summaryDoc.data().price
    };
    response.push(dailySummary);
  }
  return response;
};

export const getDailySummaryForAll = async () => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'menu'));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const dailySummaryList = [];
    const menuDoc = querySnapshot.docs[i];
    const querySnapshotForSummary = await getDocs(collection(
      getDbAccess(), 'menu', menuDoc.id, 'history'));
    for (let j = 0; j < querySnapshotForSummary.docs.length; j++) {
      const summaryDoc = querySnapshotForSummary.docs[i];
      const dailySummary = {
        id: summaryDoc.id,
        date: summaryDoc.data().date,
        cost: summaryDoc.data().cost,
        soldCount: summaryDoc.data().soldCount, 
        canceledCount: summaryDoc.data().canceledCount,
        price: summaryDoc.data().price
      };
      dailySummaryList.push(dailySummary);
    }
    response.push(dailySummaryList);
  }

  return response;
};

export const addSummary = async (id) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'menu', id));
  if (!querySnapshot.exists()) {
    throw new Error('adding summary is failing: ' + id);
  }
  
  const docRef = await addDoc(collection(getDbAccess(), 'menu', 
    menuDoc.id, 'history'), {
    date: dateUtil.getToday(),
    price: querySnapshot.data().price,
    cost: querySnapshot.data().cost,
    soldCount: querySnapshot.data().soldCount, 
    canceledCount: querySnapshot.data().canceledCount
  });

  if(!docRef.id) {
    throw new Error('adding summary is failing: ' + id);
  }
};


// flushes once a day
export const addSummaryForAll = async () => {
  // go through the menu list, take the daily data, create history entry
  // with them, insert that to history list, and clear the daily data in menu
  const querySnapshot = await getDocs(collection(getDbAccess(), 'menu'));
  const RETRY_LIMIT = 10;
  const retry = 0;
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const menuDoc = querySnapshot.docs[i];
    let addSummarySuccess = false;
    while(!addSummarySuccess) {
      const docRef = await addDoc(collection(getDbAccess(), 'menu', 
        menuDoc.id, 'history'), {
        date: dateUtil.getToday(),
        price: menuDoc.data().price,
        cost: menuDoc.data().cost,
        soldCount: menuDoc.data().soldCount, 
        canceledCount: menuDoc.data().canceledCount
      });
      if (docRef.id) {
        addSummarySuccess = true;
      } else {
        retry++;
        if(retry >= RETRY_LIMIT) {
          throw new Error ('adding summary is failing for: '
           + querySnapshot.id);
        }
      }
    }
  }
};