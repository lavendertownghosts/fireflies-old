<template>
  <div class="flex flex-col w-full text-black text-sm leading-14">
    <div id="reviews" class="font-bold text-base leading-16">Reviews</div>
    <div class="flex flex-row mt-8">
      <div class="flex font-bold items-center mr-12">
        {{ rating }}
      </div>
      <div class="flex flex-row items-center">
        <StarRatings
          :stars="rating"
          :position="'center'"
          :star-class="'text-xs leading-12 text-primary'"
          :max-star="5"
        />
        <div class="flex items-center ml-4">
          {{ countReview }}
        </div>
      </div>
    </div>
    <div class="w-full mt-12 mb-4">
      {{ description }}
    </div>
    <div
      v-for="stars in [5, 4, 3, 2, 1]"
      :key="stars"
      class="flex flex-row mt-8"
    >
      <div class="flex items-center">
        <StarRatings
          :stars="stars"
          :position="'center'"
          :star-class="'text-xs leading-12 text-primary'"
          :max-star="5"
          :class="'w-70'"
        />
      </div>
      <div class="w-full items-center ml-6 md:w-2/5 lg:w-3/7">
        <ProgressBar
          :init-width="ratings[stars - 1]"
          :line-class="'h-4 rounded'"
          :set-timer="false"
          :class="'mt-6 rounded'"
        />
      </div>
    </div>
    <div class="w-full font-bold mt-24">
      Reviews by Viator travelers
    </div>
    <div>
      <div
        v-for="(review, key) in reviewList"
        :key="key"
        class="mt-16 flex flex-col"
      >
        <div class="flex flex-row">
          <div class="flex font-bold items-center mr-4">
            {{ review.title }}
          </div>
          <div class="flex items-center">
            <StarRatings
              :stars="review.stars"
              :position="'center'"
              :star-class="'text-xs leading-12 text-primary'"
              :max-star="5"
            />
          </div>
        </div>
        <div class="mt-8">{{ review.details }}</div>
        <div class="mt-8">{{ review.comment }}</div>
      </div>
    </div>
    <div class="w-full flex justify-center mt-16">
      <Pagination
        :max-pages="maxPages"
        :current-page="currentPage"
        @click="navPage"
      />
    </div>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import Pagination from '@/components/Pagination'

import StarRatings from '@/components/micro/StarRatings'
export default {
  name: 'Reviews',
  components: {
    StarRatings,
    ProgressBar,
    Pagination
  },
  props: {
    rating: {
      type: Number,
      required: true
    },
    countReview: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    reviewList: {
      type: Array,
      default() {
        return [
          {
            title: 'Great way to see the city!',
            stars: 5,
            details: 'Adrienne_Kindt, Mar 2020',
            comment:
              'We had an amazing time on our private tour. Our driver was extremely knowledgeable of the city, and took the time to show us the best sites. He allowed us to stop and take photos wherever we wanted, and it was the best way to see the city at night. The car was beautiful, and everywhere we went people took photos of us and thought we were celebrities. Ha!'
          },
          {
            title: 'Great way to see the city!',
            stars: 5,
            details: 'Adrienne_Kindt, Mar 2020',
            comment:
              'We had an amazing time on our private tour. Our driver was extremely knowledgeable of the city, and took the time to show us the best sites. He allowed us to stop and take photos wherever we wanted, and it was the best way to see the city at night. The car was beautiful, and everywhere we went people took photos of us and thought we were celebrities. Ha!'
          },
          {
            title: 'Great way to see the city!',
            stars: 5,
            details: 'Adrienne_Kindt, Mar 2020',
            comment:
              'We had an amazing time on our private tour. Our driver was extremely knowledgeable of the city, and took the time to show us the best sites. He allowed us to stop and take photos wherever we wanted, and it was the best way to see the city at night. The car was beautiful, and everywhere we went people took photos of us and thought we were celebrities. Ha!'
          },
          {
            title: 'Great way to see the city!',
            stars: 5,
            details: 'Adrienne_Kindt, Mar 2020',
            comment:
              'We had an amazing time on our private tour. Our driver was extremely knowledgeable of the city, and took the time to show us the best sites. He allowed us to stop and take photos wherever we wanted, and it was the best way to see the city at night. The car was beautiful, and everywhere we went people took photos of us and thought we were celebrities. Ha!'
          },
          {
            title: 'Great way to see the city!',
            stars: 5,
            details: 'Adrienne_Kindt, Mar 2020',
            comment:
              'We had an amazing time on our private tour. Our driver was extremely knowledgeable of the city, and took the time to show us the best sites. He allowed us to stop and take photos wherever we wanted, and it was the best way to see the city at night. The car was beautiful, and everywhere we went people took photos of us and thought we were celebrities. Ha!'
          }
        ]
      }
    }
  },
  data() {
    return {
      searchProgressBarWidth: 15,
      ratings: [2, 8, 2, 8, 80],
      currentPage: 6,
      maxPages: 12
    }
  },
  methods: {
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#reviews')
    }
  }
}
</script>
