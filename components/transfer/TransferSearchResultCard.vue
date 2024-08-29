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
    class="flex flex-col md:flex-row lg:flex-col xl:flex-row border rounded"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Header if best price-->
    <div
      v-show="bestPrice"
      class="flex bg-primary p-10 items-center cursor-pointer"
      @click="$emit('showDetails')"
    >
      <div class="w-full text-center text-white leading-14 text-sm font-bold">
        #1
      </div>
    </div>
    <!-- Body-->
    <div
      :class="[bestPrice ? 'bg-primary-opaque' : '']"
      class="w-full flex flex-col cursor-pointer"
      @click="$emit('showDetails')"
    >
      <div class="flex flex-row h-full">
        <div class="flex mx-16 my-8">
          <img
            :src="'/images/mercedes.svg'"
            alt="Mercedes Benz"
            title="Mercedes Benz"
          />
        </div>
        <div class="flex flex-col justify-center">
          <div
            :class="hover ? 'underline' : ''"
            class="font-bold leading-16 text-black"
          >
            Mercedes E Class
          </div>
          <div class="text-xs leading-12 text-grey-dark mt-4">
            Menetidő: 1 óra 20 perc
          </div>
        </div>
      </div>
      <div v-show="detailsActive" class="flex flex-col w-full mb-16">
        <div class="bg-grey-light h-1 w-full"></div>
        <div class="text-sm leading-14 text-black p-16">
          Service available any time, any day. We offer a secure, comfortable
          and effective transfer service with a wide and modern fleet
          <br />
          <br />
          Pick-up point: Once you have collected your luggage, a staff member
          will be waiting for you at the Arrivals Hall with a sign with your
          name on it. If you are unable to locate the driver/agent, please call
          Cityrama Hungary on +36 13 02 43 82. Languages spoken at the call
          centre: English. Please do not leave the pick-up area without having
          contacted the agent/driver first. Transfer information:
          <span v-show="!showMore">*...</span>
          <span v-show="showMore">
            Pick-up point: Once you have collected your luggage, a staff member
            will be waiting for you at the Arrivals Hall with a sign with your
            name on it. If you are unable to locate the driver/agent, please
            call Cityrama Hungary on +36 13 02 43 82. Languages spoken at the
            call centre: English. Please do not leave the pick-up area without
            having contacted the agent/driver first.
          </span>
        </div>
        <div
          class="link text-sm cursor-pointer px-16 leading-14 z-30"
          @click.stop
          @click="showMore = !showMore"
        >
          {{ showMore ? 'Kevesebb' : 'Tovább olvasom' }}
        </div>
      </div>
    </div>
    <!-- Footer-->
    <div
      :class="[
        bestPrice
          ? 'bg-primary'
          : 'bg-grey-lighter-opaque border-t border-grey-light md:border-t-0 lg:border-t xl:border-t-0'
      ]"
      class="flex flex-row w-full flex-1 lg:w-full"
    >
      <div
        :class="[
          bestPrice && !detailsActive
            ? 'text-white hover:text-opacity-50'
            : detailsActive
            ? 'text-black'
            : 'text-primary hover:text-primary-dark',
          bestPrice ? 'border-primary' : 'border-grey-light'
        ]"
        class="flex items-center px-16 cursor-pointer md:border-l md:border-grey-light md:px-8 lg:border-l-0 lg:px-16 xl:border-l xl:px-8"
        @click="$emit('showDetails')"
      >
        <i class="fas fa-info-circle"></i>
      </div>
      <div
        :class="bestPrice ? 'bg-white opacity-40' : 'bg-grey-light'"
        class="w-1 flex bg-white"
      ></div>
      <div
        :class="bestPrice ? 'mx-1' : ''"
        class="flex flex-row w-full justify-end items-center md:flex-col md:justify-center md:px-42 md:mx-4 lg:flex-row lg:justify-end lg:px-0 xl:flex-col xl:px-42 xl:mx-4 xl:justify-center"
      >
        <div
          :class="bestPrice ? 'text-white' : 'text-black'"
          class="text-2x leading-18 font-bold mr-16 items-center md:flex md:w-full md:justify-center md:mr-0 lg:w-auto lg:mt-0 lg:mr-16 xl:w-full xl:mr-0"
        >
          EUR 314
        </div>
        <div
          :class="
            bestPrice ? 'my-16 md:px-1 lg:my-16 xl:px-1' : 'my-15 lg:my-15'
          "
          class="mr-16 bg-dark-hard md:flex md:w-full md:m-0 md:mt-16 md:justify-center lg:w-auto lg:mr-16 xl:m-0 xl:mt-16"
        >
          <ButtonSmall :type="bestPrice ? 'danger' : 'inverted'">
            Lefoglalom
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'TransferSearchResultCard',
  components: {
    ButtonSmall
  },
  props: {
    bestPrice: {
      type: Boolean,
      default: false
    },
    detailsActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMore: false,
      hover: false
    }
  }
}
</script>

<style scoped></style>
