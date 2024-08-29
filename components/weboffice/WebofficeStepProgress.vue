<template>
  <div :class="extraClass">
    <div
      v-show="title"
      class="text-sm leading-20 font-bold mb-6"
      v-html="title"
    />
    <div>
      <ul class="flex flex-row">
        <li
          v-for="i in getLength"
          v-show="(ignoreFirst && i > 1) || !ignoreFirst"
          :key="i"
          class="flex flex-row w-full items-center"
        >
          <div
            v-if="
              inactiveType === 'circle' ||
                (inactiveType === 'verticalLine' &&
                  (i - 1 <= active || getException(i - 1) !== false))
            "
            :class="
              i - 1 <= active
                ? getException(i - 1) !== false &&
                  getException(i - 1).circleType === 'inverse'
                  ? 'border border-primary text-primary'
                  : 'bg-primary text-white'
                : getException(i - 1) !== false &&
                  getException(i - 1).circleType === 'inverse'
                ? 'border border-grey text-grey'
                : 'bg-grey text-grey-dark'
            "
            class="flex relative text-xs leading-12 font-bold w-24 h-24 rounded-full justify-center items-center"
          >
            <div
              v-show="
                getException(i - 1) !== false &&
                  getException(i - 1).infoBox !== undefined
              "
              :class="
                getException(i - 1) !== false &&
                getException(i - 1).extraClass !== undefined
                  ? getException(i - 1).extraClass
                  : ''
              "
              class="absolute text-black sm:w-128 text-center mb-64 bg-white px-8 py-4 border border-grey-light p-16 rounded shadow-drop"
              v-html="getException(i - 1).infoBox"
            />
            <div>{{ firstValue + i - 1 }}</div>
          </div>
          <div
            v-else-if="inactiveType === 'verticalLine'"
            :class="i - 1 <= active ? 'bg-primary' : 'bg-grey'"
            class="flex w-2 h-8"
          />
          <div
            v-else-if="inactiveType === 'checklist'"
            :class="
              i - 1 < active
                ? 'bg-primary'
                : i === active + 1
                ? 'bg-white border-primary border'
                : 'bg-grey'
            "
            class="flex text-white text-xs leading-12 font-bold w-24 h-24 rounded-full justify-center items-center"
          >
            <div><i v-if="i - 1 < active" class="fas fa-check"></i></div>
          </div>
          <div class="flex flex-grow justify-center items-center">
            <div
              :class="i - 1 < active ? 'bg-primary' : 'bg-grey-light'"
              class="h-4 w-full"
            ></div>
          </div>
        </li>
        <li class="flex flex-row">
          <div
            :class="
              inactiveType === 'checklist' && active === getLength + 1
                ? 'bg-primary'
                : inactiveType === 'checklist' && active === getLength
                ? 'bg-white border border-primary'
                : inactiveType !== 'checklist' && active === getLength
                ? getException(getLength) !== false &&
                  getException(getLength).circleType === 'inverse'
                  ? 'border border-primary text-primary'
                  : 'bg-primary text-white'
                : getException(getLength) !== false &&
                  getException(getLength).circleType === 'inverse'
                ? 'border border-grey text-grey'
                : 'bg-grey text-grey-dark'
            "
            class="flex relative text-xs leading-12 font-bold w-24 h-24 rounded-full justify-center items-center"
          >
            <div
              v-show="
                getException(getLength) !== false &&
                  getException(getLength).infoBox !== undefined
              "
              :class="
                getException(getLength) !== false &&
                getException(getLength).extraClass !== undefined
                  ? getException(getLength).extraClass
                  : ''
              "
              class="absolute text-black right-0 sm:w-100 text-center mb-64 bg-white px-8 py-4 border border-grey-light p-16 rounded shadow-drop"
            >
              {{ getException(getLength).infoBox }}
            </div>
            <div v-if="inactiveType === 'checklist'">
              <i v-if="active === getLength + 1" class="fas fa-check"></i>
            </div>
            <div v-else-if="!ignoreLast">{{ getLength }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebofficeStepProgress',
  props: {
    title: {
      type: [Boolean, String],
      default: false
    },
    length: {
      type: Number,
      required: true
    },
    active: {
      type: Number,
      required: true
    },
    inactiveType: {
      type: String,
      default: 'circle'
    },
    extraClass: {
      type: String,
      default: ''
    },
    exceptionPoints: {
      type: [Boolean, Array],
      default: false
    },
    ignoreFirst: {
      type: Boolean,
      default: false
    },
    ignoreLast: {
      type: Boolean,
      default: false
    },
    firstValue: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getLength() {
      if (this.inactiveType === 'checklist') {
        return this.length - 1
      } else {
        return this.length
      }
    }
  },
  methods: {
    getException(item) {
      if (this.exceptionPoints !== false && this.exceptionPoints.length > 0) {
        for (let i = 0; i < this.exceptionPoints.length; i++) {
          if (
            this.exceptionPoints[i].point === item &&
            this.exceptionPoints[i].showPoint === true
          ) {
            return this.exceptionPoints[i]
          }
        }
      }
      return false
    }
  }
}
</script>
