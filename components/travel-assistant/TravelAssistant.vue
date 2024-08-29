<template>
  <div
    id="travel-assistant"
    class="top-0 w-full transition-height duration-500 ease-in-out h-0 overflow-hidden bg-black"
    :class="[
      travelAssistantVisible ? 'show-travel-assistant' : '',
      travelAssistants.length === 0 ? 'hide-travel-assistant' : '',
      travelAssistantVisible && travelAssistants.length > 0
        ? countActiveService > 0
          ? 'service-num-' + countActiveService
          : ''
        : ''
    ]"
  >
    <div class="bg-white opacity-90">
      <div class="w-full bg-black ">
        <div class="flex flex-wrap px-16 xl:px-40 max-w-screen-xl mx-auto py-3">
          <div class="flex items-center flex-grow">
            <div v-if="travelAssistants.length > 1">
              <i
                class="fas fa-chevron-left text-primary cursor-pointer"
                @click="showItem('previous')"
              ></i>
              <span class="text-pink px-8"
                >{{ getTravelAssistantPosition() }}/{{
                  travelAssistants.length
                }}</span
              >
              <i
                class="fas fa-chevron-right text-primary cursor-pointer"
                @click="showItem('next')"
              ></i>
            </div>
          </div>
          <div class="flex items-center block float-right">
            <ButtonSmall
              type="primary"
              :is-disabled="travelAssistants.length >= 5"
              @click="goToNewTravelAssistantForm"
            >
              <i class="fas fa-plus mr-4"></i
              >{{ $t('general.NewTravelAssistant') }}
            </ButtonSmall>
          </div>
          <div class="flex items-center block ml-24 opacity-50 cursor-pointer">
            <i
              class="fas fa-times text-white"
              @click="$emit('showTravelAssistant')"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-black">
      <div class="flex flex-wrap text-sm py-16">
        <TravelAssistantItem
          v-for="(travelAssistant, key) in travelAssistants"
          :id="travelAssistant.id"
          :key="key"
          :travel-assistant="travelAssistant"
          :show="actualItem.id === travelAssistant.id"
          :class="[
            opacityClass,
            actualItem.id === travelAssistant.id ? 'visible' : 'invisible'
          ]"
          :updating="updating"
          @showTravelAssistant="$emit('showTravelAssistant')"
          @removeTravelAssistant="removeTravelAssistant"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ButtonSmall from '@/components/micro/ButtonSmall'
import TravelAssistantItem from '@/components/travel-assistant/TravelAssistantItem'

export default {
  name: 'TravelAssistant',
  components: {
    ButtonSmall,
    TravelAssistantItem
  },
  props: {
    travelAssistantVisible: {
      type: Boolean,
      required: true
    },
    updating: {
      type: Boolean,
      default: false
    },
    travelAssistants: {
      type: Array,
      required: true
    },
    activeTravelAssistant: {
      type: [Boolean, Object],
      required: true
    },
    countActiveService: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      actualItem: false,
      opacityClass: 'opacity-100'
    }
  },
  watch: {
    actualItem: {
      handler(newValue) {
        this.$emit('changeActiveTravelAssistant', newValue)
      }
    },
    activeTravelAssistant: {
      handler(newValue) {
        this.actualItem = newValue
      }
    },
    travelAssistants: {
      handler(newValue) {
        this.travelAssistants = newValue
      }
    }
  },
  mounted() {
    this.actualItem = this.activeTravelAssistant
  },
  methods: {
    ...mapActions('travel-assistant', ['delete', 'undo']),
    showItem(direction) {
      this.opacityClass = 'opacity-0'
      if (this.actualItem !== false && this.travelAssistants.length > 0) {
        setTimeout(() => {
          const actualId = this.actualItem.id
          if (direction === 'next') {
            for (let i = 0; i < this.travelAssistants.length; i++) {
              if (this.travelAssistants[i].id === actualId) {
                if (this.travelAssistants[i + 1] !== undefined) {
                  this.actualItem = this.travelAssistants[i + 1]
                } else {
                  this.actualItem = this.travelAssistants[0]
                }
              }
            }
          } else {
            for (let i = 0; i < this.travelAssistants.length; i++) {
              if (this.travelAssistants[i].id === actualId) {
                if (this.travelAssistants[i - 1] !== undefined) {
                  this.actualItem = this.travelAssistants[i - 1]
                } else {
                  this.actualItem = this.travelAssistants[
                    this.travelAssistants.length - 1
                  ]
                }
              }
            }
          }
          this.opacityClass = 'opacity-100'
        }, 250)
      }
    },

    async removeTravelAssistant(params) {
      const res = await this.delete(params)
      if (res.status === true) {
        this.$eventBus.publish('updateTravelAssistant', false)
        const deleteSuccessMessage = this.$t(
          'general.TravelAssistantDeleteSuccess'
        )
        this.$store.dispatch('general/showSnackbar', {
          message: deleteSuccessMessage.replace('%name%', params.title),
          undoButton: this.$t('general.Undo'),
          undoEvent: async () => {
            await this.undo(params)
            this.$eventBus.publish('updateTravelAssistant')
            await this.$store.dispatch('general/showSnackbar', false)
          }
        })
      }
    },
    getTravelAssistantPosition() {
      if (
        this.travelAssistants.length > 0 &&
        this.actualItem.id !== undefined
      ) {
        for (let i = 0; i < this.travelAssistants.length; i++) {
          if (this.actualItem.id === this.travelAssistants[i].id) {
            return i + 1
          }
        }
      }
      return false
    },
    goToNewTravelAssistantForm() {
      if (this.travelAssistants.length <= 5) {
        this.$router.push(this.localePath('/travel-assistant'))
        this.$emit('showTravelAssistant')
      }
    }
  }
}
</script>

<style>
#travel-assistant.show-travel-assistant.service-num-4 {
  height: 534px;
}
#travel-assistant.show-travel-assistant.service-num-3 {
  height: 475px;
}
#travel-assistant.show-travel-assistant.service-num-2 {
  height: 475px;
}
#travel-assistant.show-travel-assistant.service-num-1 {
  height: 399px;
}
#travel-assistant.show-travel-assistant.hide-travel-assistant {
  height: 46px;
}
@media screen and (min-width: 520px) {
  #travel-assistant.show-travel-assistant.service-num-4 {
    height: 504px;
  }
  #travel-assistant.show-travel-assistant.service-num-3 {
    height: 455px;
  }
  #travel-assistant.show-travel-assistant.service-num-2 {
    height: 455px;
  }
  #travel-assistant.show-travel-assistant.service-num-1 {
    height: 359px;
  }
}
@media screen and (min-width: 772px) {
  #travel-assistant.show-travel-assistant.service-num-4 {
    height: 308px;
  }
  #travel-assistant.show-travel-assistant.service-num-3 {
    height: 308px;
  }
  #travel-assistant.show-travel-assistant.service-num-2 {
    height: 308px;
  }
  #travel-assistant.show-travel-assistant.service-num-1 {
    height: 236px;
  }
}
@media screen and (min-width: 1024px) {
  #travel-assistant.show-travel-assistant.service-num-4 {
    height: 235px;
  }
  #travel-assistant.show-travel-assistant.service-num-3 {
    height: 235px;
  }
  #travel-assistant.show-travel-assistant.service-num-2 {
    height: 235px;
  }
  #travel-assistant.show-travel-assistant.service-num-1 {
    height: 235px;
  }
}
</style>
