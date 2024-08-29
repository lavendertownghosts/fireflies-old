<template>
  <Scrollbar>
    <div style="min-width: 740px">
      <div class="flex flex-row">
        <div :class="dateClass" class="flex flex-col w-1/8"></div>
        <div :class="dateClass" class="flex flex-col w-1/8">
          {{ getDate(date2, -3) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8">
          {{ getDate(date2, -2) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8">
          {{ getDate(date2, -1) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8 font-bold">
          <div>
            {{ getDate(date2, 0) !== getDate(date1, 0) ? 'Visszaút' : 'Odaút' }}
          </div>
          {{ getDate(date2, 0) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8">
          {{ getDate(date2, 1) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8">
          {{ getDate(date2, 2) }}
        </div>
        <div :class="dateClass" class="flex flex-col w-1/8 border-r">
          {{ getDate(date2, 3) }}
        </div>
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col w-1/7">
          <div :class="dateClass" class="flex w-full ">
            {{ getDate(date1, -3) }}
          </div>
          <div :class="dateClass" class="flex w-full ">
            {{ getDate(date1, -2) }}
          </div>
          <div :class="dateClass" class="flex w-full ">
            {{ getDate(date1, -1) }}
          </div>
          <div :class="dateClass" class="flex flex-col w-full font-bold">
            <div>Odaút</div>
            {{ getDate(date1, 0) }}
          </div>
          <div :class="dateClass" class="flex w-full ">
            {{ getDate(date1, 1) }}
          </div>
          <div :class="dateClass" class="flex w-full ">
            {{ getDate(date1, 2) }}
          </div>
          <div :class="dateClass" class="flex w-full border-b">
            {{ getDate(date1, 3) }}
          </div>
        </div>
        <div class="flex-wrap w-full">
          <div class="relative overflow-hidden">
            <ShimmerLayer :is-narrow="innerWidth < 1000" />
            <div v-for="index in 7" :key="index" class="flex flex-row">
              <div
                v-for="index2 in 7"
                :key="index2"
                class="flex flex-col w-1/7"
              >
                <BaseSkeleton
                  height="40px"
                  class="border border-white rounded-none bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Scrollbar>
</template>

<script>
import { addDays, format } from 'date-fns'
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import Scrollbar from '@/components/Scrollbar'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

export default {
  name: 'SkeletonCalendarWrapper',
  components: {
    BaseSkeleton,
    ShimmerLayer,
    Scrollbar
  },
  props: {
    date1: {
      type: Date,
      required: true
    },
    date2: {
      type: Date,
      required: true
    }
  },
  computed: {
    innerWidth() {
      return window.innerWidth
    },
    dateClass() {
      return 'h-40 items-center justify-center text-xs leading-12 border-t border-l border-grey-light cursor-pointer bg-grey-lighter-opaque'
    }
  },
  methods: {
    getDate(date, num) {
      return format(addDays(date, num), 'LL.dd')
    }
  }
}
</script>
