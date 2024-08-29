<template>
  <button
    class="w-full text-left text-grey-dark bg-white border border-primary rounded mb-12 p-12 text-sm cursor-pointer hover:text-primary-dark active:border-primary-light active:bg-white active:text-primary-light focus:outline-none focus:border-black focus:bg-white focus:text-black"
    :class="{
      'bg-primary-opaque border-primary-dark': hover
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @blur="active = false"
    @click="$emit('click')"
  >
    <div
      :class="{
        underline: hover || active
      }"
      class="leading-14"
      v-html="filterString"
    ></div>
  </button>
</template>

<script>
export default {
  name: 'HistoryProgramFilter',
  props: {
    history: {
      type: [Object, Array],
      default() {
        return []
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hover: false,
      active: false
    }
  },
  computed: {
    filterString() {
      const returnArray = []
      for (const [key, value] of Object.entries(this.history)) {
        if (value.length > 0) {
          if (key === 'price') {
            for (let n = 0; n < JSON.parse(value).length; n++) {
              returnArray.push(this.getPriceName(JSON.parse(value)[n]))
            }
          } else if (key === 'categories') {
            returnArray.push(value.join(' + '))
          }
        }
      }

      return returnArray.join(' + ')
    }
  },
  methods: {
    getPriceName(price) {
      return (
        price.currency +
        ' ' +
        price.min +
        ' - ' +
        price.currency +
        ' ' +
        (price.max === 999999999999 ? 'MAX' : price.max)
      )
    }
  }
}
</script>

<style scoped></style>
