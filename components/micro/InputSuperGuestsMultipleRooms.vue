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
      <div v-show="error.length > 0" class="text-danger text-xs">
        {{ error }}
      </div>
    </div>

    <!-- Filter overlay modal-->
    <DefaultModal
      v-show="active"
      :is-super-popup="true"
      :modal-max-width="'488px'"
      class="h-full py-20"
    >
      <div slot="header">
        <div class="flex w-full text-black">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ label }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="active = false"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body" class="py-16">
        <div
          class="bg-white rounded text-black flex flex-col text-base leading-16 z-10"
        >
          <div v-for="(guests, room) in guestsArray" :key="room" class="mb-16">
            <div v-show="guestsArray.length > 1" class="mb-16">
              <div class="flex flex-row justify-between items-center">
                <div class="font-bold">
                  {{ $t('hotel.Room') }} {{ room + 1 }}
                </div>
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
            <!-- PASSENGERS DATA -->
            <div
              v-for="(passenger, index) in guests.passengerData.adults"
              :key="index"
              class="mt-16"
            >
              <h3 class="text-sm font-bold capitalize">
                {{ $t('general.Adult') }} {{ index + 1 }}
              </h3>
              <div class="flex flex-row mt-12">
                <InputText
                  v-model="guests.passengerData.adults[index].firstname"
                  :error="errors[room].adults[index].firstname"
                  :class="'w-full mr-7'"
                  :label="$t('general.FirstName')"
                />

                <InputText
                  v-model="guests.passengerData.adults[index].lastname"
                  :error="errors[room].adults[index].lastname"
                  :class="'w-full ml-7'"
                  :label="$t('general.LastName')"
                />
              </div>
              <div class="flex flex-row mt-12">
                <InputDropdown
                  v-model="guests.passengerData.adults[index].nationality"
                  :error="errors[room].adults[index].nationality"
                  :values="countrySelect"
                  :is-filterable="true"
                  :label="$t('general.Nationality')"
                  :placeholder="$t('general.PleaseSelect')"
                />
              </div>
            </div>
            <div
              v-for="(passenger, index2) in guests.passengerData.children"
              :key="index2"
              class="mt-16"
            >
              <div v-if="guests.passengerData.children[index2] !== undefined">
                <h3 class="text-sm font-bold capitalize">
                  {{ $t('general.Child') }} {{ index2 + 1 }}
                </h3>
                <div class="flex flex-row mt-12">
                  <InputText
                    v-model="guests.passengerData.children[index2].firstname"
                    :error="errors[room].children[index2].firstname"
                    :class="'w-full mr-7'"
                    :label="$t('general.FirstName')"
                  />

                  <InputText
                    v-model="guests.passengerData.children[index2].lastname"
                    :error="errors[room].children[index2].lastname"
                    :class="'w-full ml-7 mr-7'"
                    :label="$t('general.LastName')"
                  />
                  <InputDropdown
                    v-model="guests.passengerData.children[index2].age"
                    :error="errors[room].children[index2].age"
                    :values="ageDropdownValues"
                    :label="$t('general.Age')"
                    class="ml-7"
                  />
                </div>
              </div>
              <div
                v-show="
                  !(guestsArray.length === maxRooms && room === maxRooms - 1)
                "
                class="w-full h-1 border border-t-1 border-grey-light my-16"
              ></div>
            </div>
          </div>
        </div>
        <div
          v-show="guestsArray.length < maxRooms && totalCount < maxOverallCount"
        >
          <ButtonSmall
            type="inverted"
            :input-style="['w-full']"
            class="mb-16 mt-16"
            @click="addRoom()"
          >
            <i class="fal fa-plus"></i> {{ $t('hotel.AddRoom') }}
          </ButtonSmall>
        </div>
        <ButtonSmall
          class="w-full rounded-t-none rounded-b-none"
          type="primary"
          @click="saveEvent()"
          >{{ $t('weboffice.Save') }}</ButtonSmall
        >
      </div>
      <div slot="footer" class=""></div>
    </DefaultModal>
  </div>
</template>

<script>
import { getGuestText, getCountrySelectDatas } from '@/includes/utils'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import DefaultModal from '@/components/modal/DefaultModal'

