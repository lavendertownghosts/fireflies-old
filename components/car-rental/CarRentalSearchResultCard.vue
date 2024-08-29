<template>
  <div
    :class="
      bestPrice
        ? hover
          ? 'border-primary-dark'
          : 'border-primary'
        : hover
        ? 'border-grey'
        : 'border-grey-light'
    "
    class="flex flex-col lg:flex-row border rounded cursor-pointer"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="showCarRentalDetails"
  >
    <!-- Header if best price-->
    <div v-show="bestPrice" class="flex bg-primary p-10 items-center">
      <div class="w-full text-center text-white leading-14 text-sm font-bold">
        #1
      </div>
    </div>
    <!-- Body-->
    <div
      :class="[bestPrice ? 'bg-primary-opaque' : '']"
      class="w-full flex flex-col"
    >
      <div class="flex flex-col sm:flex-row h-full px-16 mb-16 sm:mb-0">
        <div
          class="flex relative my-16 w-full justify-center sm:mr-16 car-rental-image"
        >
          <div
            class="absolute top-0 bottom-0 right-0 left-0 w-full text-center center-custom-item -mt-16"
          >
            <i class="far fa-image-polaroid text-xl"></i>
          </div>
          <div
            :style="{
              backgroundImage:
                'url(' + carRental.image.replace(/ /g, '%20') + ')'
            }"
            class="w-full bg-contain bg-no-repeat bg-center z-10 cursor-help"
            :alt="carRental.title"
            :title="carRental.title"
          />
        </div>
        <div class="flex flex-grow flex-col sm:justify-center sm:my-15">
          <div class="flex flex-row h-full">
            <div class="flex flex-grow flex-row flex-col justify-center">
              <div class="text-sm">
                {{ carRental.category }}
              </div>
              <div
                :class="hover ? 'underline' : ''"
                class="font-bold leading-16 text-black title-max-width"
              >
                {{ carRental.title }}
              </div>
              <div class="text-xs leading-12 text-grey-dark mt-4">
                {{ $t('carrent.OrSimilar') }}
              </div>
            </div>
            <div class="flex flex-initial">
              <div class="h-32">
                <img
                  :src="carRental.vendor_img"
                  :title="carRental.vendor"
                  class="cursor-help"
                />
              </div>
            </div>
          </div>
          <div class="bg-grey-light h-1 my-16"></div>
          <div class="flex flex-row">
            <div
              v-for="(item, index) in carSpecification.slice(
                0,
                visibleCarSpecification
              )"
              :key="index"
              :class="item.extraClass"
              :title="item.altText"
              class="mr-16 text-sm leading-14 cursor-help"
            >
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </div>
            <div
              ref="moreCarSpecificationBtn"
              :class="
                moreCarSpecificationActive ? 'text-black' : 'text-primary'
              "
              class="text-sm leading-14 items-center cursor-pointer"
              @click="moreCarSpecificationActive = !moreCarSpecificationActive"
            >
              <i class="fas fa-ellipsis-h mr-4"></i>
              <span>{{ $t('carrent.More') }}</span>
              <div ref="moreCarSpecification" class="relative">
                <div
                  v-show="moreCarSpecificationActive && innerWidth >= 1024"
                  class="absolute z-10 w-288 shadow-drop mt-4"
                >
                  <div
                    class="flex flex-col bg-white px-16 pt-16 pb-4 text-sm leading-14 rounded text-grey-dark"
                  >
                    <div
                      v-for="(item, index) in carSpecification.slice(
                        visibleCarSpecification
                      )"
                      :key="index"
                      :title="item.altText"
                      class="mb-12 items-center cursor-help"
                    >
                      <i :class="item.icon"></i>
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="moreCarSpecification" class="relative sm:ml-24">
            <div
              v-show="moreCarSpecificationActive && innerWidth < 1024"
              class="absolute z-20 w-288 shadow-drop mt-4"
            >
              <div
                class="flex flex-col bg-white px-16 pt-16 pb-4 text-sm leading-14 rounded"
              >
                <div
                  v-for="(item, index) in carSpecification.slice(
                    visibleCarSpecification
                  )"
                  :key="index"
                  :title="item.altText"
                  class="mb-12 items-center cursor-help"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer-->
    <div
      :class="[
        bestPrice
          ? 'bg-primary'
          : 'bg-grey-lighter-opaque border-t border-grey-light lg:border-t-0 lg:border-l'
      ]"
      class="flex flex-row w-full flex-1 lg:w-full"
    >
      <div
        :class="bestPrice ? 'mx-1' : ''"
        class="flex flex-row w-full justify-end items-center lg:flex-col lg:justify-center"
      >
        <div
          :class="bestPrice ? 'text-white' : 'text-black'"
          class="text-2x leading-18 font-bold mr-16 items-center lg:flex lg:w-full lg:justify-center lg:mr-0"
        >
          {{ currency }}
          {{
            Math.ceil(carRental.price[currency])
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </div>
        <div
          :class="bestPrice ? 'my-16 lg:px-1' : 'my-15'"
          class="mr-16 bg-dark-hard lg:flex lg:w-full lg:m-0 lg:mt-16 lg:justify-center lg:px-42 lg:mx-4"
        >
          <ButtonSmall :type="bestPrice ? 'danger' : 'inverted'">
            {{ $t('carrent.Details') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCarSpecification } from '@/includes/CarRentalEquipments'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'CarRentalSearchResultCard',
  components: {
    ButtonSmall
  },
  props: {
    bestPrice: {
      type: Boolean,
      default: false
    },
    carRental: {
      type: Object,
      required: true
    },
    searchId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      innerWidth: 0,
      hover: false,
      moreCarSpecificationActive: false,
      visibleCarSpecification: 2,
      carSpecification: []
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    getCarSpecification() {
      return getCarSpecification(this.carRental)
    }
  },
  mounted() {
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.carSpecification = getCarSpecification(this.carRental)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    calculateSize() {
      this.innerWidth = window.innerWidth
      this.visibleCarSpecification =
        this.innerWidth < 520
          ? 2
          : this.innerWidth >= 520 && this.innerWidth < 1280
          ? 3
          : 4
    },
    onDocumentMouseUp(e) {
      const isChild = this.$refs.moreCarSpecification.contains(e.target)
      if (!isChild) {
        this.moreCarSpecificationActive = false
      }
    },
    showCarRentalDetails(e) {
      const isChild = this.$refs.moreCarSpecificationBtn.contains(e.target)
      if (!isChild) {
        const routeData = this.$router.resolve({
          path:
            '/car-rental/search/' +
            this.searchId +
            '/' +
            this.carRental.veh_perf
        })
        const newWnd = window.open(this.localePath(routeData.href), '_blank')
        newWnd.opener = null
      }
    }
  }
}
</script>

<style scoped>
.car-rental-image {
  height: 79px;
}
.center-custom-item {
  top: 50%;
}
@media (min-width: 520px) {
  .car-rental-image {
    width: 106px;
  }
}
.title-max-width {
  max-width: 400px;
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .title-max-width {
    max-width: 250px;
  }
}
@media (min-width: 520px) and (max-width: 1023px) {
  .title-max-width {
    max-width: 185px;
  }
}
</style>
