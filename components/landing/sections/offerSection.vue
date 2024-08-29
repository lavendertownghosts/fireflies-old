<template>
  <div class="section offer-section">
    <div class="offers">
      <div class="first-offer offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_hotel_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_hotel_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_hotel_description') }}
          </div>
        </div>
      </div>
      <div class="sec-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_flight_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_flight_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_flight_description') }}
          </div>
        </div>
      </div>
      <div class="thi-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_roundtrip_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_roundtrip_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_roundtrip_description') }}
          </div>
        </div>
      </div>
      <div class="fou-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_transfer_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_transfer_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_transfer_description') }}
          </div>
        </div>
      </div>
      <div class="fiv-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_car_rental_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_car_rental_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_car_rental_description') }}
          </div>
        </div>
      </div>
      <div class="six-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_cruise_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_cruise_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_cruise_description') }}
          </div>
        </div>
      </div>
      <div class="sev-offer offer col-offer">
        <div class="offer-bottom">
          <div class="offer-title">
            {{ $t('landing.offer_section_program_title') }}
          </div>
          <div class="offer-count">
            {{ $t('landing.offer_section_program_count') }}
          </div>
          <div class="offer-descr">
            {{ $t('landing.offer_section_program_description') }}
          </div>
        </div>
      </div>
    </div>
    <div class="centerized-btn-container">
      <LandingButton
        class="centerized-btn"
        style-type="btn-style-1"
        :button-text="$t('landing.offer_section_button')"
        :click-handler="jumpToRate"
      />
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
    jumpToRate() {
      this.$scrollTo('#rateSection')
    }
  }
}
</script>

<style scoped>
.offer-section {
  background-image: url('/images/landing/cocoSection/map_flight.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  @apply -mt-177;
}
.offers {
  display: grid;
  grid-template-columns: 1fr repeat(2, minmax(0, 1fr));
  gap: 16px;
  height: 100%;
  @apply ml-84;
  @apply mr-84;
}

.first-offer {
  grid-column: 1 / span 3;
  grid-row: 1 / span 12;
  background-image: url('/images/landing/offerSection/hotels.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 600px;
}
.sec-offer {
  background-image: url('/images/landing/offerSection/flights.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.thi-offer {
  background-image: url('/images/landing/offerSection/round.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.fou-offer {
  background-image: url('/images/landing/offerSection/transfer.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.fiv-offer {
  background-image: url('/images/landing/offerSection/car_rental.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.six-offer {
  background-image: url('/images/landing/offerSection/cruise.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.sev-offer {
  background-image: url('/images/landing/offerSection/program.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.offer {
  border-radius: 20px;
  display: flex;
  flex-direction: column-reverse;
}
.col-offer {
  height: 500px;
}
.offer-bottom {
  @apply text-white;
  height: 30%;
  padding: 24px;
  background: var(
    --grad,
    linear-gradient(0deg, #00596c 0%, rgba(0, 89, 108, 0) 92.56%)
  );
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: flex-start;
}
.offer-title {
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
}
.offer-count {
  @apply mt-4 mb-4;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.offer-descr {
  font-size: 18px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px;
}
.centerized-btn-container {
  @apply flex justify-center items-center mt-32 mb-32;
}
@media (max-width: 1024px) {
  .offers {
    @apply ml-42;
    @apply mr-42;
  }
}
@media (max-width: 772px) {
  .offers {
    grid-template-columns: 1fr;
  }
  .offer {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
