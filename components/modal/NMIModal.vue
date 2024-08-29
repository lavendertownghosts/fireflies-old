<template>
  <transition name="fade">
    <div
      class="fixed top-0 bottom-0 left-0 w-full flex items-center justify-center z-30 overflow-hidden h-screen px-16 bg-black-opaque"
    >
      <div
        ref="modalContainer"
        class="flex flex-wrap bg-white rounded p-16 pb-0 md:w-504 w-full"
      >
        <div class="w-full h-full pb-15 relative">
          <slot name="body">
            <div class="flex w-full text-black mb-24">
              <div class="flex flex-grow text-lg font-bold leading-24">
                {{ $t('general.PaymentModalTitle') }}
              </div>
              <div class="flex items-center">
                <i
                  class="fas fa-times opacity-50 cursor-pointer"
                  @click="close()"
                ></i>
              </div>
            </div>
            <PaymentSkeleton v-show="!contentLoaded" />
            <div id="popUpNMIHtml"></div>
          </slot>
        </div>
        <div
          class="w-504 flex flex-col rounded-b bg-grey-light text-xs -mr-16 -ml-16 py-12 px-16"
        >
          <div class="flex mb-4">
            {{ $t('general.PaymentModalFooter') }}
          </div>
          <div class="flex flex-row items-center justify-between">
            <div class="flex items-center">
              <img src="~static/images/visa.svg" width="74" class="-ml-15" />
              <img
                src="~static/images/master_card.svg"
                width="74"
                class="-ml-15 md:w-72 w-56"
              />
              <img src="~static/images/maestro.svg" width="74" class="-ml-20" />
              <div
                class="font-bold md:-ml-5 -ml-10 md:flex hidden md:w-72 w-56"
                style="color: #4CBB17"
              >
                {{ $t('general.PaymentModalSlogan') }}
              </div>
            </div>
            <div class="flex items-center">
              <img
                src="~static/images/apm_test_nuvei.svg"
                width="18"
                height="18"
                class="mr-7"
              />
              <img
                src="~static/images/nmi-logo.png"
                width="67"
                height="24"
                class="mr-5 md:w-64 w-48 md:h-24 h-16"
              />
              <img
                src="~static/images/pci-dss-logo.svg"
                width="60"
                height="24"
                class="md:w-60 w-40 md:h-24 h-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PaymentSkeleton from '@/components/skeleton/PaymentSkeleton'

export default {
  name: 'NMIModal',
  components: {
    PaymentSkeleton
  },
  props: {
    popup: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      contentLoaded: false,
      eventData: false
    }
  },
  watch: {
    popup(newVal) {
      if (newVal) {
        this.initNMIPopup()
      }
    }
  },
  mounted() {
    if (this.popup !== false) {
      this.initNMIPopup()
    }
  },
  methods: {
    initNMIPopup() {
      this.contentLoaded = false
      document.getElementById('popUpNMIHtml').innerHTML = ''
      const encoder = document.createElement('div')
      encoder.innerHTML = this.popup.replace('<![CDATA[', '').replace(']]>', '')
      const scriptEl = document
        .createRange()
        .createContextualFragment(encoder.innerHTML)
      document.getElementById('popUpNMIHtml').append(scriptEl)
      window.setTimeout(() => {
        this.contentLoaded = true
      }, 5000)
      document.addEventListener('callFinishPayment', this.redirector)
    },
    async redirector(event) {
      if (this.contentLoaded) {
        this.contentLoaded = false
        this.eventData = event.detail
        const paymentCallback = await this.$store.dispatch(
          'user/paymentCallback',
          this.eventData
        )
        if (paymentCallback.orderToken !== undefined) {
          window.location.href = paymentCallback.redirectUrl
          this.$emit('close')
        }
      }
      this.contentLoaded = false
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style>
.h-vfull {
  height: 100vh;
}

#Ccnumber input,
#Ccexp input,
#Cvv input,
#first_name input,
#last_name input {
  @apply w-full h-48 bg-white border border-grey leading-16 text-base py-14 mb-3 px-12 rounded text-black;
}

#Ccnumber input:focus,
#Ccexp input:focus,
#Cvv input:focus,
#first_name input:focus,
#last_name input:focus {
  @apply outline-none border-primary;
}

input.invalid {
  @apply border border-2 border-danger;
}

iframe.CollectJSInvalid {
  border: 2px solid #fc3c3c !important;
  border-radius: 5px;
}

#customPayButton {
  @apply bg-danger w-full text-white leading-16 px-20 py-16 rounded text-base font-bold;
}

#customPayButton:focus {
  @apply outline-none bg-black no-underline;
}

#popUpNMIHtml {
  min-height: 320px;
}

@media only screen and (max-width: 504px) {
  #Ccnumber input,
  #Ccexp input,
  #Cvv input,
  #first_name input,
  #last_name input {
    @apply h-40;
  }
}
</style>
