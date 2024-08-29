<template>
  <div class="hero-main w-full bg-primary relative">
    <HotelHero v-show="activeService === 'hotel'" />
    <FlightHero v-show="activeService === 'flight'" />
    <TransferHero v-show="activeService === 'transfer'" />
    <ProgramHero v-show="activeService === 'program'" />
    <CarRentalHero v-show="activeService === 'carRental'" />
    <RoundTripHero v-show="activeService === 'roundTrip'" />
    <ApartmentsHero v-show="activeService === 'apartments'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import HotelHero from '@/components/heroes/HotelHero'
import FlightHero from '@/components/heroes/FlightHero'
import TransferHero from '@/components/heroes/TransferHero'
import ProgramHero from '@/components/heroes/ProgramHero'
import CarRentalHero from '@/components/heroes/CarRentalHero'
import RoundTripHero from '@/components/heroes/RoundTripHero'
import ApartmentsHero from '@/components/heroes/ApartmentsHero'

export default {
  name: 'HeroMain',
  components: {
    HotelHero,
    FlightHero,
    TransferHero,
    ProgramHero,
    CarRentalHero,
    RoundTripHero,
    ApartmentsHero
  },
  computed: {
    ...mapGetters('general', {
      activeService: 'getMainActiveService'
    })
  }
}
</script>

<style scoped>
.hero-main {
}
.hero-bg {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.hero-bg::before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-image: url('~assets/images/ff-logo-large-opaque.svg');
  background-repeat: no-repeat;
  background-position: 20% center;
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .hero-bg::before {
    background-position: left -50% center;
  }
}

@media (min-width: 1280px) and (max-width: 1449px) {
  .hero-bg::before {
    background-position: left -30% center;
  }
}
@media (min-width: 1500px) {
  .hero-bg::before {
    background-position: left 10% center;
  }
}
</style>
