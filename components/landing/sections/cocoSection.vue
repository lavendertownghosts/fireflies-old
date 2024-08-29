<template>
  <div class="section coco-section">
    <div
      class="px-24 xl:px-34 max-w-screen-xl mx-auto main-text text-landingPrimary md:text-center text-left mb-100 md:mb-0"
      v-html="$t('landing.coco_section_vision_sentence')"
    ></div>
    <div
      class="px-24 xl:px-34 max-w-screen-xl mx-auto flex flex-col md:flex-row sm:flex-col coco-main"
    >
      <div
        class="coco-main-main lg:w-1/2 md:w-full flex justify-center items-center"
      >
        <div class="md:px-24 coco-main-main-centered">
          <h2 class="main-text text-landingPrimary">
            {{ $t('landing.coco_section_title') }}
          </h2>
          <h3 class="black-text sec-text">
            {{ $t('landing.coco_section_description') }}
          </h3>
        </div>
      </div>
      <div class="coco-main-sec lg:w-1/2 md:w-full sm:w-full"></div>
    </div>
    <div
      id="coco-boxes"
      class="coco-sec grid grid-cols-1 md:grid-cols-3 justify-center items-center md:px-84 md:-mx-32 row-gap-32 col-gap-32 my-64"
    >
      <div class="box bg-landingPrimary mx-32 p-32 h-full text-white">
        <div class="box-header mb-15">
          {{ $t('landing.coco_section_box1_title') }}
        </div>
        <div class="box-content">
          {{ $t('landing.coco_section_box1_description') }}
        </div>
      </div>
      <div
        class="box bg-landingSecondary mx-32 md:mr-0 sm:ml-32 md:ml-0 p-32 h-full text-white"
      >
        <div class="box-header mb-15">
          {{ $t('landing.coco_section_box2_title') }}
        </div>
        <div class="box-content">
          {{ $t('landing.coco_section_box2_description') }}
        </div>
      </div>
      <div
        class="box bg-landingTertiary mx-32 md:ml-0 sm:mr-32 p-32 h-full text-white"
      >
        <div class="box-header mb-15">
          {{ $t('landing.coco_section_box3_title') }}
        </div>
        <div class="box-content">
          {{ $t('landing.coco_section_box3_description') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.coco-section {
  background-image: url('/images/landing/cocoSection/map_flight.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 150vh;
}
.coco-main {
  min-height: 95vh;
}
.coco-main-sec {
  background-image: url('/images/landing/cocoSection/tropical-landscape-with-coconut.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  min-height: 700px;
}
.coco-sec {
  min-height: 33vh;
}
.main-text {
  font-size: 35px;
}
.sec-text {
  font-size: 24px;
}
.black-text {
  color: #323334;
}
.box {
  border-radius: 21px;
  box-shadow: 0px 0px 30px 0px #00000012;
}
.box-header {
  font-size: 24px;
}
.box-content {
  font-size: 16px;
}
</style>
