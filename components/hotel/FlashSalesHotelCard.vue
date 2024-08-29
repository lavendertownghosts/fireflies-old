<template>
  <div
    class="mt-24"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @mouseup="active = false"
    @click="$emit('click')"
  >
    <nuxt-link
      :to="localePath('/hotel/123')"
      target="_blank"
      class="bg-white text-left cursor-pointer"
    >
      <div
        class="w-full h-240 sm:h-177 md:h-271 lg:h-177 xl:h-216 rounded bg-cover"
        :style="{
          backgroundImage: 'url(images/hotel-hero-bg.png)'
        }"
      ></div>
      <div class="text-danger leading-24 mt-8">
        <span class="text-lg">23</span> available rooms for
        <span class="text-lg">13</span> days!
      </div>
      <div
        class="text-base leading-16 mt-8"
        :class="[
          hover || active ? 'underline' : '',
          active ? 'text-grey-dark' : 'text-black'
        ]"
      >
        <span class="font-bold">Turin,</span> Guernsey
      </div>
      <div class="text-grey-dark text-sm leading-14 mt-8 flex flex-row">
        <div
          class="mr-3"
          :class="[
            hover || active ? 'underline' : '',
            active ? 'text-grey-dark' : 'text-black'
          ]"
        >
          Ceasars Palace
        </div>
        <div class="flex flex-row justify-start">
          <i class="fa fa-star text-3xs"></i><i class="fa fa-star text-3xs"></i
          ><i class="fa fa-star text-3xs"></i>
        </div>
      </div>
      <div class="text-grey-dark text-sm leading-14 mt-8">
        2020.08.23. - 2020.08.26, 3 nights
      </div>
      <div class="text-grey-dark text-sm leading-14 mt-8">
        2 adults, 2 children
      </div>
      <div class="text-danger text-base font-bold leading-16 mt-8">
        1 <span class="ff-currency"></span>DV + EUR 493
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'FlashSalesHotelCard',
  data() {
    return {
      hover: false,
      active: false
    }
  }
}
</script>
