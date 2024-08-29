<template>
  <div class="snackbar fixed bottom-0 mb-24 z-30 w-full md:w-3/5 lg:w-auto">
    <div class="px-16 md:px-0 md:transform md:-translate-x-1/2">
      <div
        class="flex items-center p-16 opacity-90 text-white rounded text-sm leading-14"
        :class="'bg-' + bgColor"
      >
        <div class="flex-grow" v-html="message"></div>
        <div v-show="undoButton !== ''" class="flex-initial ml-16">
          <div class="link cursor-pointer" @click="undoEvent">
            {{ undoButton }}
          </div>
        </div>
        <div class="flex-initial ml-16">
          <div class="cursor-pointer" @click="setSnackbar(false)">
            <i class="fas fa-times opacity-50 text-base"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Snackbar',
  props: {
    message: {
      type: String,
      required: true
    },
    bgColor: {
      type: String,
      default: 'black'
    },
    undoButton: {
      type: String,
      default: ''
    },
    undoEvent: {
      type: Function,
      default: () => {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      setSnackbar: 'general/setSnackbar'
    })
  }
}
</script>

<style scoped>
@media (min-width: 772px) {
  .snackbar {
    left: 50%;
  }
}
</style>
