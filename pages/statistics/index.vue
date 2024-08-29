<template>
  <main>
    <div class="w-full bg-primary relative">
      <div
        class="small-hero-dark-bg w-full bg-primary flex flex-col justify-between"
        :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
      >
        <img
          :src="backgroundUrl"
          class="hidden"
          :alt="$t('general.TravelStatistics')"
          @load="onLoadBackgroundImage"
        />
        <div
          class="p-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
        >
          <div
            class="flex flex-col flex-grow justify-center min-w-full z-10 text-center"
          >
            <div class="text-pink text-xl leading-32">
              {{ $t('general.TravelStatistics') }}
            </div>
            <div class="text-sm leading-14 text-black mt-14">
              {{ $t('general.StatisticsDescription') }}
            </div>
            <div class="text-sm leading-14 text-black mt-7">
              {{
                $t('general.LastUpdate') + ': ' + format(new Date(), 'dd/MM/y')
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="statistics !== undefined">
      <div class="p-16 max-w-screen-xl mx-auto xl:px-40">
        <div class="flex flex-col md:flex-row my-56 text-black">
          <div class="flex flex-row w-full">
            <div class="flex flex-col text-center w-1/2 items-center">
              <div><i class="fal fa-calendar-check text-2xl"></i></div>
              <div class="text-xl leading-32 mt-12">
                {{
                  statistics.total.travels
                    | formatNumber('0,0', {
                      thousandsSeparator: '.'
                    })
                }}
              </div>
              <div class="text-sm leading-12 text-grey-dark">
                {{ $t('general.PreviousBooking') }}
              </div>
            </div>
            <div class="flex flex-col text-center w-1/2 items-center">
              <div><i class="fal fa-users text-2xl"></i></div>
              <div class="text-xl leading-32 mt-12">
                {{
                  statistics.total.travellers
                    | formatNumber('0,0', {
                      thousandsSeparator: '.'
                    })
                }}
              </div>
              <div class="text-sm leading-12 text-grey-dark">
                {{ $t('general.PreviousTraveler') }}
              </div>
            </div>
          </div>
          <div class="flex flex-row mt-32 md:mt-0 w-full">
            <div class="flex flex-col text-center w-1/2 items-center">
              <div><i class="fal fa-moon-stars text-2xl"></i></div>
              <div class="text-xl leading-32 mt-12">
                {{
                  statistics.total.guest_nights
                    | formatNumber('0,0', {
                      thousandsSeparator: '.'
                    })
                }}
              </div>
              <div class="text-sm leading-12 text-grey-dark">
                {{ $t('general.PreviousNight') }}
              </div>
            </div>
            <div class="flex flex-col text-center w-1/2 items-center">
              <div><i class="fas fa-bolt text-2xl text-warning"></i></div>
              <div class="text-xl leading-32 mt-12">
                {{
                  statistics.total.current
                    | formatNumber('0,0', {
                      thousandsSeparator: '.'
                    })
                }}
              </div>
              <div class="text-sm leading-12 text-grey-dark">
                {{ $t('general.CurrentTraveler') }}
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
      <div class="p-16 max-w-screen-xl mx-auto xl:px-40">
        <div class="flex flex-col my-56 md:flex-row">
          <div class="flex flex-col md:w-1/2 md:pr-8">
            <div class="text-primary text-lg leading-24">
              {{ $t('general.Top10Country') }}
            </div>
            <div
              v-for="(topCountry, key) in statistics.topcountry"
              :key="key"
              class="flex flex-row leading-16 text-black mt-16"
            >
              <div class="flex w-24 items-center mr-4">{{ key + 1 }}.</div>
              <div class="flex flex-col flex-grow sm:flex-row">
                <div class="sm:mr-4">{{ topCountry.country }}</div>
                <div class="text-grey-dark mt-4 sm:mt-0">
                  ({{
                    topCountry.travellers
                      | formatNumber('0,0', {
                        thousandsSeparator: '.'
                      })
                  }}
                  {{ $t('general.Traveler') }} /
                  {{
                    topCountry.guest_nights
                      | formatNumber('0,0', {
                        thousandsSeparator: '.'
                      })
                  }}
                  {{ $t('general.Nights') }})
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-32 md:mt-0 md:w-1/2 md:pl-8">
            <div class="text-primary text-lg leading-24">
              {{ $t('general.Top10City') }}
            </div>
            <div
              v-for="(topCity, key) in statistics.topcity"
              :key="key"
              class="flex flex-row leading-16 text-black mt-16"
            >
              <div class="flex w-24 items-center mr-4">{{ key + 1 }}.</div>
              <div class="flex flex-col flex-grow sm:flex-row">
                <div class="sm:mr-4">{{ topCity.city }}</div>
                <div class="text-grey-dark mt-4 sm:mt-0">
                  ({{
                    topCity.travellers
                      | formatNumber('0,0', {
                        thousandsSeparator: '.'
                      })
                  }}
                  {{ $t('general.Traveler') }} /
                  {{
                    topCity.guest_nights
                      | formatNumber('0,0', {
                        thousandsSeparator: '.'
                      })
                  }}
                  {{ $t('general.Nights') }})
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-sm leading-20 text-black mb-40 statistic-description"
          v-html="$t('general.StatisticsDescription2')"
        />
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

export default {
  name: 'StatisticsPage',
  mixins: [MapPopupMixin],
  async asyncData({ store }) {
    let statistics
    try {
      statistics = await store.dispatch('statistics/getStatistics')
    } catch (e) {
      console.log(e)
    }
    return { statistics }
  },
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
      markers: [],
      locationUniqueKey: 'country'
    }
  },
  mounted() {
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
  },
  head() {
    return {
      title: this.$t('meta.StatisticsTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.StatisticsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.StatisticsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.StatisticsDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.StatisticsDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.StatisticsDescription')
        }
      ]
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
