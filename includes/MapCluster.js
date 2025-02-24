/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
  List of properties from
  https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/src/markerclusterer.js
**/
import MarkerClusterer from 'marker-clusterer-plus'
import mapElementFactory from '~/node_modules/gmap-vue/dist/factories/map-element'

const props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  batchSizeIE: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  enableRetinaIcons: {
    type: Boolean,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  averageCenter: {
    type: Boolean,
    twoWay: false
  },
  ignoreHidden: {
    type: Boolean,
    twoWay: false
  },
  imageExtension: {
    type: String,
    twoWay: false
  },
  imagePath: {
    type: String,
    twoWay: false
  },
  imageSizes: {
    type: Array,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

export default mapElementFactory({
  mappedProps: props,
  events,
  name: 'cluster',
  ctr: () => {
    if (typeof MarkerClusterer === 'undefined') {
      /* eslint-disable no-console */
      console.error(
        'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js'
      )
      throw new Error(
        'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js'
      )
    }
    return MarkerClusterer
  },
  ctrArgs: ({ map, ...otherOptions }) => [map, [], otherOptions],

  render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default)
  },

  afterCreate(inst) {
    const reinsertMarkers = () => {
      const oldMarkers = inst.getMarkers()
      inst.clearMarkers()
      inst.addMarkers(oldMarkers)
    }

    for (const prop in props) {
      if (props[prop].twoWay) {
        this.$on(prop.toLowerCase() + '_changed', reinsertMarkers)
      }
    }
  },

  updated() {
    // clusted update only if marker count is different
    if (
      this.$clusterObject &&
      this.childrenCount !== this.$children.length &&
      this.$children.length !== 0
    ) {
      this.childrenCount = this.$children.length
      this.$clusterObject.repaint()
    }
  },

  beforeDestroy() {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach((marker) => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null
      }
    })

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers()
    }
  }
})
