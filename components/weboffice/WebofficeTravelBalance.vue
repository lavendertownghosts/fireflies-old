<template>
  <div>
    <div
      class="flex flex-col w-full md:border border-grey-light rounded lg:py-16 lg:px-16 lg:items-center lg:flex-row lg:border-0 lg:bg-grey-light lg:bg-opacity-50"
    >
      <div
        :class="isCis ? 'xl:block' : 'lg:block'"
        class="text-black mr-16 hidden"
      >
        <i class="far fa-wallet fa-2x"></i>
      </div>
      <div
        :class="active ? 'text-white bg-black' : 'text-black'"
        class="flex-row px-16 py-12 rounded-t hidden md:flex lg:hidden"
        @click="active = !active"
      >
        <div class="flex-grow">
          <i class="far fa-wallet"></i>
          {{ $t('weboffice.TravelCard') }}
        </div>
        <div class="flex items-center">
          <i
            :class="[active ? 'fa-chevron-up' : 'fa-chevron-down']"
            class="w-16 fal"
          ></i>
        </div>
      </div>
      <div
        :class="[
          !active ? 'flex md:hidden lg:flex' : 'flex',
          showDetailsLink ? 'p-16' : 'px-16 pt-16'
        ]"
        class="flex-col text-black w-full lg:p-0"
      >
        <div class="text-sm leading-14 hidden lg:block">
          {{ $t('weboffice.TravelCard') }}
        </div>
        <div
          :class="
            !isCis || !showDetailsLink
              ? 'text-lg leading-24'
              : 'text-base leading-16'
          "
          class="mt-8"
        >
          EUR
          {{
            (getFees !== false ? getFees.tc.credit : '')
              | formatNumber('0,0.00', {
                thousandsSeparator: ' ',
                decimalSeparator: ','
              })
          }}
        </div>
        <div v-show="showDetailsLink" class="text-sm leading-14 mt-8">
          <nuxt-link
            :to="localePath('/weboffice/travel-card')"
            class="link cursor-pointer"
            >{{ $t('general.Details') }}</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WebofficeTravelBalance',
  props: {
    showDetailsLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isCis'])
  }
}
</script>
