<template>
  <div class="section rate-section">
    <h2
      class="text-landingPrimary  md:text-2xl text-lg font-semibold leading-40 tracking-normal text-center mt-16 mb-0 md:mb-52 lg:mb-100 mx-12"
    >
      {{ $t('landing.rate_section_title') }}
    </h2>
    <div
      class="flex px-8 xl:px-48 max-w-screen-xl mx-auto justify-center self-center"
    >
      <Carousel
        :per-page="perPage"
        :navigate-to="navTo"
        :loop="false"
        :pagination-active-color="'#00939c'"
        :pagination-color="'#E7E7E7'"
        :pagination-enabled="true"
        :scroll-per-page="true"
        :special-scroll="false"
        :navigation-enabled="false"
        :pagination-size="20"
        class="ratings p-16"
      >
        <Slide
          v-for="(result, index) in results"
          :key="index"
          class="flex flex-col items-center justify-center"
        >
          <div class="rating m-24 p-16 ">
            <div class="top">
              <div class="flex">
                <img class="rounded-full w-72 h-72" :src="result.image" />
                <div
                  class="self-center text-black ml-11 text-lg font-semibold leading-normal"
                >
                  {{ result.name }}
                </div>
              </div>
              <div class="mb-20 flex">
                <img
                  v-for="starIndex in 5"
                  :key="starIndex"
                  :src="
                    starIndex <= result.star
                      ? '/images/landing/ratingSection/star_full.svg'
                      : '/images/landing/ratingSection/star.svg'
                  "
                  class="star-image"
                />
              </div>
            </div>
            <div
              class="p-5 text-landingPrimary text-lg font-semibold leading-normal mb-24"
            >
              {{ result.title }}
            </div>
            <div class="p-5 text-2x font-normal leading-6">
              {{ result.desc }}
            </div>
          </div>
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from '@/components/carousel'
export default {
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      navTo: [0, true],
      results: [
        {
          image: '/images/landing/ratingSection/r0.jpg',
          name: this.$t('landing.rate_section_box0_name'),
          star: 5,
          title: this.$t('landing.rate_section_box0_title'),
          desc: this.$t('landing.rate_section_box0_description')
        },
        {
          image: '/images/landing/ratingSection/r1.jpg',
          name: this.$t('landing.rate_section_box1_name'),
          star: 5,
          title: this.$t('landing.rate_section_box1_title'),
          desc: this.$t('landing.rate_section_box1_description')
        },
        {
          image: '/images/landing/ratingSection/r2.jpg',
          name: this.$t('landing.rate_section_box2_name'),
          star: 5,
          title: this.$t('landing.rate_section_box2_title'),
          desc: this.$t('landing.rate_section_box2_description')
        },
        {
          image: '/images/landing/ratingSection/r3.jpg',
          name: this.$t('landing.rate_section_box3_name'),
          star: 5,
          title: this.$t('landing.rate_section_box3_title'),
          desc: this.$t('landing.rate_section_box3_description')
        },
        {
          image: '/images/landing/ratingSection/r4.jpg',
          name: this.$t('landing.rate_section_box4_name'),
          star: 4,
          title: this.$t('landing.rate_section_box4_title'),
          desc: this.$t('landing.rate_section_box4_description')
        },
        {
          image: '/images/landing/ratingSection/r5.jpg',
          name: this.$t('landing.rate_section_box5_name'),
          star: 5,
          title: this.$t('landing.rate_section_box5_title'),
          desc: this.$t('landing.rate_section_box5_description')
        }
      ],
      perPage: 1
    }
  },
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('resize', this.setPerPage)
  },
  destroyed() {
    window.removeEventListener('resize', this.setPerPage)
  },
  mounted() {
    this.setPerPage()
  },
  methods: {
    setPerPage() {
      if (window.innerWidth > 1023) {
        this.perPage = 3
        this.navTo = [0, false]
      } else {
        this.perPage = 1
        this.navTo = [2, false]
      }
    }
  }
}
</script>

<style scoped>
@media (min-width: 520px) and (max-width: 1024px) {
  .rate-section {
  }
}
.rate-section {
  background-image: url('/images/landing/cocoSection/map_flight.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.rating {
  border-radius: 21px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.07);
}

@media (max-width: 1024px) {
  .ratings {
    width: 100% !important;
  }
}
</style>
