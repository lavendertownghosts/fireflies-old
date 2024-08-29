<template>
  <div class="section palm-section">
    <div class="flex flex-row ml-84">
      <div
        class="half lg:w-1/2 md:w-full flex justify-items-center items-center min-height"
      >
        <div class="half-box max-w-screen-sm text-white">
          <h2 class="half-box-header mb-24 md:text-2xl text-xl">
            {{ $t('landing.palm_section_title') }}
          </h2>
          <h3 class="half-box-content md:text-lg text-base mr-70">
            {{ $t('landing.palm_section_description') }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.palm-section {
  background-image: url('/images/landing/palmSection/tropical-beach-samoa.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  mix-blend-mode: normal;
  align-items: center;
}

.min-height {
  min-height: 160vh !important;
}
</style>
