<template>
  <transition name="fade">
    <div
      class="fixed top-0 bottom-0 left-0 w-full flex items-center justify-center z-30 overflow-hidden h-screen px-16 bg-black-opaque"
      @click="outsideClick"
    >
      <div
        ref="informativeModal"
        class="flex flex-wrap bg-white rounded p-16 px-16 w-320"
      >
        <div class="w-full">
          <slot name="body"></slot>
        </div>
        <div class="w-full">
          <div class="flex flex-wrap justify-end">
            <div
              v-show="linkButton !== false"
              class="flex mr-16 items-center"
              @click="$emit('cancel')"
            >
              <div class="link cursor-pointer leading-14">
                {{ linkButton }}
              </div>
            </div>
            <div class="flex" @click="$emit('accept')">
              <ButtonSmall type="primary">
                {{ acceptButton }}
              </ButtonSmall>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'InformativeModal',
  components: {
    ButtonSmall
  },
  props: {
    linkButton: {
      type: [String, Boolean],
      default: false
    },
    acceptButton: {
      type: String,
      required: true
    }
  },
  methods: {
    outsideClick(e) {
      if (this.$refs.informativeModal !== undefined) {
        const isChild = this.$refs.informativeModal.contains(e.target)
        if (!isChild) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>
