<template>
  <main class="flex-grow">
    <TravelAssistantForm :travel-assistant="travelAssistant" />
  </main>
</template>
<script>
import TravelAssistantForm from '@/components/travel-assistant/TravelAssistantForm'

export default {
  name: 'EditTravelAssistant',
  middleware: 'auth_needed',
  components: {
    TravelAssistantForm
  },
  data() {
    return {
      travelAssistant: false
    }
  },
  mounted() {
    this.checkTravelAssistant()
  },
  methods: {
    async checkTravelAssistant() {
      let res
      try {
        res = await this.$store.dispatch('travel-assistant/getDetails', {
          id: this.$route.params.id
        })
      } catch (e) {
        await this.$router.push(this.localePath('/'))
      }
      if (
        res === undefined ||
        res.travelAssistant === undefined ||
        res.travelAssistant.status !== 'FINISHED'
      ) {
        await this.$router.push(this.localePath('/'))
      }
      if (res && res.travelAssistant) {
        this.travelAssistant = res.travelAssistant
      }
    }
  }
}
</script>

<style></style>
