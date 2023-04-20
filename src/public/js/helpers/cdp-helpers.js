import { cioGetIdentifier } from "./cio-helpers.js";
import { getCurrentEpochTimestampInSeconds } from "./index.js";
export const CDP_LOCALSTORAGE_NAMESPACE = "CIO_CDP_CONFIG";
const CDP_DEFAULT_CONFIG = {
  apiKey: ""
};

export async function cdpGetConfig(){
  return new Promise(function returningCDPConfig(resolve,reject){
    try {
      let cdpCFG = window.localStorage.getItem(CDP_LOCALSTORAGE_NAMESPACE);
      if (cdpCFG && cdpCFG != "{}") cdpCFG = JSON.parse(cdpCFG);
      else cdpCFG = CDP_DEFAULT_CONFIG
      resolve(cdpCFG)
    } catch (error) {
      reject(error)
    }
  })
}


export async function cdpSetConfig({config={...CDP_DEFAULT_CONFIG}}){
  return new Promise(async function settingCDPConfig(resolve,reject){
    try {
      const currentCFG = await cdpGetConfig();
      let updatedKeys = [];
      let outPutConfig = {...currentCFG}
      for (let key in currentCFG) {
        if (currentCFG[key] != config[key]) {
          outPutConfig[key] = config[key];
          updatedKeys.push({[`${key}`]:{from:currentCFG[key],to:config[key]}});
        }
      }
      if (updatedKeys.length != 0) console.log("Updated CDP Config",updatedKeys)
      window.localStorage.setItem(CDP_LOCALSTORAGE_NAMESPACE,JSON.stringify({...outPutConfig,lastUpdated: getCurrentEpochTimestampInSeconds()}))
      resolve({outPutConfig});
    } catch (error) {
      reject(error);
    }
  })
}

export function cdpResetConfig(){
  cdpSetConfig(CDP_DEFAULT_CONFIG)
}

export async function cdpGetIdentifier() {
  let idFound = false;
  return new Promise((resolve,reject)=>{
    let userID, anonymousIdentifier
    try {
      if (window?.analytics?._user) {
        anonymousIdentifier = window?.analytics?._user?.anonymousId() || "";
        userID = window?.analytics?._user?.id() || "";
        if (!userID) {
          try {
            cioGetIdentifier()
              .then(({identifier})=>{
                if (identifier != "") {
                  cdpIdentify({userID:identifier});
                  idFound = true;
                  }
                resolve({userID:identifier,anonymousIdentifier})
              })
          } catch (err) {}
        } else {
          idFound = true;
          resolve({userID,anonymousIdentifier})
        }
        if (!idFound) {
          resolve({userID,anonymousIdentifier})
        }
      } else {
        throw new Error("CDP is not loaded")
      }
    } catch (err) {
      resolve({userID,anonymousIdentifier}) 
    }
  })
}

export async function cdpIdentify({userID,traits}){
  try {
    window.analytics.identify(userID, traits)
      .then(call=>console.log("CDP identify call sent",call))
  } catch (err) {
    console.error(err)
  }
}

export async function cdpPage(page) {
  try {
    window.analytics.page(page)
      .then(call=>console.log("CDP page view sent",call))
  } catch (err) {
    console.error(err)
  }
}
export async function cdpTrack({name,properties={}}){
  window.analytics.track(name, { ...properties })
        .then(call=>{console.log("CDP call sent",call)})
}

export function cdpResetIdentifier(){
  if (window.analytics) {
    window.analytics.reset();
  }
}