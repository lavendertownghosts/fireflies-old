<template>
  <transition name="fade">
    <div
      class="fixed top-0 bottom-0 left-0 w-full flex items-center justify-center z-30 overflow-hidden h-screen px-16 bg-black-opaque"
      @click="outsideClick"
    >
      <div
        ref="decisionModal"
        :class="withClass"
        class="flex flex-wrap bg-white rounded p-16 px-16"
      >
        <div class="w-full">
          <slot name="body"></slot>
        </div>
        <div class="w-full">
          <div class="flex flex-wrap justify-end">
            <div class="flex mr-16" @click="$emit('cancel')">
              <ButtonSmall
                type="inverted"
                :class="'pl-15 pr-15 pt-12 pb-12'"
                :is-loading="isLoading"
              >
                {{ cancelButton }}
              </ButtonSmall>
            </div>
            <div class="flex">
              <ButtonSmall
                type="primary"
                :is-loading="isLoading"
                :is-disabled="acceptButtonDisabled"
                class="w-177 md:w-auto"
                @click="$emit('accept')"
              >
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
  name: 'DecisionModal',
  components: {
    ButtonSmall
  },
  props: {
    cancelButton: {
      type: String,
      required: true
    },
    acceptButton: {
      type: String,
      required: true
    },
    withClass: {
      type: String,
      default: 'w-288'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    acceptButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    acceptButtonDisabled: {
      handler(newValue) {
        this.acceptButtonDisabled = newValue
      }
    }
  },
  methods: {
    outsideClick(e) {
      if (this.$refs.decisionModal !== undefined) {
        const isChild = this.$refs.decisionModal.contains(e.target)
        if (!isChild) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>
