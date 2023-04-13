import { getCurrentEpochTimestampInSeconds } from "./index.js";
const CDP_LOCALSTORAGE_NAMESPACE = "CIO_CDP_CONFIG";
const CDP_DEFAULT_CONFIG = {
  apiKey: ""
};

export async function getCDPConfig(){
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


export async function setCDPConfig({config={...CDP_DEFAULT_CONFIG}}){
  return new Promise(async function settingCDPConfig(resolve,reject){
    try {
      const currentCFG = await getCDPConfig();
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
