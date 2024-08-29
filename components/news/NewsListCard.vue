<template>
  <div class="mb-8">
    <nuxt-link
      :to="localePath('/news/' + news.heading.slug + '/' + news.slug)"
      class="flex flex-col cursor-pointer"
    >
      <div
        class="bg-grey-light relative w-full rounded mb-8 overflow-hidden"
        :style="'height:' + imageheight + 'px;'"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          class="absolute top-0 bottom-0 right-0 left-0 bg-center bg-cover"
          :style="'background-image: url(' + news.image + ')'"
        ></div>
      </div>
      <div class="items-center text-sm">
        <NewsMeta :date="news.published" :category="news.heading" />
        <h3 class="text-sm w-full leading-20 font-bold">
          {{ news.title }}
        </h3>
        <p>
          {{ news.subtitle }}
        </p>
      </div>
      <div class="link flex flex-col mt-4 text-sm">
        {{ $t('news.read_more') }}
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import NewsMeta from '@/components/news/NewsMeta'

export default {
  name: 'NewsListCard',
  components: {
    NewsMeta
  },
  props: {
    imageheight: {
      type: Number,
      default: 288
    },
    news: {
      type: [Object, Boolean],
      default: false
    }
  },
  data() {
    return {
      hover: false,
      active: false
    }
  },
  computed: {},
  methods: {}
}
</script>
