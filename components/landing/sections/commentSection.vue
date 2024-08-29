<template>
  <div class="section lg:px-64 comment-section">
    <h2
      class="text-landingPrimary  md:text-2xl text-lg font-semibold leading-40 tracking-normal text-center md:mb-100 mb-16"
    >
      {{ $t('landing.comment_section_title') }}
    </h2>
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
      class="ratings"
    >
      <Slide v-for="(result, index) in results" :key="index">
        <div class="comment flex items-center p-16 m-16">
          <div class="left-div pr-20">
            <img
              class="girl-profile rounded-full max-w-177 max-h-177"
              :src="result.image"
            />
          </div>
          <div class="right-div">
            <div class="mr-32">
              <div
                class="text-3x font-semibold leading-normal mb-15 text-landingPrimary"
              >
                {{ result.name }}
              </div>
              <div class="text-xs font-normal leading-6">
                {{ result.desc }}
              </div>
              <div class="mt-15 text-landingGrey">
                {{ result.date }}
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </Carousel>
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
          image: '/images/landing/commentSection/c0.jpg',
          name: this.$t('landing.comment_section_box0_name'),
          date: this.$t('landing.comment_section_box0_date'),
          desc: this.$t('landing.comment_section_box0_description')
        },
        {
          image: '/images/landing/commentSection/c1.jpg',
          name: this.$t('landing.comment_section_box1_name'),
          date: this.$t('landing.comment_section_box1_date'),
          desc: this.$t('landing.comment_section_box1_description')
        },
        {
          image: '/images/landing/commentSection/c2.jpg',
          name: this.$t('landing.comment_section_box2_name'),
          date: this.$t('landing.comment_section_box2_date'),
          desc: this.$t('landing.comment_section_box2_description')
        },
        {
          image: '/images/landing/commentSection/c3.jpg',
          name: this.$t('landing.comment_section_box3_name'),
          date: this.$t('landing.comment_section_box3_date'),
          desc: this.$t('landing.comment_section_box3_description')
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

<style>
.VueCarousel-wrapper {
  @apply justify-center self-center;
}
</style>

<style scoped>
.comment-section {
  background-image: url('/images/landing/cocoSection/map_flight.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 50vh !important;
}
.comment {
  border-radius: 21px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.07);
}
.left-div {
  flex: 1;
}
.right-div {
  flex: 2;
}
@media (max-width: 1024px) {
  .right-div {
    flex: 3;
  }
}
</style>
