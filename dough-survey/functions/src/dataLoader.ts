import * as firebaseAdmin from "firebase-admin";
import {Request} from "express";
import {updateRecent} from "./userPreference";

const db = firebaseAdmin.firestore();

/**
 * getUserId
 *
 * @param  {string} userToken
 * @return {Promise<string>}
 */
async function getUserId(userToken: string): Promise<string> {
  try {
    if (userToken === undefined) {
      return "";
    } else if (userToken === "") {
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
 * @param  {string} infotype info type, user | place | station | post
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
 * @param  {string} infotype info type, user | place | station | post
 * @param  {string} id uuid of target document
 * @return {Promise<any>} object contaning data of document
 */
async function getInfoBase(infotype: string, id:string): Promise<any> {
  try {
    if (infotype === "user" || infotype === "place" ||
        infotype === "station" || infotype === "post") {
      const docRef = db.collection(`${infotype}_db`).doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        console.log(`getInfoBase: ${infotype}, ${id}`);
        return docSnap.data();
      } else {
        console.log(`No such document: ${infotype}, ${id}`);
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
    console.log(`getUserInfo: ${userId}`);
    return {userInfo: userInfo};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * getStationInfo
 * recommendation need to be added
 * distance need to be added
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getStationInfo(req: Request): Promise<any> {
  try {
    const stationId = req.body.stationId;
    const userId = await getUserId(req.body.userToken);
    let category = req.body.category;
    const tags = req.body.tags;
    const page = req.body.page;
    let categoryAll = false;
    if (category === "음식점") {
      category = "rest";
    } else if (category === "카페") {
      category = "cafe";
    } else if (category === "술집") {
      category = "bar";
    } else if (category === "") {
      category = "";
      categoryAll = true;
    }
    console.log(`getStationInfo: ${stationId}`);
    if (categoryAll === true) {
      const userInfo = await getInfoBase("user", userId);
      const stationBaseInfo = await getInfoBase("station", `${stationId}`);
      const stationPageInfo =
        await getInfoBase("station", `${stationId}_${category}_${page}`);
      const stationInfo = Object.assign(stationBaseInfo, stationPageInfo);
      return {stationInfo: stationInfo};
    } else {
      const userInfo = await getInfoBase("user", userId);
      const stationBaseInfo = await getInfoBase("station", `${stationId}`);
      const stationPageInfo =
        await getInfoBase("station", `${stationId}_${category}_${page}`);
      const stationInfo = Object.assign(stationBaseInfo, stationPageInfo);
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
    const userToken = req.body.userToken;
    const userId = await getUserId(userToken);
    const stationId = req.body.stationId;
    const placeId = req.body.placeId;
    const stationData = await getInfoBase("station", stationId);
    const placeInfo = await getInfoBase("place", placeId);
    const stationCoor: coordinate = {lon: stationData.station_coor_x,
      lat: stationData.station_coor_y};
    const placeCoor: coordinate = {lon: placeInfo.place_coor_x,
      lat: placeInfo.place_coor_y};
    const distance = haversineDistance(stationCoor, placeCoor);
    console.log(`getPlaceInfo: ${placeId}`);
    if (userId !== "") {
      updateRecent(userId, placeId, stationId);
    }
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
    console.log(`getPostInfo: ${postId}`);
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

export {getInfo, getUserId, getInfoBase};
