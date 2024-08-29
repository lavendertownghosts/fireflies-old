<template>
  <div class="section footer-section">
    <div class="screen-center">
      <div class="center-logo flex flex-col items-center">
        <h2 class="font-bold">
          {{ $t('landing.footer_section_nuavei_master') }}
        </h2>

        <div
          class="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-6 items-center justify-items-center my-20"
        >
          <img
            src="~assets/images/partners/nmi-color.webp"
            class="footer-logo"
            style="width: 120px"
          />
          <img
            src="/images/landing/footerSection/Nuvei_Organization_logo.png"
            class="footer-logo"
            style="width: 120px;margin-top:1px;"
          />
          <img
            src="/images/landing/footerSection/MasterCard_Logo.svg.png"
            class="footer-logo"
            style="width: 120px"
          />

          <img
            src="/images/landing/footerSection/Maestro_logo.png"
            class="footer-logo"
            style="width: 120px"
          />
          <img src="~static/images/pci-dss-logo.svg" class="md:w-120" />

          <img
            src="/images/landing/footerSection/visa-pos-eng-800x400.jpg"
            class="footer-logo"
            style="width: 120px"
          />
        </div>

        <img
          src="~assets/images/ff-logo-footer.svg"
          alt="footer logo"
          class="logo mb-32"
        />
        <div class="flex items-center flex-col md:flex-row">
          <button
            class="mx-0 md:mx-32 text-black font-bold"
            @click="$router.push(localePath('support'))"
          >
            {{ $t('general.CustomerService') }}
          </button>
          <button
            class="mx-0 md:mx-32 text-black font-bold"
            @click="
              $router.push(
                localePath('/conditions/general-business-terms-and-conditions')
              )
            "
          >
            {{ $t('general.BusinessTerms') }}
          </button>
          <a
            class="mx-0 md:mx-32 text-black font-bold"
            href="https://ffbackend.fireflies.com/CDNContent/Privacy-Policy-of-Fireflies-application.pdf"
          >
            {{ $t('general.privacy') }}</a
          >
        </div>
        <h3 class="center-text">
          {{ $t('landing.footer_section_footer') }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {}
}
</script>

<style scoped>
.footer-section {
  min-height: 0vh !important;
}
.footer-logo {
  @apply mx-8 my-16;
}
.screen-center {
  @apply flex items-center justify-center flex-col;
}
@media (max-width: 1024px) {
  .center-text {
    @apply max-w-md;
  }
}
@media (max-width> 1024px) {
  .center-text {
    @apply max-w-full;
  }
}
.center-text {
  @apply my-40 mx-10;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
}
@media (max-width: 350px) {
  .center-text {
    @apply mx-10 my-40;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
  }
}
</style>
