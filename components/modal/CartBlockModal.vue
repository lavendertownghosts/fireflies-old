<template>
  <InformativeModal
    v-show="covidCartBlock"
    :accept-button="'OK'"
    :link-button="''"
    @accept="$emit('accept')"
  >
    <div slot="body">
      <h2 class="mb-10 text-lg text-black">
        {{ $t('general.CartPreventTitle') }}
      </h2>
      <p class="mb-10">{{ $t('general.CartPreventDescription') }}</p>
    </div>
  </InformativeModal>
</template>
<script>
import InformativeModal from '@/components/modal/InformativeModal'

export default {
  name: 'CartBlockModal',
  components: {
    InformativeModal
  },
  props: {
    covidCartBlock: {
      type: [Boolean],
      default: false
    }
  }
}
</script>
