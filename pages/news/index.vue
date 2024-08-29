<template>
  <main class="flex-grow">
    <NewsHeader
      :title="$t('general.News')"
      :description="$t('news.heading')"
      class="mb-16"
    />
    <div class="max-w-screen-xl mx-auto">
      <div class="flex flex-wrap justify-start ml-8 mr-8 xl:ml-32 xl:mr-32">
        <NewsListCard
          v-for="(news, index) in results"
          :key="index"
          :news="news"
          :imageheight="responsiveNewsImageHeight"
          class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-8"
        />
      </div>
      <div class="flex flex-wrap justify-center mb-56">
        <ButtonSmall
          v-show="isLoadMore"
          :is-loading="isLoading"
          type="inverted"
          @click="getNews()"
        >
          {{ $t('news.load_more') }}
        </ButtonSmall>
      </div>
    </div>
  </main>
</template>
<script>
import NewsHeader from '@/components/news/NewsHeader'
import NewsListCard from '@/components/news/NewsListCard'
import ButtonSmall from '@/components/micro/ButtonSmall'

import { newsCount, responsiveNewsImageHeight } from '@/includes/utils'

export default {
  name: 'NewsListPage',
  components: {
    NewsHeader,
    NewsListCard,
    ButtonSmall
  },
  data() {
    return {
      results: {},
      page: 0,
      maxpage: 1,
      isLoading: false,
      isLoadMore: false
    }
  },
  computed: {
    newsCount() {
      return newsCount()
    },
    responsiveNewsImageHeight() {
      return responsiveNewsImageHeight()
    }
  },
  mounted() {
    this.resetState()
    this.getNews()
  },
  methods: {
    resetState() {
      this.results = []
      this.page = 0
      this.maxpage = 1
      this.isLoading = false
      this.isLoadMore = false
    },
    getNews() {
      if (this.isLoading === false) {
        this.page++
        this.getResults({
          lang: this.$i18n.locale,
          page: this.page,
          npp: newsCount()
        })
      }
    },
    async getResults(params) {
      this.isLoading = true
      let res = {}
      try {
        res = await this.$store.dispatch('news/getNewsList', params)
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined) {
        if (res.news !== undefined) {
          this.results.push(...res.news)
        }
        if (res.pagination !== undefined) {
          this.maxpage = res.pagination.pagecount
          if (this.page === this.maxpage) {
            this.isLoadMore = false
          } else {
            this.isLoadMore = true
          }
        }
        this.isLoading = false
      } else {
        this.isLoading = false
      }
    }
  },
  head() {
    return {
      title: this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.NewsDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.NewsDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.NewsDescription')
        }
      ]
    }
  }
}
</script>
