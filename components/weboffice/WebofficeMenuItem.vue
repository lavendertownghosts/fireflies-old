<template>
  <div>
    <li
      :class="[
        level === 1 ? 'border-opacity-50' : '',
        activeMenus[activeMenus.length - 1] !== undefined &&
        activeMenus[activeMenus.length - 1] === item.name &&
        item.link !== undefined &&
        activeMenus.length === level
          ? 'bg-primary text-white hover:bg-primary-dark'
          : level === 2
          ? 'bg-grey-light bg-opacity-75 border-opacity-75'
          : level === 3
          ? 'bg-grey bg-opacity-60'
          : ''
      ]"
      class="text-sm leading-14 text-black border-t border-grey"
    >
      <div @click="toggle(item.name)">
        <nuxt-link
          :to="item.link !== undefined ? localePath(item.link) : ''"
          :class="getPaddingLeft"
          class="flex hover:underline py-16 pr-16"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        >
          <div class="flex-grow">{{ $t('weboffice.' + item.name) }}</div>
          <div>
            <i
              v-if="item.children !== undefined && item.children.length > 0"
              class="fas"
              :class="
                activeMenus[level - 1] !== undefined &&
                activeMenus[level - 1] === item.name
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
              "
            ></i>
          </div>
        </nuxt-link>
      </div>
      <div
        v-show="
          activeMenus[level - 1] !== undefined &&
            activeMenus[level - 1] === item.name
        "
        v-if="isParent"
      >
        <WebofficeMenuitem
          v-for="(child, index) in item.children"
          :key="index"
          :item="child"
          :active-item="activeItem"
          :level="level + 1"
          :active-menus="activeMenus"
          @changeActiveMenu="$emit('changeActiveMenu', $event)"
        />
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: 'WebofficeMenuitem',
  props: {
    item: {
      type: Object,
      required: true
    },
    activeItem: {
      type: String,
      default: ''
    },
    activeMenus: {
      type: Array,
      required: true
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
    },
    getPaddingLeft() {
      if (this.level === 1) {
        return 'pl-16'
      } else if (this.level === 2) {
        return 'pl-32'
      } else if (this.level === 3) {
        return 'pl-48'
      }
      return ''
    }
  },
  watch: {
    activeMenus: {
      handler(newValue) {
        this.activeMenus = newValue
      }
    }
  },
  methods: {
    toggle(name) {
      if (this.isParent && name !== this.activeItem && name !== '') {
        this.isOpen = !this.isOpen
      } else if (document.body.classList.contains('fixed')) {
        document.body.classList.remove('fixed')
      }
      this.$emit('changeActiveMenu', {
        menu: name,
        level: this.level
      })
    }
  }
}
</script>
