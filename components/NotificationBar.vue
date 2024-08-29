<template>
  <div
    v-show="enabled && hasLocalization"
    class="w-full p-16 xl:px-40 bg-pink flex flex-row text-xs"
  >
    <div class="pr-8" v-html="$t('general.NotificationText')"></div>
    <div class="flex-grow text-right">
      <i
        class="fas fa-times opacity-50 hover:opacity-100 cursor-pointer"
        @click="enabled = false"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationBar',
  data() {
    return {
      enabled: true
    }
  },
  computed: {
    hasLocalization() {
      if (
        this.$t('general.NotificationText') &&
        this.$t('general.NotificationText') !== 'general.NotificationText'
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
