export default {
  data: (_) => ({
    map: null,
    Popup: null,
    currentPopup: null,
    refName: 'powermap'
  }),

  mounted() {},

  methods: {
    /**
     * Defines a new javascript class to create popups on
     * a google map.
     *
     * Taken from https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
     */
    definePopupClass() {
      this.map = this.$refs[this.refName]
      this.Popup = function(position, content, id) {
        this.position = position

        content.classList.add('powerline-bubble-content')

        const pixelOffset = document.createElement('div')
        pixelOffset.classList.add('powerline-bubble-anchor')
        pixelOffset.appendChild(content)

        this.anchor = document.createElement('div')
        this.anchor.classList.add('powerline-tip-anchor')
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
        const display = 'block'

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

    createPopup(data, map) {
      const el = document.createElement('div')
      const id = 'map-popup-' + data.id
      // eslint-disable-next-line no-undef
      const coord = new google.maps.LatLng(
        Number(data.geo.lat),
        Number(data.geo.long)
      )
      el.innerHTML = this.htmlGenerator(data)
      this.currentPopup = new this.Popup(coord, el, id)
      this.currentPopup.setMap(map)
    },

    /**
     * Generates the html to display within the popup.
     *
     * @param object item
     *
     * @return string
     */
    htmlGenerator(item) {
      let html
      html = '<div class="marker-powerline">'
      html += '<span>' + item.reg + '<br>' + item.buy + '</span>'
      html += '</div>'
      return html
    }
  }
}
