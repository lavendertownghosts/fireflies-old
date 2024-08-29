<template>
  <div class="section partner-section ">
    <div
      class="flex items-center justify-center flex-col datadiv px-8 xl:px-34 max-w-screen-xl mx-auto text-center"
    >
      <h2
        class="text-white my-32 max-w-md md:text-3xl text-lg font-semibold leading-13 tracking-normal text-center"
      >
        {{ $t('landing.partner_section_title') }}
      </h2>
      <div class="center-logo">
        <img
          v-for="(partner, index) in partnerArray"
          :key="index"
          :src="partner.src"
          :alt="partner.alt"
          class="logo w-128 h-128"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      partnerArray: [
        {
          alt: 'Something',
          src: '/images/landing/partnerSection/---something---.png'
        },
        {
          alt: 'Apartments Online',
          src: '/images/landing/partnerSection/apartmentsonline.png'
        },
        {
          alt: 'Arabian Adventures',
          src: '/images/landing/partnerSection/arabian_adventures.png'
        },
        { alt: 'Carnect', src: '/images/landing/partnerSection/carnect.png' },
        {
          alt: 'Dida Travel',
          src: '/images/landing/partnerSection/dida-travel.png'
        },
        { alt: 'Dotw', src: '/images/landing/partnerSection/dotw.png' },
        {
          alt: 'Escalade BDS',
          src: '/images/landing/partnerSection/escaladebds.png'
        },
        { alt: 'Fastpay', src: '/images/landing/partnerSection/fastpay.png' },
        { alt: 'GTA', src: '/images/landing/partnerSection/GTA.png' },
        {
          alt: 'Hotelbeds TUI',
          src: '/images/landing/partnerSection/Hotelbeds_tui.png'
        },
        {
          alt: 'Hotelbeds',
          src: '/images/landing/partnerSection/Hotelbeds.png'
        },
        { alt: 'Hotelde', src: '/images/landing/partnerSection/hotelde.png' },
        {
          alt: 'Hotelspro',
          src: '/images/landing/partnerSection/hotelspro.png'
        },
        {
          alt: 'Jumbotours',
          src: '/images/landing/partnerSection/jumbotours.png'
        },
        { alt: 'Ostrovok', src: '/images/landing/partnerSection/ostrovok.png' },
        { alt: 'Rakuten', src: '/images/landing/partnerSection/rakuten.png' },
        {
          alt: 'Rooms XML',
          src: '/images/landing/partnerSection/rooms_xml.png'
        },
        { alt: 'RTS', src: '/images/landing/partnerSection/RTS.png' },
        { alt: 'Tourico', src: '/images/landing/partnerSection/tourico.png' },
        { alt: 'Travco', src: '/images/landing/partnerSection/travco.png' },
        {
          alt: 'Travellanda',
          src: '/images/landing/partnerSection/travellanda.png'
        },
        { alt: 'TUI', src: '/images/landing/partnerSection/tui.png' },
        {
          alt: 'Welcome Beds',
          src: '/images/landing/partnerSection/welcomebeds.png'
        },
        { alt: 'WHL', src: '/images/landing/partnerSection/whl.png' }
      ]
    }
  }
}
</script>

<style scoped>
.datadiv {
  min-height: 85%;
}
.logo {
  @apply mx-8;
}
.center-logo {
  @apply grid gap-10 mx-16;
  grid-template-columns: repeat(8, 1fr);
}
.partner-section {
  background-image: url('/images/landing/partnerSection/partner-background.svg');
  background-position: center;
  background-repeat: no-repeat;
  height: 125vh;
}
@media (min-width: 1024px) and (max-width: 1280px) {
  .partner-section {
    height: 145vh;
  }
}
@media (min-width: 351px) and (max-width: 1024px) {
  .center-logo {
    grid-template-columns: repeat(5, 1fr);
  }
  .logo {
    box-sizing: border-box;
    text-align: center;
    width: 100%;
    height: 100%;
  }
  .partner-section {
    height: 135vh;
  }
}

@media (max-width: 350px) {
  .datadiv {
    min-height: 90%;
  }
  .center-logo {
    grid-template-columns: repeat(3, 1fr);
  }
  .partner-section {
    height: 205vh;
  }
  .logo {
    width: 100%;
    height: 100%;
  }
}
</style>
