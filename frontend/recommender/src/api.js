const HOST = process.env.NEXT_PUBLIC_MGNL_HOST;

const GENRES_URL = HOST + '/.rest/delivery/genres/v1';
const MEDIA_TYPES_URL = HOST + '/.rest/delivery/types/v1';
const RECOMMENDATIONS_BY_TYPE_URL = HOST + '/.rest/delivery/recommendations/v1';

const listEntities = async (url, dataCallback) => {
  try {
    const list = await fetch(url).then(res => res.json());
    if (!list.results) {
      console.error("There are results");
      dataCallback([])
    } else {
      dataCallback(list.results);
    }
  } catch (error) {
    console.error("Request error", error);
  }
};

export const genres = (dataCallback) => {
  listEntities(GENRES_URL, dataCallback);
};

export const mediaTypes = (dataCallback) => {
  listEntities(MEDIA_TYPES_URL, dataCallback);
};

export const mediaTypeByName = (type, dataCallback) => {
  console.log("mediaTypeByName: " + type)
  if (type == "all"){
    dataCallback({name:"All Types"});
  }else{
    listEntities(MEDIA_TYPES_URL + '?name=' + type, (list) => {
      if (!list || list.length !== 1) {
        console.error("Media type not found or multiple media types found:" + type);
      } else {
        dataCallback(list[0]);
      }
  
    });
  }
  
};

export const mediaTypeById = async (type, dataCallback) => {
  try {
    const mediaTypes = await fetch(MEDIA_TYPES_URL + '?@jcr:uuid=' + type).then(res => res.json());
    if (!mediaTypes.results || mediaTypes.results.length !== 1) {
      console.error("Media type not found or multiple media types found: " + type);
    } else {
      dataCallback(mediaTypes.results[0]);
    }
  } catch (error) {
    console.error("Request error", error);
  }
};

export const latestByType = async (type, dataCallback) => {
  try {
    console.log("latestByType:" + type)
    let url = ''
    if (type){
      url = RECOMMENDATIONS_BY_TYPE_URL + '?type=' + type + '&orderBy=mgnl:created%20desc'
    }else{
      url = RECOMMENDATIONS_BY_TYPE_URL + '?orderBy=mgnl:created%20desc'
    }
    const recommendations = await fetch(url).then(res => res.json());
    dataCallback(recommendations.results);
  } catch (error) {
    console.error("Request error", error);
  }
}

export const recommendationsByTypeData = async (type, dataCallback) => {
  try {
    if (type=='all'){
      const recommendations = await fetch(RECOMMENDATIONS_BY_TYPE_URL + '?orderBy=mgnl:created%20desc&limit=10').then(res => res.json()); // TODO
      // console.log(recommendations);
      dataCallback(recommendations.results);
    }else{
      mediaTypeByName(type, async (mediaType) => {
        const recommendations = await fetch(RECOMMENDATIONS_BY_TYPE_URL + '?type=' + mediaType['@id'] + "&orderBy=mgnl:created%20desc&limit=10").then(res => res.json()); // TODO
        // console.log(recommendations);
        dataCallback(recommendations.results);
      })
    }
   
  } catch (error) {
    console.error("Request error", error);
  }
};
