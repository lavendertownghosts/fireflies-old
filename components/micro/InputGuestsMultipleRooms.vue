<template>
  <div>
    <div :class="wrapperStyle" class="text-input">
      <label
        class="block text-black font-bold leading-12 mb-5"
        :class="[
          {
            'text-danger': error.length > 0,
            'text-white-lighter-opaque': isDisabled,
            'text-black': !isDark && error.length === 0 && !isDisabled,
            'text-white': isDark && !isDisabled && error.length === 0
          },
          labelStyle
        ]"
        >{{ label }}</label
      >
      <button
        :disabled="isDisabled"
        class="w-full h-48 leading-16 text-base py-14 px-10 mb-1 text-left rounded text-black hover:border-primary focus:outline-none focus:border-primary"
        :class="getInputClasses()"
        @click="active = true"
        v-html="displayGuests()"
      />
    </div>
    <div v-show="active" class="absolute">
      <div
        class="guests-wrapper absolute p-16 bg-white rounded text-black shadow-drop flex flex-col text-base leading-16 z-50"
      >
        <div v-for="(guests, room) in guestsArray" :key="room">
          <div v-show="guestsArray.length > 1" class="mb-16">
            <div class="flex flex-row justify-between items-center">
              <div class="font-bold">{{ $t('hotel.Room') }} {{ room + 1 }}</div>
              <div
                class="font-bold text-danger text-sm cursor-pointer"
                @click="removeRoom(room)"
              >
                <i class="fas fa-times"></i> {{ $t('hotel.RemoveRoom') }}
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-between items-center">
            <div>{{ $t('general.TheAdults') }}</div>
            <div class="flex flex-row items-center">
              <ButtonSmall type="inverted" @click="adultMod(-1, room)">
                <i class="fal fa-minus"></i>
              </ButtonSmall>
              <div class="font-bold px-16 w-42 text-center">
                {{ guests.adults }}
              </div>
              <ButtonSmall type="inverted" @click="adultMod(1, room)">
                <i class="fal fa-plus"></i>
              </ButtonSmall>
            </div>
          </div>
          <div
            v-if="maxChildrenCount > 0"
            class="flex flex-row justify-between items-center mt-16"
          >
            <div>{{ $t('general.TheChildren') }}</div>
            <div class="flex flex-row items-center">
              <ButtonSmall type="inverted" @click="childrenMod(-1, room)">
                <i class="fal fa-minus"></i>
              </ButtonSmall>
              <div class="font-bold px-16 w-42 text-center">
                {{ guests.children }}
              </div>
              <ButtonSmall type="inverted" @click="childrenMod(1, room)">
                <i class="fal fa-plus"></i>
              </ButtonSmall>
            </div>
          </div>
          <div
            v-show="guests.children > 0"
            class="text-xs leading-12 text-grey-dark mt-16"
          >
            {{ $t('general.ChildrenAgeTripCompleted') }}:
          </div>
          <div v-show="guests.children > 0" class="flex flex-wrap">
            <div
              v-for="index in guests.children"
              :key="index"
              class="w-1/2 mt-12"
              :class="[index % 2 === 0 ? 'pl-8' : 'pr-8']"
            >
              <InputDropdown
                v-model="guests.childrenAges[index - 1]"
                :values="ageDropdownValues"
              />
            </div>
          </div>
          <div
            v-show="!(guestsArray.length === maxRooms && room === maxRooms - 1)"
            class="w-full h-1 border border-t-1 border-grey-light my-16"
          ></div>
        </div>
        <div
          v-show="guestsArray.length < maxRooms && totalCount < maxOverallCount"
        >
          <ButtonSmall
            type="inverted"
            :input-style="['w-full']"
            @click="addRoom()"
          >
            <i class="fal fa-plus"></i> {{ $t('hotel.AddRoom') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGuestText } from '@/includes/utils'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'InputGuestsMultipleRooms',
  components: {
    ButtonSmall,
    InputDropdown
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default() {
        return [
          {
            adults: 2,
            children: 0,
            childrenAges: []
          }
        ]
      }
    },
    error: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    },
    wrapperStyle: {
      type: Array,
      default() {
        return []
      }
    },
    labelStyle: {
      type: String,
      default: 'text-xs'
    },
    ageDropdownValues: {
      type: Array,
      default() {
        return [
          this.$t('general.Newborn'),
          this.$t('general.YearOld1'),
          this.$t('general.YearsOld2'),
          this.$t('general.YearsOld3'),
          this.$t('general.YearsOld4'),
          this.$t('general.YearsOld5'),
          this.$t('general.YearsOld6'),
          this.$t('general.YearsOld7'),
          this.$t('general.YearsOld8'),
          this.$t('general.YearsOld9'),
          this.$t('general.YearsOld10'),
          this.$t('general.YearsOld11'),
          this.$t('general.YearsOld12'),
          this.$t('general.YearsOld13'),
          this.$t('general.YearsOld14'),
          this.$t('general.YearsOld15'),
          this.$t('general.YearsOld16'),
          this.$t('general.YearsOld17')
        ]
      }
    },
    minAdultsCount: {
      type: Number,
      default: 1
    },
    maxAdultsCount: {
      type: Number,
      default: 10
    },
    maxChildrenCount: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      active: false,
      maxOverallCount: 10,
      maxRooms: 5,
      guestsArray: [
        {
          adults: 2,
          children: 0,
          childrenAges: []
        }
      ]
    }
  },
  computed: {
    totalCount() {
      return this.guestsArray.reduce(
        (sum, { adults, children }) => sum + adults + children,
        0
      )
    },
    adultCount() {
      return this.guestsArray.reduce((sum, { adults }) => sum + adults, 0)
    },
    childrenCount() {
      return this.guestsArray.reduce((sum, { children }) => sum + children, 0)
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.guestsArray = newValue
      },
      deep: true
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.guestsArray = this.value
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    addRoom() {
      if (this.maxOverallCount - this.totalCount <= 0) {
        return
      }

      this.guestsArray.push({
        adults: this.maxOverallCount - this.totalCount === 1 ? 1 : 2,
        children: 0,
        childrenAges: []
      })
    },
    removeRoom(index) {
      this.guestsArray.splice(index, 1)
    },
    adultMod(amount, room) {
      if (
        this.adultCount + amount > this.maxAdultsCount ||
        this.adultCount + amount < this.minAdultsCount ||
        this.totalCount + amount > this.maxOverallCount
      ) {
        return
      }

      if (this.guestsArray[room].adults + amount <= 0) {
        return
      }

      this.guestsArray[room].adults = this.guestsArray[room].adults + amount

      this.$emit('input', this.guestsArray)
    },
    childrenMod(amount, room) {
      console.log(this.guestsArray[room])

      if (
        this.childrenCount + amount > this.maxChildrenCount ||
        this.childrenCount + amount < 0 ||
        this.totalCount + amount > this.maxOverallCount
      ) {
        return
      }

      if (this.guestsArray[room].children + amount < 0) {
        return
      }

      this.guestsArray[room].children = this.guestsArray[room].children + amount

      if (
        this.guestsArray[room].childrenAges.length >
        this.guestsArray[room].children
      ) {
        this.guestsArray[room].childrenAges = this.guestsArray[
          room
        ].childrenAges.slice(0, this.guestsArray[room].children)
      } else if (
        this.guestsArray[room].childrenAges.length <
        this.guestsArray[room].children
      ) {
        this.guestsArray[room].childrenAges.push(0)
      }

      this.$emit('input', this.guestsArray)
    },
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)

      if (!isChild) {
        if (this.active) {
          // STOP! ... HAMMER TIME!
          this.active = false
          window.addEventListener('click', this.captureClick, true)
        }
        this.active = false
      }
    },
    captureClick(e) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      window.removeEventListener('click', this.captureClick, true)
    },
    displayGuests() {
      const guestText = getGuestText(this.adultCount, this.childrenCount)
      return guestText === '' ? '-' : guestText
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-opaque'
          : this.error.length > 0
          ? 'border-2 border-danger'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'

      return [
        ...this.inputStyle,
        initClass,
        this.active !== false && this.active === true ? 'border-primary' : ''
      ]
    }
  }
}
</script>

<style>
.guests-wrapper {
  width: 288px;
}
</style>
