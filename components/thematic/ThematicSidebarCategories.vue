<template>
  <div class="mb-16" @mouseover="hover = true" @mouseleave="hover = false">
    <nuxt-link
      class="sidebar-category content-center text-pink flex flex-wrap logo-bg bg-primary bg-cover bg-center relative rounded h-72 mb-12"
      :to="localePath('/thematic-offers/' + thematic.id)"
      :style="'background-image: url(' + thematic.picture_small_filename + ')'"
    >
      <div class="flex-col flex w-full z-10">
        <div
          class="text-lg truncate leading-tight text-center leading-4"
          :class="[hover || active ? 'underline text-pink-dark' : '']"
        >
          {{ thematic.name }}
        </div>
        <div class="text-sm text-white text-center">
          {{
            $t('thematic.thematicOfferCount', {
              offers: thematic.number_of_offers
            })
          }}
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import dummySmall from '~/assets/images/thematic/sidebar-dummy.jpg'

export default {
  name: 'ThematicSidebarCategories',
  components: {},
  props: {
    thematic: {
      type: [Object, Boolean],
      default: false
    }
  },
  data() {
    return {
      dummySmall,
      hover: false,
      active: false
    }
  },
  computed: {},
  methods: {}
}
</script>
<style scoped>
.logo-bg::before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 4px;
  background-image: url('~assets/images/ff-logo-large-opaque.svg');
  background-repeat: no-repeat;
  background-size: 120% auto;
  background-position: 50% 45%;
}
</style>
