<template>
  <div class="bg-white text-left mt-24">
    <div
      class="w-full h-240 sm:h-177 md:h-271 lg:h-177 xl:h-216 rounded bg-cover"
      :style="{
        backgroundImage: 'url(images/hotel-hero-bg.png)'
      }"
    >
      <div
        class="bg-danger w-56 h-32 font-bold text-white text-center text-sm leading-14 relative left-0 top-0 rounded-br rounded-tl py-8"
      >
        -24%
      </div>
    </div>
    <div class="text-black text-base leading-16 mt-8">
      <span class="font-bold">Turin,</span> Guernsey
    </div>
    <div class="text-grey-dark text-sm leading-14 mt-8 flex flex-row">
      <div class="mr-3">
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
    <div class="text-grey-dark text-xs leading-12 font-bold mt-8 line-through">
      EUR 493
    </div>
    <div class="text-danger text-base font-bold leading-16 mt-4">
      EUR 493
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecialHotelBox'
}
</script>
