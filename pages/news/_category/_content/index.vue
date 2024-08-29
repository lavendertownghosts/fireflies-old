<template>
  <main class="flex-grow">
    <NewsHeader
      :title="$t('general.News')"
      :description="$t('news.heading')"
      class="mb-16"
    />
    <article
      itemscope
      itemtype="http://schema.org/Article"
      class="content news-width pl-16 pr-16 mx-auto"
    >
      <NewsMeta :date="content.published" :category="content.heading" />
      <h1 itemprop="name" class="text-lg text-black font-bold">
        {{ content.title }}
      </h1>
      <div class="mt-8 mb-24" v-html="content.body"></div>
      <div class="flex flex-wrap justify-center mb-56">
        <ButtonSmall type="inverted" @click="$router.push(localePath('/news'))">
          {{ $t('news.back_to_news') }}
        </ButtonSmall>
      </div>
    </article>
  </main>
</template>

<script>
import NewsHeader from '@/components/news/NewsHeader'
import NewsMeta from '@/components/news/NewsMeta'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'NewsPage',
  components: {
    NewsHeader,
    NewsMeta,
    ButtonSmall
  },
  data() {
    return {
      content: false,
      isLoading: false,
      slug: false
    }
  },
  computed: {},
  mounted() {
    this.getContent()
  },
  methods: {
    getContent() {
      if (this.isLoading === false) {
        this.getResults({
          lang: this.$i18n.locale,
          slug: this.$route.params.content
        })
      }
    },
    async getResults(params) {
      this.isLoading = true
      this.content = false
      let res
      try {
        res = await this.$store.dispatch('news/getSingleNews', params)
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined) {
        this.content = res
        this.isLoading = false
      } else {
        this.isLoading = false
      }
    }
  },
  head() {
    return {
      title:
        this.content.title !== undefined
          ? this.content.title + this.$t('meta.TitleSuffix')
          : this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.content.title !== undefined
              ? this.content.title + this.$t('meta.TitleSuffix')
              : this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.content.title !== undefined
              ? this.content.title + this.$t('meta.TitleSuffix')
              : this.$t('meta.NewsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.content.subtitle !== undefined
              ? this.content.subtitle
              : this.$t('meta.NewsDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.content.subtitle !== undefined
              ? this.content.subtitle
              : this.$t('meta.NewsDescription')
        },
        {
          property: 'twitter:description',
          content:
            this.content.subtitle !== undefined
              ? this.content.subtitle
              : this.$t('meta.NewsDescription')
        }
      ]
    }
  }
}
</script>

<style scoped>
.news-width {
  width: 624px;
}
@media (max-width: 520px) {
  .news-width {
    width: 100%;
  }
}
</style>
