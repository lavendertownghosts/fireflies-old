<template>
  <div
    :class="getCardStyle"
    class="border rounded bg-grey-light bg-opacity-20 sm:pb-0"
  >
    <div class="flex flex-row">
      <div
        :class="getIconStyle"
        class="flex w-48 h-48 items-center justify-center"
      >
        <i :class="getIconClass" class="text-sm leading-14"></i>
      </div>
      <div
        :class="price ? 'border-b border-grey-light sm:border-b-0' : ''"
        class="flex flex-row flex-grow sm:justify-between cursor-pointer"
        @mouseover="hover = true"
        @mouseleave="hover = false"
        @click="$emit('showCartCard')"
      >
        <div
          class="flex items-center pl-12 font-bold text-black leading-16"
          :class="type === 'danger' ? 'text-danger' : ''"
        >
          <span :class="hover ? 'underline' : ''">{{ title }}</span>
          <i
            v-show="showChevron"
            :class="[
              active ? 'fa-chevron-up' : 'fa-chevron-down',
              hover ? 'opacity-50' : ''
            ]"
            class="w-16 text-base ml-8 fas"
          ></i>
        </div>
        <div
          v-if="price"
          :class="hover ? 'underline' : ''"
          class="hidden sm:block font-bold text-black leading-16 p-16"
        >
          <span
            v-if="voucher"
            :class="voucherIsExtra && !getAllowedPV ? 'text-warning' : ''"
          >
            {{ voucher }}
            <span v-if="!getAllowedPV">
              <span class="ff-currency"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
            </span>
            <span v-else class="pr-6 lg:pr-0 xl:pr-6">
              <img class="inline -mt-10" :src="premiumDV" width="36"
            /></span>
            <span class="text-black">
              +
            </span>
          </span>
          <span v-if="credit" class="text-warning">
            {{
              credit
                | formatNumber('0,0', {
                  thousandsSeparator: ' '
                })
            }}
            <span class="ff-currency bg-warning"></span>CR
            <span class="text-black">
              +
            </span>
          </span>
          <span v-if="bpo !== false" class="text-warning">
            {{ bpo }}
            <img class="-mt-7 inline" src="~static/images/bpo-logo.svg" />
            <span class="text-black">
              +
            </span>
          </span>
          EUR
          {{
            price
              | formatNumber('0,0', {
                thousandsSeparator: ' '
              })
          }}
          <span v-show="localPrice > 0" class="text-grey-dark">
            + EUR
            {{
              localPrice
                | formatNumber('0,0', {
                  thousandsSeparator: ' '
                })
            }}
          </span>
        </div>
        <div
          v-else-if="help && type !== 'success'"
          :class="[
            type === 'danger' ? 'text-danger' : 'text-primary',
            hover ? 'underline' : ''
          ]"
          class="hidden lg:block font-bold text-black leading-16 p-16"
        >
          {{ help }}
        </div>
      </div>
    </div>
    <div
      v-show="active"
      class="text-sm leading-20 text-black bg-white border-t border-grey-light"
    >
      <slot />
    </div>
    <div
      v-if="price"
      :class="[
        active ? 'border-t border-grey-light' : '',
        hover ? 'underline' : ''
      ]"
      class="font-bold text-black leading-16 pt-8 pl-16 sm:hidden"
    >
      <span v-if="voucher" :class="voucherIsExtra ? 'text-warning' : ''">
        {{ voucher }}
        <span
          :class="voucherIsExtra ? 'bg-warning' : 'bg-black'"
          class="ff-currency"
        ></span
        >DV
        <span class="text-black">
          +
        </span>
      </span>
      <span v-if="credit" class="text-warning">
        {{
          credit
            | formatNumber('0,0', {
              thousandsSeparator: ' '
            })
        }}
        <span class="ff-currency bg-warning"></span>CR
        <span class="text-black">
          +
        </span>
      </span>
      <span v-if="bpo" class="text-warning">
        {{ bpo }}
        <span class="ff-currency bg-warning"></span>BPO
        <span class="text-black">
          +
        </span>
      </span>
      EUR
      {{
        price
          | formatNumber('0,0', {
            thousandsSeparator: ' '
          })
      }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import premiumDV from '@/assets/images/premium-voucher.svg'

export default {
  name: 'CartCard',
  props: {
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: [Number, Boolean],
      default: false
    },
    localPrice: {
      type: [Number, Boolean],
      default: false
    },
    voucher: {
      type: [Number, Boolean],
      default: false
    },
    credit: {
      type: [Number, Boolean],
      default: false
    },
    bpo: {
      type: [Number, Boolean],
      default: false
    },
    help: {
      type: [String, Boolean],
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    showChevron: {
      type: Boolean,
      default: true
    },
    voucherIsExtra: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      premiumDV,
      hover: false
    }
  },
  computed: {
    ...mapGetters('user', ['getAllowedPV']),
    getCardStyle() {
      let style = ''
      if (this.type === 'warning') {
        style = 'border-warning'
      } else if (this.type === 'success') {
        style = 'border-primary hover:border-primary-dark'
      } else if (this.type === 'danger') {
        style = 'border-danger hover:border-danger-dark'
      } else {
        style = 'border-grey-light hover:border-grey'
      }
      if (this.price) {
        style += ' pb-8'
      }
      return style
    },
    getIconStyle() {
      if (this.type === 'warning') {
        return 'bg-warning text-black'
      } else if (this.type === 'success') {
        return 'text-white ' + (this.hover ? 'bg-primary-dark' : 'bg-primary')
      }
      return ''
    },
    getIconClass() {
      if (this.type === 'success') {
        return 'fas fa-check'
      } else if (this.type === 'danger') {
        return 'fas fa-exclamation-triangle text-danger'
      } else if (this.type === 'warning') {
        return 'fas fa-plus'
      } else {
        return 'fas fa-question text-primary'
      }
    }
  }
}
</script>
