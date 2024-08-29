<template>
  <div class="flex flex-col mb-15">
    <div
      v-if="isPremiumUser"
      class="flex text-black md:rounded w-full font-bold bg-premium px-16 py-8 md:mb-12"
    >
      <img src="~static/images/premium.svg" class="mr-8" />
      {{ $t('weboffice.PremiumClient') }}
    </div>
    <div
      :class="getBackground"
      class="flex text-white bg-green relative md:rounded-t w-full"
    >
      <div :class="getCardBackground" class="flex card-bg px-16">
        <div class="flex flex-col z-10 justify-center py-12">
          <div class="text-sm leading-14 mb-4">
            {{ $t('weboffice.Welcome') }}
          </div>
          <div class="text-sm leading-14 mb-12 hidden md:block">
            {{ getFees !== false ? getFees.fullname : '' }}
          </div>
          <div class="text-lg leading-24 md:mb-12" v-html="getUserLevelName" />
          <div class="text-xs leading-12 italic hidden md:block uppercase">
            {{ $t('weboffice.AmountInQuarantine') }}
          </div>
        </div>
      </div>
    </div>
    <div
      :class="getPowerBackground"
      class="flex text-white bg-green relative md:rounded-b w-full"
    >
      <div :class="getPowerCardBackground" class="flex card-bg px-16">
        <div class="flex flex-col z-10 justify-center py-12">
          <div
            class="text-lg leading-24 md:mb-12"
            v-html="getUserPowerLevelName"
          />
          <div class="text-xs leading-12 italic hidden md:block uppercase">
            {{ $t('weboffice.PowerlineCardDesc') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserLevelName } from '@/includes/utils'

export default {
  name: 'WebofficeQualification',
  computed: {
    ...mapGetters('user', ['getFees', 'isPremiumUser']),
    getBackground() {
      if (
        this.getFees.currentPowerLevel === 'GOLD' ||
        this.getFees.currentPowerLevel === 'FOUNDERGOLD'
      ) {
        return 'bg-gold'
      } else if (this.getFees.currentPowerLevel === 'EC') {
        return 'bg-grey'
      } else if (
        this.getFees.currentPowerLevel === 'PLATINUM' ||
        this.getFees.currentPowerLevel === 'FOUNDERPLATINUM'
      ) {
        return 'bg-platinum'
      } else {
        return 'bg-green'
      }
    },
    getPowerBackground() {
      if (
        this.getFees.currentLevel === 'GOLD' ||
        this.getFees.currentLevel === 'FOUNDERGOLD'
      ) {
        return 'bg-gold'
      } else if (this.getFees.currentLevel === 'EC') {
        return 'bg-grey'
      } else if (
        this.getFees.currentLevel === 'PLATINUM' ||
        this.getFees.currentLevel === 'FOUNDERPLATINUM'
      ) {
        return 'bg-platinum'
      } else {
        return 'bg-green'
      }
    },
    getCardBackground() {
      if (this.getFees !== false) {
        if (
          this.getFees.currentPowerLevel === 'GOLD' ||
          this.getFees.currentPowerLevel === 'FOUNDERGOLD'
        ) {
          return 'card-bg-gold'
        } else if (this.getFees.currentPowerLevel === 'EC') {
          return 'card-bg-grey'
        } else if (
          this.getFees.currentPowerLevel === 'PLATINUM' ||
          this.getFees.currentPowerLevel === 'FOUNDERPLATINUM'
        ) {
          return 'card-bg-platinum'
        } else {
          return 'card-bg-green'
        }
      } else {
        return ''
      }
    },
    getPowerCardBackground() {
      if (this.getFees !== false) {
        if (
          this.getFees.currentLevel === 'GOLD' ||
          this.getFees.currentLevel === 'FOUNDERGOLD'
        ) {
          return 'card-bg-gold'
        } else if (this.getFees.currentLevel === 'EC') {
          return 'card-bg-grey'
        } else if (
          this.getFees.currentLevel === 'PLATINUM' ||
          this.getFees.currentLevel === 'FOUNDERPLATINUM'
        ) {
          return 'card-bg-platinum'
        } else {
          return 'card-bg-green'
        }
      } else {
        return ''
      }
    },
    getUserLevelName() {
      if (this.getFees !== false) {
        return getUserLevelName(this.getFees.currentLevel)
      } else {
        return ''
      }
    },
    getUserPowerLevelName() {
      if (this.getFees !== false) {
        return (
          getUserLevelName(this.getFees.currentPowerLevel) +
          ' <div class="text-xs leading-12">' +
          this.$t('weboffice.CareerLevel') +
          '</div>'
        )
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.bg-green {
  background: linear-gradient(52.52deg, #6abb82 6.83%, #368a4f 93.86%);
}
.bg-gold {
  background: linear-gradient(89.78deg, #dcab6c 0.17%, #b77a2b 99.81%);
}
.bg-grey {
  background: linear-gradient(90deg, #6a727f 0%, #9ea7b6 100.01%);
}
.bg-platinum {
  background: linear-gradient(90deg, #90a5aa 0%, #59696c 100.01%);
}
.bg-premium {
  background: rgb(224, 170, 62);
  background: -moz-linear-gradient(
    90deg,
    rgba(224, 170, 62, 1) 0%,
    rgba(247, 239, 138, 1) 25%,
    rgba(224, 170, 62, 1) 50%,
    rgba(249, 242, 149, 1) 75%,
    rgba(224, 170, 62, 1) 100%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(224, 170, 62, 1) 0%,
    rgba(247, 239, 138, 1) 25%,
    rgba(224, 170, 62, 1) 50%,
    rgba(249, 242, 149, 1) 75%,
    rgba(224, 170, 62, 1) 100%
  );
  background: linear-gradient(
    90deg,
    rgba(224, 170, 62, 1) 0%,
    rgba(247, 239, 138, 1) 25%,
    rgba(224, 170, 62, 1) 50%,
    rgba(249, 242, 149, 1) 75%,
    rgba(224, 170, 62, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#e0aa3e",endColorstr="#e0aa3e",GradientType=1);
}
.card-bg::before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-repeat: no-repeat;
}
.card-bg-green::before {
  background-image: url('~assets/images/ff-logo-green.svg');
}
.card-bg-gold::before {
  background-image: url('~assets/images/ff-logo-gold.svg');
}
.card-bg-grey::before {
  background-image: url('~assets/images/ff-logo-grey.svg');
}
.card-bg-platinum::before {
  background-image: url('~assets/images/ff-logo-platinum.svg');
}
</style>
