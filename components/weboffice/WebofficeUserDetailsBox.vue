<template>
  <div>
    <div class="flex flex-col lg:flex-row">
      <WebofficeFeesBox class="mb-16 lg:mb-0 lg:flex lg:flex-grow lg:pr-16" />
      <WebofficeCreditBalance
        v-show="isCis"
        :class="isCis ? 'lg:w-177 xl:w-216' : 'lg:w-240 xl:w-288'"
        class="flex w-full mb-16 lg:mb-0 lg:pr-16"
      />
      <WebofficeTravelBalance
        :class="isCis ? 'lg:w-177 xl:w-216' : 'lg:w-240 xl:w-288'"
        class="flex w-full"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WebofficeFeesBox from '@/components/weboffice/WebofficeFeesBox'
import WebofficeTravelBalance from '@/components/weboffice/WebofficeTravelBalance'
import WebofficeCreditBalance from '@/components/weboffice/WebofficeCreditBalance'
export default {
  name: 'WebofficeUserDetailsBox',
  components: {
    WebofficeTravelBalance,
    WebofficeFeesBox,
    WebofficeCreditBalance
  },
  computed: {
    ...mapGetters('user', ['isCis'])
  }
}
</script>
