import { calcHotelDistance } from '@/includes/utils'

export default {
  data: (_) => ({
    map: null,
    Popup: null,
    currentPopup: null,
    refName: 'gmap'
  }),

  mounted() {
    this.renderPopups()
  },

  methods: {
    /**
     * Defines a new javascript class to create popups on
     * a google map.
     *
     * Taken from https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
     */
    definePopupClass() {
      this.Popup = function(position, content, id) {
        this.position = position

        content.classList.add('popup-bubble-content')

        const pixelOffset = document.createElement('div')
        pixelOffset.classList.add('popup-bubble-anchor')
        pixelOffset.appendChild(content)

        this.anchor = document.createElement('div')
        this.anchor.classList.add('popup-tip-anchor')
        this.anchor.id = id
        this.anchor.appendChild(pixelOffset)

        this.stopEventPropagation()
      }

      // eslint-disable-next-line no-undef
      this.Popup.prototype = Object.create(google.maps.OverlayView.prototype)

      this.Popup.prototype.onAdd = function() {
        this.getPanes().floatPane.appendChild(this.anchor)
      }

      this.Popup.prototype.onRemove = function() {
        if (this.anchor.parentElement) {
          this.anchor.parentElement.removeChild(this.anchor)
        }
      }

      this.Popup.prototype.draw = function() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        )
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? 'block'
            : 'none'

        this.anchor.style.position = 'absolute'

        if (display === 'block') {
          this.anchor.style.left = divPosition.x + 'px'
          this.anchor.style.top = divPosition.y + 'px'
        }
        if (this.anchor.style.display !== display) {
          this.anchor.style.display = display
        }
      }

      this.Popup.prototype.stopEventPropagation = function() {
        const anchor = this.anchor
        anchor.style.cursor = 'auto'
        ;[
          'click',
          'dblclick',
          'contextmenu',
          'wheel',
          'mousedown',
          'touchstart',
          'pointerdown'
        ].forEach(function(event) {
          anchor.addEventListener(event, function(e) {
            e.stopPropagation()
          })
        })
      }
    },

    createPopup(marker, type = 'hotel') {
      const el = document.createElement('div')
      const id = 'map-popup'
      // eslint-disable-next-line no-undef
      const coord = new google.maps.LatLng(
        Number(marker.latitude === undefined ? marker.lat : marker.latitude),
        Number(marker.longitude === undefined ? marker.lng : marker.longitude)
      )
      el.innerHTML = this.htmlGenerator(type, marker)
      this.currentPopup = new this.Popup(coord, el, id)
      this.currentPopup.addListener('click', () => {
        console.log('select')
        this.selectCountry()
      })
      this.currentPopup.setMap(this.map)
    },

    deletePopup() {
      if (this.currentPopup !== null) {
        this.currentPopup.setMap(null)
      }
    },

    /**
     * Generates the html to display within the popup.
     *
     * @param object item
     *
     * @return string
     */
    htmlGenerator(type, item) {
      if (item.apartmentType !== undefined) {
        type = item.apartmentType
      }
      let returnString
      if (type === 'hotel') {
        returnString =
          `<a
        href="/hotel/search/${this.$route.params.id}/${item.slug}"
        target="_blank" class="flex flex-col justify-between items-start cursor-pointer h-full">
        <div class="popup-image" style="background-image: url(${item.image})">` +
          (item.selected === '1'
            ? '<div class="flex items-center justify-center absolute top-0 left-0 bg-warning h-34 px-10 rounded-br"><p class="text-black text-sm leading-14 font-bold">Selected BPO</p></div>'
            : '') +
          `</div>
        <div class="flex flex-col justify-center flex-grow px-16 py-8 w-full font-proxima-soft">
          <h2 class="text-black text-sm leading-14 font-bold truncate hover:underline">${
            item.hotel_name
          }</h2>
          <p class="mt-8 text-sm leading-14">${calcHotelDistance(
            item.distance
          )} from the city center</p>
          <p class="mt-8 text-base leading-16 font-bold ` +
          (item.selected === '1' ? `text-warning` : ``) +
          `">
          <span>`

        if (parseInt(item.voucher) > 0 && item.isPremium) {
          returnString +=
            `<span class="pr-6 lg:pr-0 xl:pr-6">${parseInt(item.voucher)}</span>
            <img
            class="inline -mt-10"
            src="` +
            item.premiumSrc +
            `"
            width="36"
            height="24"
          /> </span>`
        }
        if (parseInt(item.voucher) > 0 && !item.isPremium) {
          returnString += `<span class="pr-6 lg:pr-0 xl:pr-6">${parseInt(
            item.voucher
          )}</span>
            <span class="ff-currency"></span>
            <span class="pr-6 lg:pr-0 xl:pr-6"><img
            class="inline -mt-10"
            src="/_nuxt/assets/images/premium-voucher.svg"
            width="36"
            height="24"
          /></span>`
        }
        if (item.type === 'bpo') {
          returnString += `<span class="pr-6 lg:pr-0 xl:pr-6">${parseInt(
            item.bpo
          )}</span>
            <span class="pr-6 lg:pr-0 xl:pr-6"><img
            class="inline -mt-10"
            src="/_nuxt/assets/images/bpo-logo.svg"
            width="36"
            height="24"
          /></span>`
        }
        if (parseInt(item.price[this.currency]) > 0) {
          returnString += `<span v-show="price > 0" class="pr-6 lg:pr-0 xl:pr-6">+</span>`
        }
        returnString += `</span>`

        if (parseInt(item.price[this.currency]) > 0) {
          returnString += `<span v-show="price > 0"> ${this.currency +
            ' ' +
            parseInt(item.price[this.currency])} </span></p>`
        }

        returnString += `</div>
        </a>`

        return returnString
      } else if (type === 'statistic') {
        const detailsWidth = item.current !== false ? 'w-1/3' : 'w-1/2'
        const currentDetailsDisplay = item.current === false ? 'hidden' : ''
        returnString = `<div class="bg-white text-black rounded pb-12 font-proxima-soft cursor-pointer">
                    <div class="popup-image" style="background-image: url(${item.image})"></div>
                    <div class="text-sm leading-14 text-center w-full mt-12 mb-8 font-bold">${item.name}</div>
                    <div class="flex flex-row w-full">
                        <div class="flex flex-col ${detailsWidth} items-center">
                            <div><i class="fal fa-users text-lg"></i></div>
                            <div class="text-sm leading-14 mt-4">${item.travellers}</div>
                        </div>
                        <div class="flex flex-col ${detailsWidth} items-center">
                            <div><i class="fal fa-moon-stars text-lg"></i></div>
                            <div class="text-sm leading-14 mt-4">${item.guest_nights}</div>
                        </div>`
        if (item.current !== false) {
          returnString += `<div class="flex flex-col ${currentDetailsDisplay} ${detailsWidth} items-center">
                                <div><i class="fas fa-bolt text-lg text-warning"></i></div>
                                <div class="text-sm leading-14 mt-4">${item.current}</div>
                            </div>`
        }
        returnString += `</div></div>`
        return returnString
      } else if (type === 'apartments') {
        returnString = `<a href="/apartments/${item.intId}"
          target="_blank" class="flex flex-col justify-between items-start cursor-pointer h-full">
          <div class="popup-image" style="background-image: url(${item.featured_image})"></div>
          <div class="flex flex-col justify-center flex-grow px-16 py-8 w-full font-proxima-soft">
            <h2 class="text-black text-sm leading-14 font-bold truncate hover:underline">${item.name}</h2>
            <p class="mt-8 text-base leading-16 font-bold">`

        if (item.paymentType === 'bpo_price') {
          returnString +=
            `
                <div class="text-warning items-center flex flex-row">
                  <span class="font-bold text-lg pr-6">` +
            item.price.bpo_bpo +
            `</span>
                  <img src="` +
            item.bpoSrc +
            `" />
                  <span
                    class="font-black text-sm font-black px-6"
                  >
                    +
                  </span>
                  <span class="font-bold text-2x mt-3">` +
            item.currency +
            ' ' +
            parseInt(item.price.bpo_price[item.currency]) +
            `</span>
                </div>`
        } else {
          returnString +=
            `<div class="text-warning items-center flex flex-row"><span class="font-bold text-lg pr-6">` +
            item.price.pv_bpo +
            `</span>
                  <img src="` +
            item.bpoSrc +
            `" width="33" height="23"/>
                  <span
                    class="font-black text-sm font-black px-6"
                  >
                    +
                  </span>
                <span
                class="text-danger font-bold text-lg pr-6 lg:pr-0 xl:pr-6"
                >` +
            item.price.pv_pv +
            ` </span><img src="` +
            item.premiumSrc +
            `" width="33" height="23" />
                </div>
            `
        }

        returnString += `</p></div></a>`

        return returnString
      }
    },

    /**
     * Adds popups to map once map has rendered.
     */
    renderPopups() {
      if (this.$refs[this.refName]) {
        this.$refs[this.refName].$mapPromise.then((map) => {
          this.map = map
          this.definePopupClass()
        })
      }
    }
  }
}
