<template>
  <main class="flex-grow">
    <NewsHeader :title="content.title" :show-social="false" class="mb-24" />
    <article
      itemscope
      itemtype="http://schema.org/Article"
      class="content news-width pl-16 pr-16 mx-auto"
    >
      <div class="mt-8 mb-24" v-html="content.body"></div>
    </article>
  </main>
</template>

<script>
import NewsHeader from '@/components/news/NewsHeader'
import { truncate } from '@/includes/utils'
export default {
  name: 'NewsPage',
  components: {
    NewsHeader
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
          type: this.$route.params.slug
        })
      }
    },
    async getResults(params) {
      this.isLoading = true
      this.content = false
      let res
      try {
        res = await this.$store.dispatch('news/getConditionPage', params)
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined) {
        this.content = res
        this.isLoading = false
      } else {
        this.isLoading = false
      }
    },
    head() {
      return {
        title:
          this.content !== undefined
            ? this.content.title + this.$t('meta.TitleSuffix')
            : this.$t('meta.ConditionsTitle') + this.$t('meta.TitleSuffix'),
        meta: [
          {
            property: 'og:title',
            content:
              this.content !== undefined
                ? this.content.title + this.$t('meta.TitleSuffix')
                : this.$t('meta.ConditionsTitle') + this.$t('meta.TitleSuffix')
          },
          {
            property: 'twitter:title',
            content:
              this.content.request !== undefined
                ? this.content.title
                : this.$t('meta.ConditionsTitle') + this.$t('meta.TitleSuffix')
          },
          {
            property: 'og:description',
            content:
              this.content.request !== undefined
                ? truncate(this.content.body, 160)
                : this.$t('meta.ConditionsTitle')
          },
          {
            hid: 'description',
            name: 'description',
            content:
              this.content.request !== undefined
                ? truncate(this.content.body, 160)
                : this.$t('meta.ConditionsTitle')
          },
          {
            property: 'twitter:description',
            content:
              this.content.request !== undefined
                ? truncate(this.content.body, 160)
                : this.$t('meta.ConditionsTitle')
          }
        ]
      }
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
