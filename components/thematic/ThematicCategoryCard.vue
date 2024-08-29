<template>
  <div class="mb-16">
    <nuxt-link
      :id="'thematic' + index"
      :to="localePath('/thematic-offers/' + thematic.id)"
      class="flex flex-col cursor-pointer"
    >
      <div
        class="bg-grey-light relative w-full rounded mb-16 overflow-hidden"
        :style="'height:' + imageHeight + 'px;'"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          class="absolute top-0 bottom-0 right-0 left-0 bg-center bg-cover"
          :style="
            'background-image: url(' + thematic.picture_big_filename + ')'
          "
        ></div>
      </div>
      <div class="text-center text-sm">
        <h3 class="text-lg w-full truncate text-primary leading-tight">
          {{ thematic.name }}
        </h3>
        <div class="text-sm">
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
export default {
  name: 'ThematicCategoryCard',
  components: {},
  props: {
    thematic: {
      type: [Object, Boolean],
      default: false
    },
    imageHeight: {
      type: Number,
      default: 384
    },
    index: {
      type: Number,
      default: 0
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
