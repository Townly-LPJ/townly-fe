import attractionData from "@/data/대전_충청권_관광지.json";
import leisureData from "@/data/대전_충청권_레포츠.json";
import culturalData from "@/data/대전_충청권_문화시설.json";
import shoppingData from "@/data/대전_충청권_쇼핑.json";
import accommodationData from "@/data/대전_충청권_숙박.json";
import travelCourseData from "@/data/대전_충청권_여행코스.json";
import restaurantData from "@/data/대전_충청권_음식점.json";
import festivalData from "@/data/대전_충청권_축제공연행사.json";

const convertItems = (items, category) => {
  return items
    .filter((item) => item.mapx && item.mapy)
    .map((item) => ({
      id: item.contentid,
      category,
      title: item.title,
      description: item.addr1,
      addressDetail: item.addr2,
      image: item.firstimage,
      lat: Number(item.mapy),
      lng: Number(item.mapx),
    }));
};

export const places = [
  ...convertItems(attractionData.items, "ATTRACTION"),
  ...convertItems(leisureData.items, "LEISURE"),
  ...convertItems(culturalData.items, "CULTURAL"),
  ...convertItems(shoppingData.items, "SHOPPING"),
  ...convertItems(accommodationData.items, "ACCOMMODATION"),
  ...convertItems(travelCourseData.items, "TRAVEL_COURSE"),
  ...convertItems(restaurantData.items, "RESTAURANT"),
  ...convertItems(festivalData.items, "FESTIVAL"),
];
