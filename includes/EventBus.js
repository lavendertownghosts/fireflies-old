export default {
  $eventBus: null,

  install(Vue, options) {
    this.$eventBus = new Vue()
    Vue.prototype.$eventBus = this
  },

  listen(event, handler) {
    this.$eventBus.$on(event, handler)
  },

  listenOnce(event, handler) {
    this.$eventBus.$once(event, handler)
  },

  remove(event, handler) {
    if (handler) {
      this.$eventBus.$off(event, handler)
    } else {
      this.$eventBus.$off(event)
    }
  },

  removeAll() {
    this.$eventBus.$off()
  },

  publish(event, param) {
    this.$eventBus.$emit(event, param)
  }
}
