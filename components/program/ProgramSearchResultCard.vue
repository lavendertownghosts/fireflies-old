<template>
  <div
    :class="
      bestPrice
        ? hover
          ? 'border-primary-dark'
          : 'border-primary'
        : hover
        ? 'border-grey'
        : 'border-grey-light'
    "
    class="flex flex-col lg:flex-row border rounded cursor-pointer"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="$emit('showProgramDetails', { slug: program.activity_id })"
  >
    <!-- Header if best price-->
    <div v-show="bestPrice" class="flex bg-primary p-10 items-center">
      <div class="w-full text-center text-white leading-14 text-sm font-bold">
        #1
      </div>
    </div>
    <!-- Body-->
    <div
      :class="[bestPrice ? 'bg-primary-opaque' : '']"
      class="w-full flex flex-col"
    >
      <div class="flex flex-col sm:flex-row sm:mb-0">
        <div
          class="flex flex-initial w-full sm:mr-16 relative index-image h-240 sm:h-auto"
        >
          <div
            :class="
              !bestPrice ? 'rounded-t sm:rounded-tr-none lg:rounded-bl' : ''
            "
            class="absolute top-0 bottom-0 right-0 left-0 bg-cover"
            :style="{ backgroundImage: 'url(' + program.image + ')' }"
          ></div>
        </div>
        <div
          class="flex flex-initial flex-col sm:justify-center px-16 py-16 sm:pl-0"
        >
          <div class="flex flex-row w-full">
            <div class="flex flex-col justify-center w-full">
              <div
                :class="[
                  hover ? 'underline' : '',
                  bestPrice ? 'best-price' : ''
                ]"
                class="font-bold leading-24 text-black w-full max-name"
              >
                {{ program.name }}
                <div class="font-normal">
                  {{ program.category }}
                </div>
                <div
                  v-if="program.duration !== undefined"
                  class="text-black text-xs leading-12 mt-4"
                  :title="$t('general.Period') + ': ' + program.duration"
                >
                  <i class="far fa-clock mr-4"></i>{{ program.duration }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer-->
    <div
      :class="[
        bestPrice
          ? 'bg-primary'
          : 'bg-grey-lighter-opaque border-t border-grey-light lg:border-t-0 lg:border-l'
      ]"
      class="flex flex-row w-full flex-1 lg:w-full"
    >
      <div
        :class="bestPrice ? 'mx-1' : ''"
        class="flex flex-row w-full justify-end items-center lg:flex-col lg:justify-center lg:px-42 lg:mx-4"
      >
        <div
          :class="bestPrice ? 'text-white' : 'text-black'"
          class="text-2x leading-18 font-bold mr-16 items-center lg:flex lg:w-full lg:justify-center lg:mr-0"
        >
          {{ currency }}
          {{ price | formatNumber('0,0', { thousandsSeparator: ' ' }) }}
        </div>
        <div
          :class="bestPrice ? 'my-16 lg:px-1' : 'my-15'"
          class="mr-16 bg-dark-hard lg:flex lg:w-full lg:m-0 lg:mt-16 lg:justify-center"
        >
          <div target="_blank" class="flex flex-col cursor-pointer">
            <ButtonSmall :type="bestPrice ? 'danger' : 'inverted'">
              {{ $t('program.Details') }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'ProgramSearchResultCard',
  components: {
    ButtonSmall
  },
  props: {
    bestPrice: {
      type: Boolean,
      default: false
    },
    program: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      innerWidth: 0,
      hover: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    price() {
      return Math.ceil(this.program.price[this.currency])
    }
  }
}
</script>

<style scoped>
.index-image {
  padding-top: 75%;
}

@media (min-width: 520px) {
  .index-image {
    width: 212px;
    padding-top: 160px;
  }
}

@media (min-width: 520px) and (max-width: 1023px) {
  .max-name {
    width: 244px;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .max-name {
    width: 249px;
  }
}

@media (min-width: 1280px) {
  .max-name {
    width: 440px;
  }

  .max-name.best-price {
    width: 405px;
  }
}
</style>
