import {initializeApp} from "@firebase/app";
import {getFirestore, doc, getDoc} from "@firebase/firestore";
import * as firebaseAdmin from "firebase-admin";
import {Request} from "express";
import {user} from "firebase-functions/v1/auth";
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
    if (userToken === "") {
      return "default";
    }
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(userToken);
    const uid = decodedToken.uid;
    return uid.toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * getInfo
 *
 * @param  {string} infotype
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getInfo(infotype: string, req: Request): Promise<any> {
  try {
    if (infotype === "user") {
      return getUserInfo(req);
    } else if (infotype === "place") {
      return getPlaceInfo(req);
    } else if (infotype === "station") {
      return getStationInfo(req);
    } else if (infotype === "post") {
      return getPostInfo(req);
    } else {
      console.log("Not implemented types");
    }
  } catch (error) {
    console.log(error);
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
    if (infotype === "user" || infotype === "place" ||
        infotype === "station" || infotype === "post") {
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
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getUserInfo(req: Request) {
  try {
    const userId = await getUserId(req.body.userToken);
    const userInfo = await getInfoBase("user", userId);
    return {userInfo: userInfo};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getStationInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getStationInfo(req: Request): Promise<any> {
  try {
    const stationId = req.body.stationId;
    const userId = await getUserId(req.body.userToken);
    let category = req.body.category;
    const tags = req.body.tags;
    let categoryAll = false;
    if (category === "음식점") {
      category = "_0";
    } else if (category === "카페") {
      category = "_1";
    } else if (category === "술집") {
      category = "_2";
    } else if (category === "") {
      category = "";
      categoryAll = true;
    }
    if (userId === "default") {
      const stationInfo =
        await getInfoBase("station", `${stationId}${category}`);
      return {stationInfo: stationInfo};
    } else {
      const userInfo = await getInfoBase("user", userId);
      const stationInfo =
        await getInfoBase("station", `${stationId}${category}`);
      return {stationInfo: stationInfo};
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getPlaceInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getPlaceInfo(req: Request): Promise<any> {
  try {
    const stationId = `${req.body.stationId}`;
    const placeId = req.body.placeId;
    const stationData = await getInfoBase("station", stationId);
    const placeInfo = await getInfoBase("place", placeId);
    const stationCoor: coordinate = {lon: stationData.station_coor_x,
      lat: stationData.station_coor_y};
    const placeCoor: coordinate = {lon: placeInfo.place_coor_x,
      lat: placeInfo.place_coor_y};
    const distance = haversineDistance(stationCoor, placeCoor);
    console.log(`getPlaceInfo: ${JSON.stringify(stationData)},
      ${JSON.stringify(placeInfo)}`);
    console.log(`distance: ${distance}`);
    return {placeInfo: placeInfo, distance: distance};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getPostInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getPostInfo(req: Request): Promise<any> {
  try {
    const postId = await req.body.postId;
    const postInfo = await getInfoBase("post", postId);
    return {postInfo: postInfo};
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

export {getInfo};
