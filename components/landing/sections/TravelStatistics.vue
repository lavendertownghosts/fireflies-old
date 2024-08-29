<template>
  <main ref="elementToCheck" class="bg-primary -mt-16 mb-100">
    <div class="p-16 max-w-screen-xl mx-auto xl:px-40">
      <h2
        class="text-white text-center title text-2xl font-bold leading-40 mt-40"
      >
        {{ $t('general.TravelStatistics') }}
      </h2>
    </div>
    <div v-if="statistics.total !== undefined">
      <div class="p-16 max-w-screen-xl mx-auto xl:px-40">
        <div class="flex flex-col md:flex-row mb-56 mt-34 text-white">
          <div class="flex flex-row w-full">
            <div class="flex flex-col text-center w-1/2 items-center">
              <div>
                <i
                  class="text-primary-lighter fal fa-calendar-check text-2xl"
                ></i>
              </div>
              <div class="text-lg leading-12 mt-16">
                {{ $t('general.PreviousBooking') }}
              </div>
              <div class="text-2xl font-bold leading-32 mt-24">
                <AnimatedCounter :value="Number(statistics.total.travels)" />
              </div>
            </div>
            <div class="flex flex-col text-center w-1/2 items-center">
              <div>
                <i class="text-primary-lighter fal fa-users text-2xl"></i>
              </div>
              <div class="text-lg leading-12 mt-16">
                {{ $t('general.PreviousTraveler') }}
              </div>
              <div class="text-2xl font-bold leading-32 mt-24">
                <AnimatedCounter :value="Number(statistics.total.travellers)" />
              </div>
            </div>
          </div>
          <div class="flex flex-row mt-32 md:mt-0 w-full">
            <div class="flex flex-col text-center w-1/2 items-center">
              <div>
                <i class="text-primary-lighter fal fa-moon-stars text-2xl"></i>
              </div>
              <div class="text-lg leading-12 mt-16">
                {{ $t('general.PreviousNight') }}
              </div>
              <div class="text-2xl font-bold leading-32 mt-24">
                <AnimatedCounter
                  :value="Number(statistics.total.guest_nights)"
                />
              </div>
            </div>
            <div class="flex flex-col text-center w-1/2 items-center">
              <div>
                <i class="text-primary-lighter fal fa-plane text-2xl"></i>
              </div>
              <div class="text-lg leading-12 mt-16">
                {{ $t('general.CurrentTraveler') }}
              </div>
              <div class="text-2xl font-bold leading-32 mt-24">
                <AnimatedCounter :value="Number(statistics.total.current)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-height flex-grow overflow-hidden">
        <gmap-map
          ref="gmap"
          class="h-full w-full"
          :center="center"
          :zoom="zoomLevel"
          :options="mapOptions"
          @zoom_changed="zoomChanged"
          @dragend="boundsChanged"
        >
          <gmap-marker
            v-for="(m, index) in markers"
            :key="index"
            :position="{
              lat: Number(m.latitude),
              lng: Number(m.longitude)
            }"
            :clickable="true"
            :draggable="false"
            :icon="
              active_marker === m[locationUniqueKey]
                ? marker_selected
                : marker_unselected
            "
            @click="showPopup(m)"
          ></gmap-marker>
        </gmap-map>
      </div>
    </div>
  </main>
</template>

<script>
import { format } from 'date-fns'
import { mapActions } from 'vuex'
import MapPopupMixin from '@/includes/MapPopupMixin'
import placeholderBackgroundUrl from '~/assets/images/stats-bg-small.jpg'
import backgroundUrl from '~/assets/images/stats-bg.jpg'
import { formatPrice, numberFormat } from '@/includes/utils'
import AnimatedCounter from '@/components/AnimatedCounter'

