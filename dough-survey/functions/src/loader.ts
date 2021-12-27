import {initializeApp} from "@firebase/app";
import {getFirestore} from "@firebase/firestore";
import {doc, getDoc} from "@firebase/firestore";
import * as firebaseAdmin from "firebase-admin";
// import haversine from "haversine";

const firebaseConfig = {
  apiKey: "AIzaSyBTuC8MUuBtZtCnP9YJh8BgRuUJMS687Jw",
  authDomain: "dough-survey.web.app",
  databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dough-survey",
  storageBucket: "dough-survey.appspot.com",
  messagingSenderId: "111678578513",
  appId: "1:111678578513:web:32f35f3eb65cfb2f19bd70",
  measurementId: "G-VS98EGYRJL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

/**
 * getUserId
 *
 * @param  {string} userToken
 * @return {Promise<String>}
 */
async function getUserId(userToken: string): Promise<string> {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(userToken);
    const uid = decodedToken.uid;
    return uid.toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * getInfoBase
 *
 * @param  {string} infotype
 * @param  {string} Id
 * @return {Promise<any>}
 */
async function getInfoBase(infotype: string, Id:string): Promise<any> {
  try {
    if (infotype === "user" || infotype === "place" || infotype === "station") {
      const docRef = doc(db, `${infotype}_db`, Id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(`returning ${infotype} data: ${Id}`);
        return docSnap.data();
      } else {
        console.log(`No such document: ${Id}`);
      }
    } else {
      console.log("Not implemented types");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getUserInfo
 *
 * @param  {string} userId
 * @return {Promise<any>}
 */
function getUserInfo(userId: string) {
  try {
    return getInfoBase("user", userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getStationInfo
 *
 * @param  {string} stationId
 * @param  {string} category
 * @param {Array} tags
 * @param  {string} userToken
 * @return {Promise<any>}
 */
async function getStationInfo(stationId: string, category: string,
    tags: Array<string>, userToken: string) {
  try {
    if (category === "음식점") {
      category = "0";
    } else if (category === "카페") {
      category = "1";
    } else if (category === "술집") {
      category = "2";
    }
    if (userToken === "default") {
      return getInfoBase("station", `${stationId}_${category}`);
    } else {
      const userId = await getUserId(userToken);
      const userInfo = await getInfoBase("user", userId);
      return getInfoBase("station", `${stationId}_${category}`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getPlaceInfo
 *
 * @param  {string} stationId
 * @param  {string} placeId
 * @return {Promise<any>}
 */
async function getPlaceInfo(stationId: string, placeId: string) {
  try {
    const stationData = await getInfoBase("station", stationId);
    const placeData = await getInfoBase("place", placeId);
    const stationCoor: coordinate = {lon: stationData.station_coor_x,
      lat: stationData.station_coor_y};
    const placeCoor: coordinate = {lon: placeData.place_coor_x,
      lat: placeData.place_coor_y};
    const distance = haversineDistance(stationCoor, placeCoor);
    console.log(`getPlaceInfo: ${JSON.stringify(stationData)},
      ${JSON.stringify(placeData)}`);
    console.log(`distance: ${distance}`);
    return {placeData: placeData, distance: distance};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface coordinate {
  lon: number,
  lat: number
}

/**
 * haversineDistance
 *
 * @param  {coordinate} coords1
 * @param  {coordinate} coords2
 * @return {Promise<any>}
 */
function haversineDistance(coords1: coordinate, coords2:coordinate) {
  /**
    * deg to rad
    * @param  {number} x
    * @return {number}
    */
  function toRad(x: number) {
    return x * Math.PI / 180;
  }
  const R = 6371; // km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export {getPlaceInfo, getUserInfo, getStationInfo};
