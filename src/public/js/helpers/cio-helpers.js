const CIO_LOCALSTORAGE_NAMESPACE = "TSE_CIO_SDK_CONFIG";

const CIO_DEFAULTS = {
  siteID: "YOUR_SITE_ID", 
  region: "us"
}

export function getCioConfig() {
  let siteID,
    region,
    storedState = JSON.parse(
      window.localStorage.getItem(CIO_LOCALSTORAGE_NAMESPACE)
    );
  if (storedState) {
    siteID = storedState.siteID;
    region = storedState.region;
  }
  let cioConfig;
  if (siteID && region) {
    cioConfig = { siteID, region };
  } else {
    cioConfig = CIO_DEFAULTS;
  }
  return cioConfig;
}

function setCioConfig({ siteID, region }) {
  window.localStorage.setItem(
    CIO_LOCALSTORAGE_NAMESPACE,
    JSON.stringify({ siteID, region })
  );
}

export function updateCioConfig({ siteID, region }) {
  let { siteID: previousSiteId, region: previousRegion } = getCioConfig();
  if (!previousSiteId && previousRegion) {
    setCioConfig({ siteID, region });
  } else if (siteID != previousSiteId || region != previousRegion) {
    setCioConfig({ siteID, region });
  } else console.log("Same values provided, No changes made to CIO config");
  console.log({ siteID, region });
}

export const TSE_CIO_CONFIG = getCioConfig();

function getCookie(c_name) {
  const allCookies = document.cookie;
  if (allCookies.length > 0) {
    let c_start = allCookies.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = allCookies.indexOf(";", c_start);
      if (c_end == -1) c_end = allCookies.length;
      return decodeURIComponent(allCookies.substring(c_start, c_end));
    }
  }
  return "";
}

export function getAnonymousID() {
  return getCookie(window._cio.cookieNamespace + "anonid");
}

export function getIdentifier() {
  try {
    if (!window._cio) {
      throw "_cio has not yet been added to the window"
    }
    return window._cio._findCustomer()
  } catch (err) {
    console.error(err);
    return ""
  }
}
