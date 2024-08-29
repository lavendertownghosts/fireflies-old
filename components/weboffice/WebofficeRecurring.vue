<template>
  <div>
    <div id="popUpHtml"></div>
  </div>
</template>

<script>
export default {
  name: 'WebofficeRecurring',
  props: {
    popup: {
      type: [Boolean, String],
      default: false
    }
  },
  watch: {
    popup(newVal) {
      if (newVal) {
        this.initPayUPopup()
      }
    }
  },
  mounted() {
    if (this.popup !== false) {
      this.initPayUPopup()
    }
  },
  methods: {
    initPayUPopup() {
      const encoder = document.createElement('div')
      encoder.innerHTML = this.popup.replace('<![CDATA[', '').replace(']]>', '')
      const scriptEl = document
        .createRange()
        .createContextualFragment(encoder.innerHTML)
      document.getElementById('popUpHtml').append(scriptEl)

      setTimeout(function() {
        document.getElementById('pay-button').click()
      }, 1000)
    }
  }
}
</script>
