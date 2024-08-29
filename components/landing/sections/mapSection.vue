<template>
  <div class="section map-section flex justify-center items-center">
    <div class="section-container px-8 xl:px-34 max-w-screen-xl mx-auto">
      <div
        class="section-content text-white flex flex-col justify-center md:pt-0 pt-64 items-center"
      >
        <div class="content-container mx-24">
          <h2 class="title text-2xl leading-40 mb-24">
            {{ $t('landing.map_section_title') }}
          </h2>
          <h3 class="content text-2x leading-24">
            {{ $t('landing.map_section_description') }}
          </h3>
          <div class="buttons mt-32">
            <LandingButton
              class="mr-4"
              style-type="btn-style-1"
              :button-text="$t('landing.map_section_button')"
              :click-handler="jumpToComment"
            />
          </div>
        </div>
      </div>
      <div class="map flex flex-col justify-center md:pt-0 pt-64 items-center">
        <img src="/images/landing/mapSection/map.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import LandingButton from '@/components/landing/elements/landingButton'

export default {
  components: {
    LandingButton
  },
  methods: {
    jumpToComment() {
      this.$scrollTo('#commentSection')
    }
  }
}
</script>

<style scoped>
.map-section {
  background-image: url('/images/landing/mapSection/wave.svg');
  background-repeat: no-repeat;
  background-position: center;
  min-height: 120vh;
}
.section-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 1024px) {
  .section-content {
    margin-top: 60px;
  }
  .section-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
  }
  .map {
    height: 100%;
  }
  .map-section {
    display: block;
    background-image: url('/images/landing/mapSection/wave.svg');
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 150vh;
  }
}
</style>
