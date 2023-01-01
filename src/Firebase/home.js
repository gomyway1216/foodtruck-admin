import * as fbConnect from './firebaseConnect';
import { addDoc, collection, getDoc, getDocs, doc, Timestamp, query, updateDoc, where } from 'firebase/firestore'; 
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getImageRef = async (name) => {
  const storage = fbConnect.exportStorageAccess();
  const fileRef = await ref(storage, 'home/' + name);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

export const getMenuImageRef = async (file) => {
  const storage = fbConnect.exportStorageAccess();
  const fileRef = await ref(storage, 'menu/' + file.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

/**
 * @returns upcoming 7 days schedule
 */
export const getSchedule = async () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 7);
  const date1 = Timestamp.fromDate(today);
  const date2 = Timestamp.fromDate(tomorrow);
  const response = [];
  const q = query(collection(getDbAccess(), 'schedule'), where('startTime', '>=', date1), where('startTime', '<=', date2));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const schedule = {
      id: doc.id,
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      location: doc.data().location
    };
    response.push(schedule);
  });
  return response;
};

/**
 * @returns menu list
 */
export const getMenuTypeList = async () => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'menuType'));
  querySnapshot.forEach((doc) => {
    const menuType = {
      id: doc.id,
      name: doc.data().name
    };
    response.push(menuType);
  });
  return response;
};

export const getMenuList = async () => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'menu'));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const menuDoc = querySnapshot.docs[i];
    // const typeDocRef = doc(getDbAccess(), 'menuType', menuDoc.data().type);
    // const typeSnap = await getDoc(typeDocRef);
    const menu = {
      id: menuDoc.id,
      title: menuDoc.data().title,
      subTitle: menuDoc.data().subTitle,
      price: menuDoc.data().price,
      type: menuDoc.data().type,
      description: menuDoc.data().description,
      ingredients: menuDoc.data().ingredients,
      image: menuDoc.data().image,
      isVisibleToCustomer: menuDoc.data().isVisibleToCustomer,
      isAvailable: menuDoc.data().isAvailable
    };
    response.push(menu);
  }
  return response;
};

// this can be used in client side frontend
export const getPublicMenuList = async () => {
  const response = [];
  const q = query(collection(getDbAccess(), 'menu'), where('isVisibleToCustomer', '==', true));
  const querySnapshot = await getDocs(q);
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const menuDoc = querySnapshot.docs[i];
    // const docRef = doc(getDbAccess(), 'menuType', menuDoc.data().type);
    // const typeSnap = await getDoc(docRef);
    const menu = {
      id: menuDoc.id,
      title: menuDoc.data().title,
      subTitle: menuDoc.data().subTitle,
      price: menuDoc.data().price,
      type: menuDoc.data().type,
      description: menuDoc.data().description,
      ingredients: menuDoc.data().ingredients,
      image: menuDoc.data().image,
      isVisibleToCustomer: menuDoc.data().isVisibleToCustomer,
      isAvailable: menuDoc.data().isAvailable
    };
    response.push(menu);
  }
  return response;
};

export const updateMenu = async (item) => {
  const ref = doc(getDbAccess(), 'menu', item.id);
  const updateResult = await updateDoc(ref, {
    title: item.title,
    subTitle: item.subTitle,
    type: item.type,
    price: item.price,
    description: item.description,
    ingredients: item.ingredients,
    isVisibleToCustomer: item.isVisibleToCustomer,
    isAvailable: item.isAvailable,
    image: item.image
  });

  return updateResult;
};

export const addMenu = async (item) => {
  const docRef = await addDoc(collection(getDbAccess(), 'menu'), {
    title: item.title,
    subTitle: item.subTitle,
    type: item.type,
    price: item.price,
    description: item.description,
    ingredients: item.ingredients,
    isVisibleToCustomer: item.isVisibleToCustomer,
    isAvailable: item.isAvailable,
    image: item.image
  });
  return docRef.id;
};

export const getIngredientList = async () => {
  const response = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'ingredient'));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const ingredientDoc = querySnapshot.docs[i];
    const ingredient = {
      id: ingredientDoc.id,
      name: ingredientDoc.data().name
    };
    response.push(ingredient);
  }
  return response;
};