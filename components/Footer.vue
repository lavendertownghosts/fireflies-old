<template>
  <footer class="w-full bg-white border-t border-grey">
    <div class="flex flex-wrap px-16 xl:px-40 mt-56 max-w-screen-xl mx-auto">
      <div class="w-full sm:w-1/2 lg:w-1/4 mb-24">
        <h1 class="text-xl text-black">{{ $t('general.Links') }}</h1>
        <ul class="mt-16 text-sm leading-26">
          <li>
            <a
              v-if="isLoggedIn"
              :href="localePath('/weboffice')"
              class="link"
              >{{ $t('general.WebOffice') }}</a
            >
          </li>
          <li>
            <a
              :href="
                localePath('/conditions/general-business-terms-and-conditions')
              "
              target="_blank"
              class="link"
              >{{ $t('general.BusinessTerms') }}</a
            >
          </li>
          <li>
            <a
              v-if="isLoggedIn"
              :href="
                localePath(
                  '/conditions/general-terms-and-conditions-for-distributors'
                )
              "
              target="_blank"
              class="link"
            >
              {{ $t('general.DistributorTerms') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="w-full sm:w-1/2 lg:w-1/4 mb-24 md:pl-48 lg:pl-0">
        <h1 class="text-xl text-black">{{ $t('general.Services') }}</h1>
        <ul class="mt-16 text-sm leading-26">
          <li class="link cursor-pointer" @click="changeService('hotel')">
            {{ $t('general.Hotels') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('flight')">
            {{ $t('general.FlightTicket') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('roundTrip')">
            {{ $t('general.RoundTrip') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('transfer')">
            {{ $t('general.Transfer') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('eatforstay')">
            {{ $t('general.EatForStay') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('apartments')">
            {{ $t('general.Apartments') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('program')">
            {{ $t('general.Programs') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('carRental')">
            {{ $t('general.CarRental') }}
          </li>
          <li class="link cursor-pointer" @click="changeService('sports')">
            {{ $t('general.SportsAndTickets') }}
          </li>
        </ul>
      </div>
      <div class="w-full sm:w-1/2 lg:w-1/4 mb-24">
        <h1 class="text-xl text-black">{{ $t('general.CustomerService') }}</h1>
        <p
          class="mt-16 text-black text-sm sm:pr-16 xl:pr-20"
          v-html="$t('general.CustomerServiceDescription')"
        />
        <ButtonMedium
          class="mt-16"
          type="inverted"
          @click="$router.push(localePath('support'))"
          >{{ $t('general.CustomerService') }}</ButtonMedium
        >
      </div>
      <div class="w-full sm:w-1/2 lg:w-1/4 md:pl-48 lg:pl-0">
        <h1 class="text-xl text-black">{{ $t('general.Partners') }}</h1>
        <div class="mt-10 mb-8">
          <a
            href="https://ffbackend.fireflies.com/CDNContent/die_mobiliar.pdf"
            target="_blank"
            rel="noopener noreferer"
          >
            <picture>
              <source
                media="(max-width: 520px)"
                srcset="~assets/images/partners/die-mobiliar@2x.png"
              />
              <img
                src="~assets/images/partners/die-mobiliar.png"
                class="inline mr-20"
                style="width: 133px"
              />
            </picture>
          </a>
          <a
            href="https://www.etoa.org/member-search/?term=Fireflies&type=&country=&c="
            target="_blank"
            rel="noopener noreferer"
          >
            <picture>
              <source
                media="(max-width: 520px)"
                srcset="~assets/images/partners/etoa@2x.png"
              />
              <img
                src="~assets/images/partners/etoa.png"
                class="inline sm:-mr-8 md:mr-0 lg:-mr-8"
                style="width: 91px"
              />
            </picture>
          </a>
          <a
            href="https://www.star.ch/agency-details_640"
            target="_blank"
            rel="noopener noreferer"
          >
            <picture>
              <img
                src="~assets/images/partners/swiss-travel-association.png"
                class="inline sm:-mr-l md:mr-0 lg:-ml-8 -mt-12"
                style="width: 200px"
              />
            </picture>
          </a>
          <a href="https://nuvei.com/" target="_blank" rel="noopener noreferer">
            <img
              src="~assets/images/partners/apm_test_nuvei.svg"
              class="inline"
              style="width: 35px"
            />
          </a>
        </div>
        <div class="mb-24">
          <a
            href="https://www.nmi.com/"
            target="_blank"
            rel="noopener noreferer"
          >
            <img
              src="~assets/images/partners/nmi-color.webp"
              class="inline"
              style="width: 120px"
            />
          </a>
          <a
            href="https://app.airhelp.com/claims/new/trip-details?lang=en&partner=swiss_halley"
            target="_blank"
            rel="noopener noreferer"
          >
            <picture>
              <source
                media="(max-width: 520px)"
                srcset="~assets/images/partners/airhelp@2x.png"
              />
              <img
                src="~assets/images/partners/airhelp.png"
                class="inline ml-18"
                style="width: 120px"
              />
            </picture>
          </a>
        </div>
      </div>
    </div>
    <p class="mt-48 px-16 text-grey-dark text-center leading-16 text-xs">
      {{ $t('general.Copyright') }}
    </p>
    <img
      class="mx-auto my-48 md:pb-0 pb-72"
      src="~assets/images/ff-logo-footer.svg"
    />
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonMedium from '@/components/micro/ButtonMedium'
export default {
  name: 'Footer',
  components: {
    ButtonMedium
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    changeService(service) {
      if (service === 'flight') {
        this.$router.push(this.localePath('/flight'))
        return
      }

      if (service === 'transfer') {
        window.location.href = this.localePath('/transfer')
        return
      }

      if (service === 'eatforstay') {
        window.open('https://www.holiday-unlimited.net/fireflies', '_blank')
        return
      }

      if (service === 'sports') {
        window.location.href = this.localePath('/sports')
        return
      }

      this.$scrollTo('#__nuxt')
      this.$router.push(this.localePath('/'))
      if (document.body.classList.contains('fixed')) {
        document.body.classList.remove('fixed')
      }
      this.$store.commit('general/setMainActiveService', service)
    }
  }
}
</script>