export default {
  name: 'InputSuperGuestsMultipleRooms',
  components: {
    ButtonSmall,
    InputDropdown,
    InputText,
    DefaultModal
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
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
            passengerData: {
              adults: [
                { firstname: '', lastname: '', nationality: '' },
                { firstname: '', lastname: '', nationality: '' }
              ],
              children: []
            }
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
      countrySelect: getCountrySelectDatas().countrySelect,
      countrySelectIds: getCountrySelectDatas().countrySelectIds,
      countrySelectCodes: getCountrySelectDatas().countrySelectCodes,
      firstOpen: true,
      guestsArray: [
        {
          adults: 2,
          children: 0,
          passengerData: {
            adults: [
              { firstname: '', lastname: '', nationality: '' },
              { firstname: '', lastname: '', nationality: '' }
            ],
            children: []
          }
        }
      ],
      errors: [
        {
          adults: [
            { firstname: '', lastname: '', nationality: '' },
            { firstname: '', lastname: '', nationality: '' }
          ],
          children: []
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
    this.firstOpen = true
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    addRoom() {
      if (this.maxOverallCount - this.totalCount <= 0) {
        return
      }

      this.errors.push({
        adults:
          this.maxOverallCount - this.totalCount === 1
            ? [{ firstname: '', lastname: '', nationality: '' }]
            : [
                { firstname: '', lastname: '', nationality: '' },
                { firstname: '', lastname: '', nationality: '' }
              ],
        children: []
      })

      this.guestsArray.push({
        adults: this.maxOverallCount - this.totalCount === 1 ? 1 : 2,
        children: 0,
        passengerData: {
          adults:
            this.maxOverallCount - this.totalCount === 1
              ? [{ firstname: '', lastname: '', nationality: '' }]
              : [
                  { firstname: '', lastname: '', nationality: '' },
                  { firstname: '', lastname: '', nationality: '' }
                ],
          children: []
        }
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

      this.errors[room].adults = this.errors[room].adults.slice(
        0,
        this.guestsArray[room].adults
      )

      if (amount > 0) {
        this.errors[room].adults.push({
          firstname: '',
          lastname: '',
          nationality: ''
        })
      }

      this.guestsArray[room].adults = this.guestsArray[room].adults + amount

      this.guestsArray[room].passengerData.adults = this.guestsArray[
        room
      ].passengerData.adults.slice(0, this.guestsArray[room].adults)

      if (amount > 0) {
        this.guestsArray[room].passengerData.adults.push({
          firstname: '',
          lastname: '',
          nationality: ''
        })
      }
    },
    childrenMod(amount, room) {
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

      this.guestsArray[room].passengerData.children = this.guestsArray[
        room
      ].passengerData.children.slice(0, this.guestsArray[room].children)

      this.errors[room].children = this.errors[room].children.slice(
        0,
        this.guestsArray[room].children
      )

      if (amount > 0) {
        this.guestsArray[room].passengerData.children.push({
          firstname: '',
          lastname: '',
          age: 0
        })

        this.errors[room].children.push({
          firstname: '',
          lastname: '',
          age: ''
        })
      }
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
      if (this.firstOpen) {
        if (this.placeholder !== '') {
          return this.placeholder
        }
      }

      const guestText = getGuestText(this.adultCount, this.childrenCount)
      return guestText === '' ? '-' : guestText
    },
    validate() {
      let isValid = true

      // RESET ALL ERROR
      for (const room in this.errors) {
        for (const index in this.errors[room].adults) {
          this.errors[room].adults[index] = {
            firstname: '',
            lastname: '',
            nationality: ''
          }
        }

        for (const index in this.errors[room].children) {
          this.errors[room].children[index] = {
            firstname: '',
            lastname: '',
            age: ''
          }
        }
      }

      this.$forceUpdate()

      // CHECK ALL ROOM ALL INPUT
      for (const room in this.guestsArray) {
        for (const index in this.guestsArray[room].passengerData.adults) {
          for (const key in this.guestsArray[room].passengerData.adults[
            index
          ]) {
            if (
              this.guestsArray[room].passengerData.adults[index][key] === ''
            ) {
              this.errors[room].adults[index][key] = this.$t(
                'general.FieldRequired'
              )
              isValid = false
            } else if (
              !/^[\x20-\x7E]+$/.test(
                this.guestsArray[room].passengerData.adults[index][key]
              )
            ) {
              this.errors[room].adults[index][key] = this.$t(
                'flight.NameContainsInvalidCharachters'
              )
              isValid = false
            }
          }
        }

        for (const index in this.guestsArray[room].passengerData.children) {
          for (const key in this.guestsArray[room].passengerData.children[
            index
          ]) {
            if (
              this.guestsArray[room].passengerData.children[index][key] === ''
            ) {
              this.errors[room].children[index][key] = this.$t(
                'general.FieldRequired'
              )
              isValid = false
            } else if (
              !/^[\x20-\x7E]+$/.test(
                this.guestsArray[room].passengerData.children[index][key]
              )
            ) {
              this.errors[room].children[index][key] = this.$t(
                'flight.NameContainsInvalidCharachters'
              )
              isValid = false
            }
          }
        }
      }

      return isValid
    },
    saveEvent() {
      if (this.validate()) {
        this.$emit('input', this.guestsArray)
        this.active = false
        this.firstOpen = false
      }
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-opaque'
          : this.error.length > 0 && this.isDark
          ? 'bg-white border border-danger'
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

<style></style>
