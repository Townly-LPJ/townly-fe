<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { MapPin } from "lucide-vue-next";

import KakaoMap from "../components/map/KakaoMap.vue";
import { places } from "../utils/mapData";

const selectedCategory = ref("ALL");
const selectedPlaceId = ref(null);

const categories = [
  { label: "전체", value: "ALL" },
  { label: "관광지", value: "ATTRACTION" },
  { label: "맛집", value: "RESTAURANT" },
  { label: "축제 · 행사", value: "FESTIVAL" },
  { label: "문화시설", value: "CULTURAL" },
  { label: "레포츠", value: "LEISURE" },
  { label: "쇼핑", value: "SHOPPING" },
  { label: "숙박", value: "ACCOMMODATION" },
  { label: "여행코스", value: "TRAVEL_COURSE" },
];

const filteredPlaces = computed(() => {
  if (selectedCategory.value === "ALL") {
    return places;
  }

  return places.filter((place) => place.category === selectedCategory.value);
});

const selectedPlace = computed(() => {
  return filteredPlaces.value.find((place) => place.id === selectedPlaceId.value);
});

const selectPlace = (id) => {
  selectedPlaceId.value = id;
};

const categoryLabel = (category) => {
  return categories.find((item) => item.value === category)?.label ?? "장소";
};

const categoryIconClass = (category) => {
  return category === "RESTAURANT"
    ? "map-place-card__icon--restaurant"
    : "map-place-card__icon--default";
};

const changeCategory = (category) => {
  selectedPlaceId.value = null;
  selectedCategory.value = category;
};

const placeCardRefs = new Map();

const setPlaceCardRef = (element, placeId) => {
  if (element) {
    placeCardRefs.set(String(placeId), element);
  } else {
    placeCardRefs.delete(String(placeId));
  }
};

watch(selectedPlaceId, async (newPlaceId) => {
  if (newPlaceId == null) {
    return;
  }

  await nextTick();

  const selectedCard = placeCardRefs.get(String(newPlaceId));

  selectedCard?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
});
</script>

<template>
  <main class="map-page">
    <div class="map-page__container">
      <header class="map-page__header">
        <div class="map-page__icon">
          <MapPin :size="24" :stroke-width="2.2" />
        </div>

        <div>
          <h1>대전 여행 지도</h1>
          <p>관광지와 맛집을 지도 핀으로 한눈에</p>
        </div>
      </header>

      <div class="map-filters">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          class="map-filter-button"
          :class="{ active: selectedCategory === category.value }"
          @click="changeCategory(category.value)"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="map-content">
        <section class="map-content__map">
          <KakaoMap
            :places="filteredPlaces"
            :selected-place-id="selectedPlaceId"
            @select-place="selectPlace"
          />
        </section>

        <aside class="map-place-list">
          <button
            v-for="place in filteredPlaces"
            :key="`${place.category}-${place.id}`"
            :ref="(element) => setPlaceCardRef(element, place.id)"
            type="button"
            class="map-place-card"
            :class="{
              active: String(selectedPlaceId) === String(place.id),
            }"
            @click="selectPlace(place.id)"
          >
            <div class="map-place-card__icon" :class="categoryIconClass(place.category)">
              <MapPin :size="19" :stroke-width="2.2" />
            </div>

            <div class="map-place-card__content">
              <div class="map-place-card__title-row">
                <strong>{{ place.title }}</strong>

                <span>
                  {{ categoryLabel(place.category) }}
                </span>
              </div>

              <p>
                {{ place.description || "주소 정보 없음" }}
              </p>
            </div>
          </button>

          <p v-if="filteredPlaces.length === 0" class="map-place-empty">표시할 장소가 없습니다.</p>
        </aside>
      </div>
    </div>
  </main>
</template>

<style src="./MapView.css"></style>
