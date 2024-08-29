<template>
  <button
    class="w-full text-left text-primary bg-white border border-primary rounded mb-16 px-11 py-8 text-sm cursor-pointer hover:text-primary-dark active:border-primary-light active:bg-white active:text-primary-light focus:outline-none focus:border-black focus:bg-white focus:text-black"
    :class="{
      'bg-primary-opaque border-primary-dark': hover
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @blur="active = false"
  >
    <div
      :class="{
        underline: hover || active
      }"
      class="leading-14 mb-6 font-bold flex flex-row"
    >
      <div :title="fromAltText" class="truncate min-w-30">{{ from }}</div>
      <div class="mx-4">
        <i
          class="fas w-14"
          :class="tripType === '1' ? 'fa-exchange' : 'fa-long-arrow-right'"
        ></i>
      </div>
      <div :title="toAltText" class="truncate min-w-30">
        {{ to }}
      </div>
    </div>
    <div class="text-grey-dark leading-20">
      <p>
        2019.08.23 (10:00) - 2019.08.26 (10:00)
      </p>
      <p>
        2 felnőtt, 2 gyerek
      </p>
    </div>
  </button>
</template>

<script>
export default {
  name: 'HistoryTransferSearch',
  props: {
    from: {
      type: String,
      required: true
    },
    fromAltText: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      required: true
    },
    toAltText: {
      type: String,
      default: ''
    },
    tripType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      hover: false,
      active: false
    }
  }
}
</script>
<style scoped>
.min-w-30 {
  min-width: 30px;
}
</style>
