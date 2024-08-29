<template>
  <div>
    <ButtonMedium
      class="uppercase w-full md:w-1/2 lg:w-full lg:mt-1"
      type="danger"
      :input-style="['lg:rounded-l-none']"
      :is-loading="searchInitLoading"
      @click="startHotelSearch()"
      >{{ $t('general.Search') }}</ButtonMedium
    >
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

import ButtonMedium from '@/components/micro/ButtonMedium'

import { getTomorrow, isArray } from '@/includes/utils'

export default {
  name: 'ApartmentsCondosSearchForm',
  components: {
    ButtonMedium
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    init: {
      type: [Object, Boolean],
      default: false
    },
    isHomepage: {
      type: Boolean,
      default: false
    },
    nameSearchInputId: {
      type: String,
      default: 'hotel-name-search'
    }
  },
  data() {
    return {
      nameSearch: {
        text: '',
        id: false
      },
      guests: [
        {
          adults: 2,
          children: 0,
          childrenAges: []
        }
      ],
      dates: getTomorrow(),
      radio: 'credit',

      searchInitLoading: false,
      nameSearchError: false,
      guestsList: [],
      guestsSelect: 2
    }
  },
  computed: {
    ...mapGetters('user', ['getFees'])
  },
  watch: {
    nameSearch() {
      this.nameSearchError = false
    },
    init(value) {
      this.setInit(value)
    }
  },
  created() {
    this.$eventBus.listen('apartmentHistoryFill', this.setInitFromHistory)
  },
  mounted() {
    const fees = this.getFees
    if (fees.package !== undefined) {
      if (fees.package.permission !== undefined) {
        if (fees.package.permission !== 'FREE') {
          this.allowedpackage = true
        }
      }
    }

    this.searchInitLoading = false
    this.setInit(this.init)
    if (this.isCis) {
      this.radio = 'card_cis'
    }
    for (let i = 2; i <= 10; i++) {
      this.guestsList.push(i)
    }
  },
  beforeDestroy() {
    this.$eventBus.remove('apartmentHistoryFill', this.setInitFromHistory)
    this.$nuxt.$off('geo-change')
  },
  methods: {
    ...mapActions('apartments', ['initHotelSearch']),
    ...mapMutations('apartments', ['pushSearchHistory']),
    setInitFromHistory(history) {
      this.nameSearch = history.nameSearch
      this.dates = history.dates
      this.guests = isArray(history.guests) ? history.guests : [history.guests]
    },
    setInit(init) {
      if (init) {
        this.nameSearch.text = init.fts_name
        this.nameSearch.id = Number(init.fts_id)
        this.dates = init.checkin
        this.guests = init.rooms.map((val) => {
          return {
            adults: val.adults,
            children: val.children,
            childrenAges: val.childrenages
          }
        })

        this.guestsSelect = this.guests[0].adults - 2
        this.radio = init.type
      }
    },
    async startHotelSearch() {
      this.searchInitLoading = true
      const result = await this.initHotelSearch({
        type: this.radio,
        text_id: 12801, // hardcode fake
        checkin: this.dates,
        guests: [
          {
            adults: this.guestsList[this.guestsSelect],
            children: 0,
            childrenAges: []
          }
        ],
        lang: this.$i18n.locale
      })

      this.pushSearchHistory({
        nameSearch: this.nameSearch,
        dates: this.dates,
        guests: [
          {
            adults: this.guestsList[this.guestsSelect],
            children: 0,
            childrenAges: []
          }
        ]
      })

      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(
        this.localePath('/apartments-condos/search/' + result.search_id)
      )
    }
  }
}
</script>
