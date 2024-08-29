<template>
  <main>
    <div v-if="content" v-html="content"></div>
  </main>
</template>

<script>
export default {
  layout: 'blank',
  name: 'NewsletterViewPage',
  middleware: 'auth_needed',
  components: {},
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      content: false
    }
  },
  computed: {},
  mounted() {
    this.getNewsletter()
  },

  methods: {
    async getNewsletter() {
      this.newsletter = await this.$store.dispatch(
        'user/getNewsletterContent',
        {
          newsletter: this.$route.params.index,
          list: this.$route.params.list
        }
      )
      if (this.newsletter.content !== undefined) {
        this.content = this.newsletter.content
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeNewsletterTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeNewsletterTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeNewsletterTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
