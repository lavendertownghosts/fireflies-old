<template>
  <main class="flex-grow">
    <TravelAssistantForm />
  </main>
</template>

<script>
import TravelAssistantForm from '@/components/travel-assistant/TravelAssistantForm'
export default {
  name: 'AddTravelAssistant',
  middleware: 'auth_needed',
  components: {
    TravelAssistantForm
  },
  mounted() {
    this.checkMaxTravelAssistant()
  },
  methods: {
    async checkMaxTravelAssistant() {
      let travelAssistants
      try {
        travelAssistants = await this.$store.dispatch('travel-assistant/getAll')
      } catch (e) {
        await this.$router.push(this.localePath('/'))
      }
      if (travelAssistants !== undefined && travelAssistants.length >= 5) {
        await this.$router.push(this.localePath('/'))
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.NewTravelassistantTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.NewTravelassistantTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.NewTravelassistantTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.$t('meta.NewTravelassistantDescription') +
            this.$t('meta.TitleSuffix')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.$t('meta.NewTravelassistantDescription') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:description',
          content:
            this.$t('meta.NewTravelassistantDescription') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