export default {
  name: 'StatisticsPage',
  components: {
    AnimatedCounter
  },
  mixins: [MapPopupMixin],
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl,
      center: {
        lat: 50,
        lng: 20
      },
      zoomLevel: 5,
      mapOptions: {
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text'
          },
          {
            featureType: 'all',
            elementType: 'labels.icon'
          }
        ]
      },
      marker_unselected: '/images/marker-unselected.png',
      marker_selected: '/images/marker-selected.png',
      active_marker: false,
      animateCounter: false,
      markers: [],
      statistics: [],
      locationUniqueKey: 'country'
    }
  },
  async mounted() {
    try {
      this.statistics = await this.$store.dispatch('statistics/getStatistics')
    } catch (e) {
      console.log(e)
    }
    if (this.statistics !== undefined) {
      const MAP = setInterval(() => {
        if (this.$refs.gmap === undefined) {
          clearInterval(MAP)
        } else {
          this.$refs.gmap.$mapPromise.then((map) => {
            const bounds = map.getBounds()
            if (bounds !== undefined) {
              this.getLocations()
              clearInterval(MAP)
            }
          })
        }
      }, 100)
    }
  },
  methods: {
    format,
    formatPrice,
    ...mapActions('statistics', ['getStatisticLocations']),
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    },
    zoomChanged() {
      this.getLocations(true)
    },
    boundsChanged() {
      this.getLocations()
    },
    async getLocations(checkZoomLevel = false) {
      let postParams
      await this.$refs.gmap.$mapPromise.then((map) => {
        if (checkZoomLevel) {
          if (this.zoomLevel === map.getZoom()) {
            return
          }
        }
        this.zoomLevel = map.getZoom()
        this.locationUniqueKey = this.zoomLevel < 7 ? 'country' : 'city'
        const bounds = map.getBounds()
        if (bounds !== undefined) {
          const NECorner = bounds.getNorthEast()
          const SWCorner = bounds.getSouthWest()
          postParams = {
            lang: this.$i18n.locale,
            level: this.locationUniqueKey,
            country: null,
            top: NECorner.lng().toFixed(8),
            left: SWCorner.lat().toFixed(8),
            bottom: SWCorner.lng().toFixed(8),
            right: NECorner.lat().toFixed(8)
          }
        }
      })
      if (postParams !== undefined) {
        let res
        try {
          res = await this.getStatisticLocations(postParams)
        } catch (e) {
          console.log(e)
        }
        if (res !== undefined && res.locations !== undefined) {
          this.markers = res.locations
          if (this.active_marker !== false) {
            const found = this.markers.find(
              (element) =>
                element[this.locationUniqueKey] === this.active_marker
            )
            if (found === undefined) {
              this.active_marker = false
              this.deletePopup()
            }
          }
        } else {
          this.markers = []
        }
      }
    },
    showPopup(location) {
      if (this.active_marker === location[this.locationUniqueKey]) {
        this.deletePopup()
        this.active_marker = false
      } else {
        this.active_marker = location[this.locationUniqueKey]

        this.deletePopup()
        this.createPopup(
          {
            image: location.image,
            name: location[this.locationUniqueKey],
            latitude: location.latitude,
            longitude: location.longitude,
            travellers: numberFormat(location.travellers, '0,0', {
              thousandsSeparator: '.'
            }),
            guest_nights: numberFormat(location.guest_nights, '0,0', {
              thousandsSeparator: '.'
            }),
            current:
              this.locationUniqueKey === 'country'
                ? numberFormat(location.current, '0,0', {
                    thousandsSeparator: '.'
                  })
                : false
          },
          'statistic'
        )
      }
    }
  }
}
</script>

<style scoped>
.map-height {
  height: 607px;
}
</style>
<style>
.popup-bubble-content {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  background-color: white;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 288px;
  height: 304px;
  overflow: hidden;
}
.popup-bubble-anchor {
  position: absolute;
  width: 100%;
  bottom: 40px;
  left: 0;
}
.popup-container {
  cursor: auto;
  height: 0;
  position: absolute;
  width: 200px;
}
.popup-image {
  background-position: center;
  background-size: cover;
  width: 288px;
  height: 216px;
}
.font-proxima-soft {
  font-family: Nunito, nunito, sans-serif;
}
</style>
