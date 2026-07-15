<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { loadKakaoMap } from "../../utils/kakaoMap";
import markerIcon from "@/assets/marker.svg";

const props = defineProps({
  places: {
    type: Array,
    default: () => [],
  },
  selectedPlaceId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["select-place"]);

const mapContainer = ref(null);
const loading = ref(true);
const errorMessage = ref("");

let kakaoApi;
let map;
let markers = [];

const clearMarkers = () => {
  markers.forEach(({ marker }) => {
    marker.setMap(null);
  });

  markers = [];
};

const renderMarkers = () => {
  if (!map || !kakaoApi) {
    return;
  }

  clearMarkers();

  const markerImage = new kakaoApi.maps.MarkerImage(markerIcon, new kakaoApi.maps.Size(38, 50), {
    offset: new kakaoApi.maps.Point(19, 50),
  });

  props.places.forEach((place) => {
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
      return;
    }

    const marker = new kakaoApi.maps.Marker({
      map,
      position: new kakaoApi.maps.LatLng(place.lat, place.lng),
      title: place.title,
      image: markerImage,
    });

    kakaoApi.maps.event.addListener(marker, "click", () => {
      emit("select-place", place.id);
    });

    markers.push({
      id: place.id,
      marker,
    });
  });
};

const moveToSelectedPlace = () => {
  if (!map || !kakaoApi || props.selectedPlaceId == null) {
    return;
  }

  const selectedPlace = props.places.find(
    (place) => String(place.id) === String(props.selectedPlaceId),
  );

  if (!selectedPlace) {
    return;
  }

  markers.forEach(({ id, marker }) => {
    const isSelected = String(id) === String(props.selectedPlaceId);

    marker.setMap(isSelected ? map : null);
  });

  const position = new kakaoApi.maps.LatLng(selectedPlace.lat, selectedPlace.lng);

  if (map.getLevel() > 4) {
    map.setLevel(4);
  }

  map.panTo(position);
};

onMounted(async () => {
  try {
    console.log("카카오 지도 초기화 시작");

    await nextTick();

    if (!mapContainer.value) {
      throw new Error("지도 HTML 요소를 찾지 못했습니다.");
    }

    kakaoApi = await loadKakaoMap();

    console.log("카카오 지도 SDK 로드 완료", kakaoApi);

    map = new kakaoApi.maps.Map(mapContainer.value, {
      center: new kakaoApi.maps.LatLng(36.3504119, 127.3845475),
      level: 8,
    });

    console.log("카카오 지도 생성 완료", map);

    renderMarkers();
    fitMapToPlaces();
  } catch (error) {
    console.error("카카오 지도 초기화 실패:", error);

    errorMessage.value = error instanceof Error ? error.message : "지도를 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
});

const fitMapToPlaces = () => {
  if (!map || !kakaoApi) {
    return;
  }

  const validPlaces = props.places.filter(
    (place) =>
      Number.isFinite(place.lat) &&
      Number.isFinite(place.lng) &&
      place.lat >= 33 &&
      place.lat <= 39 &&
      place.lng >= 124 &&
      place.lng <= 132,
  );

  if (validPlaces.length === 0) {
    map.setCenter(new kakaoApi.maps.LatLng(36.3504119, 127.3845475));

    map.setLevel(8);
    return;
  }

  if (validPlaces.length === 1) {
    map.setCenter(new kakaoApi.maps.LatLng(validPlaces[0].lat, validPlaces[0].lng));

    map.setLevel(5);
    return;
  }

  const bounds = new kakaoApi.maps.LatLngBounds();

  validPlaces.forEach((place) => {
    bounds.extend(new kakaoApi.maps.LatLng(place.lat, place.lng));
  });

  map.setBounds(bounds);
};

const showAllMarkers = () => {
  markers.forEach(({ marker }) => {
    marker.setMap(map);
  });
};

watch(
  () => props.places,
  () => {
    renderMarkers();
    fitMapToPlaces();

    if (props.selectedPlaceId != null) {
      moveToSelectedPlace();
    }
  },
  { deep: true },
);

watch(
  () => props.selectedPlaceId,
  async (selectedId) => {
    if (selectedId == null) {
      showAllMarkers();
      fitMapToPlaces();
      return;
    }

    await nextTick();

    moveToSelectedPlace();
  },
);
</script>

<template>
  <div class="kakao-map-wrapper">
    <p v-if="loading" class="kakao-map-message">지도를 불러오는 중입니다.</p>

    <p v-else-if="errorMessage" class="kakao-map-message">
      {{ errorMessage }}
    </p>

    <div ref="mapContainer" class="kakao-map"></div>
  </div>
</template>

<style scoped>
.kakao-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.kakao-map {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.kakao-map-message {
  position: absolute;
  inset: 0;
  z-index: 2;

  display: grid;
  place-items: center;

  margin: 0;
  background: white;
  color: #91857a;
}
</style>
