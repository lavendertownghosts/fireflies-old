<template>
  <div ref="elementToCheck">
    {{
      currentValue
        | formatNumber('0,0', {
          thousandsSeparator: '.'
        })
    }}
  </div>
</template>

<script>
export default {
  name: 'AnimatedCounter',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentValue: 0,
      timer: false,
      add: 1,
      observer: false
    }
  },
  mounted() {
    if (this.value > 1000000) {
      this.add = 111111
    } else if (this.value > 700000) {
      this.add = 25111
    } else if (this.value > 300000) {
      this.add = 11111
    } else if (this.value > 100000) {
      this.add = 2511
    } else if (this.value > 10000) {
      this.add = 1111
    } else if (this.value > 1000) {
      this.add = 111
    } else {
      this.add = 11
    }
    this.createObserver()
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    createObserver() {
      const options = {
        root: null, // relative to document viewport
        rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
        threshold: 1.0 // visible amount of item shown in relation to root
      }

      this.observer = new IntersectionObserver(this.handleIntersect, options)
      this.observer.observe(this.$refs.elementToCheck) // Element reference you want to check for visibility
    },
    handleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.doCount()
        }
      })
    },
    doCount() {
      this.currentValue += this.add

      if (this.currentValue >= this.value) {
        this.currentValue = this.value
        if (this.observer) {
          this.observer.disconnect()
        }
        clearTimeout(this.timer)
      } else {
        this.timer = setTimeout(() => {
          this.doCount()
        }, 50)
      }
    }
  }
}
</script>
