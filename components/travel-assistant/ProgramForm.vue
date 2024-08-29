<template>
  <div class="mt-16">
    <div class="flex">
      <InputDropdown
        v-model="data.id"
        :values="getPrograms"
        :placeholder="$t('general.PleaseSelect')"
        :label="$t('program.Categories')"
        :class="'w-240'"
      />
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'ProgramForm',
  components: {
    InputDropdown
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    // ...mapGetters('travelAssistant', ['getPrograms'])
  }
}
</script>

<style></style>
