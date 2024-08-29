<template>
  <div class="pb-5 w-full text-sm">
    <span>{{ date | formatDateDisplay }}</span
    ><nuxt-link
      v-if="category != ''"
      :to="localePath('/news/' + category.slug)"
      class="uppercase"
      :class="colorclass()"
    >
      - {{ category.title }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'NewsMeta',
  components: {},
  props: {
    date: {
      type: String,
      default: ''
    },
    category: {
      type: [Object, Boolean],
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    colorclass() {
      const colorToSlug = {
        54: 'text-warning',
        53: 'text-black',
        52: 'text-danger',
        51: 'text-primary'
      }
      const id = this.category.slug.substr(
        this.category.slug.lastIndexOf('-') + 1
      )
      if (colorToSlug[id] !== undefined) {
        return colorToSlug[id]
      } else {
        return 'text-normal'
      }
    }
  }
}
</script>
