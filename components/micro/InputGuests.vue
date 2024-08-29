<template>
  <div>
    <div :class="wrapperStyle" class="text-input">
      <label
        class="block text-black font-bold leading-12 mb-5"
        :class="[
          {
            'text-danger': error.length > 0,
            'text-grey-dark opacity-50': isDisabled,
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
      <span
        v-show="error && error.length > 0"
        class="block text-danger text-xs leading-12"
      >
        {{ error }}
      </span>
    </div>
    <div v-show="active" class="absolute">
      <div
        class="guests-wrapper absolute p-16 bg-white rounded text-black shadow-drop flex flex-col text-base leading-16 z-50"
      >
        <div class="flex flex-row justify-between items-center">
          <div>{{ $t('general.TheAdults') }}</div>
          <div class="flex flex-row items-center">
            <ButtonSmall type="inverted" @click="adultMod(-1)">
              <i class="fal fa-minus"></i>
            </ButtonSmall>
            <div class="font-bold px-16 w-42 text-center">
              {{ adults }}
            </div>
            <ButtonSmall type="inverted" @click="adultMod(1)">
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
            <ButtonSmall type="inverted" @click="childrenMod(-1)">
              <i class="fal fa-minus"></i>
            </ButtonSmall>
            <div class="font-bold px-16 w-42 text-center">
              {{ children }}
            </div>
            <ButtonSmall type="inverted" @click="childrenMod(1)">
              <i class="fal fa-plus"></i>
            </ButtonSmall>
          </div>
        </div>
        <div
          v-show="children > 0"
          class="text-xs leading-12 text-grey-dark mt-16"
        >
          {{ $t('general.ChildrenAgeTripCompleted') }}:
        </div>
        <div v-show="children > 0" class="flex flex-wrap">
          <div
            v-for="index in children"
            :key="index"
            class="w-1/2 mt-12"
            :class="[index % 2 === 0 ? 'pl-8' : 'pr-8']"
          >
            <InputDropdown
              v-model="childrenAges[index - 1]"
              :values="ageDropdownValues"
              @input="childrenAgeMod"
            />
          </div>
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
  name: 'InputGuests',
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
      type: Object,
      default() {
        return {
          adults: 2,
          children: 0,
          childrenAges: []
        }
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
      adults: 2,
      children: 0,
      childrenAges: [],
      maxOverallCount: 10
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.adults = newValue.adults
        this.children = newValue.children
        this.childrenAges = newValue.childrenAges
      },
      deep: true
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    if (this.value.adults !== undefined) {
      this.adults = this.value.adults
    }
    if (this.value.children !== undefined) {
      this.children = this.value.children
    }
    if (this.value.childrenAges !== undefined) {
      this.childrenAges = this.value.childrenAges
    }
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    adultMod(amount) {
      if (
        this.adults + amount > this.maxAdultsCount ||
        this.adults + amount < this.minAdultsCount ||
        this.adults + amount + this.children > this.maxOverallCount
      ) {
        return
      }

      this.adults = this.adults + amount

      this.$emit('input', {
        adults: this.adults,
        children: this.children,
        childrenAges: this.childrenAges
      })
    },
    childrenMod(amount) {
      if (
        this.children + amount > this.maxChildrenCount ||
        this.children + amount < 0 ||
        this.children + amount + this.adults > this.maxOverallCount
      ) {
        return
      }

      this.children = this.children + amount

      if (this.childrenAges.length > this.children) {
        this.childrenAges = this.childrenAges.slice(0, this.children)
      } else if (this.childrenAges.length < this.children) {
        this.childrenAges.push(0)
      }

      this.$emit('input', {
        adults: this.adults,
        children: this.children,
        childrenAges: this.childrenAges
      })
    },
    childrenAgeMod() {
      this.$emit('ageInput', {
        adults: this.adults,
        children: this.children,
        childrenAges: this.childrenAges
      })
    },
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)

      if (!isChild) {
        if (this.active) {
          // STOP! ... HAMMER TIME!
          this.active = false
        }
        this.active = false
      }
    },
    displayGuests() {
      const guestText = getGuestText(this.adults, this.children)
      return guestText === '' ? '-' : guestText
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-lighter-opaque'
          : this.error.length > 0
          ? 'border-2 border-danger bg-white'
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
