<template>
  <div>
    <li
      v-show="showItem || showAll"
      :class="[
        isLastItem ? '' : level === 1 ? 'mb-16' : level === 2 ? 'mb-12' : 'mb-8'
      ]"
    >
      <div
        class="flex flex-row cursor-pointer justify-between text-sm leading-14"
        :class="[level === 1 ? 'font-bold' : '']"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <div
          :class="[
            hover ? 'underline' : '',
            activeItem === item.name ? 'text-primary' : ''
          ]"
          class="flex-grow"
          @click="level === 1 ? toggle() : toggle(item.name)"
        >
          {{ item.name }}
        </div>
        <div v-if="isParent" @click="toggle(activeItem, false)">
          <i
            class="fas"
            :class="[
              isOpen ? 'fa-chevron-up' : 'fa-chevron-down',
              hover ? 'opacity-50' : ''
            ]"
          ></i>
        </div>
      </div>
      <ul v-show="isOpen" v-if="isParent" class="pl-8 pt-12">
        <TreeView
          v-for="(child, index) in item.children"
          :key="index"
          :item="child"
          :active-item="activeItem"
          :show-item="index < 3 ? true : false"
          :show-all="
            item.children.length <= 3 || showAllChildren ? true : false
          "
          :is-last-item="item.children.length - 1 === index"
          :level="level + 1"
          @changeActiveCategory="$emit('changeActiveCategory', $event)"
          @showAllItem="showAllItem"
        ></TreeView>
      </ul>
    </li>
    <li
      v-show="!showAll && isLastItem"
      class=" text-sm leading-14 text-primary cursor-pointer hover:underline mb-0"
      @click="$emit('showAllItem')"
    >
      További témák
    </li>
  </div>
</template>

<script>
export default {
  name: 'TreeView',
  props: {
    item: {
      type: Object,
      required: true
    },
    activeItem: {
      type: String,
      default: ''
    },
    showItem: {
      type: Boolean,
      default: true
    },
    showAll: {
      type: Boolean,
      default: true
    },
    isLastItem: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isOpen: false,
      hover: false,
      showAllChildren: false
    }
  },
  computed: {
    isParent() {
      return this.item.children && this.item.children.length
    }
  },
  methods: {
    toggle(name, auto = true) {
      if (
        this.isParent &&
        ((name !== this.activeItem && name !== '') || !auto)
      ) {
        this.isOpen = !this.isOpen
      }
      if (auto) {
        this.$emit('changeActiveCategory', {
          category: name,
          level: this.level
        })
      }
    },
    showAllItem() {
      this.showAllChildren = true
    }
  }
}
</script>

<style scoped></style>
