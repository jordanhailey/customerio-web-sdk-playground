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

export async function cdpGetIdentifier(){
  return new Promise((resolve,reject)=>{
    try {
      let userID = window?.analytics?._user?.id(),
      anonymousIdentifier = (
        window?.analytics?._user?.anonymousId()
        )
      if (userID) resolve(window.playground._helpers.propogateIdentifier({identifier:userID}))
      else if (anonymousIdentifier) {
        resolve(window.playground._helpers.propogateIdentifier({anonymousIdentifier}))
      }
    } catch (err) {
      throw err
    }
  })
}

export async function cdpIdentify(id,traits){

}
export async function cdpTrack(id,traits){

}

export function cdpResetIdentifier(){
  if (window.analytics) {
    window.analytics.reset();
  }
}