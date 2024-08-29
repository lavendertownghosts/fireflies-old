<template>
  <button
    v-if="type === 'primary'"
    class="bg-primary text-white leading-14 px-16 py-13 rounded text-sm font-bold hover:bg-primary-dark active:bg-primary-light active:no-underline focus:outline-none focus:bg-black focus:no-underline disabled:text-grey disabled:bg-grey-light"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>
  <button
    v-else-if="type === 'warning'"
    class="bg-warning text-white leading-14 px-16 py-13 rounded text-sm font-bold hover:bg-warning-dark active:bg-warning-light v active:no-underline focus:outline-none focus:bg-black focus:no-underline disabled:text-grey disabled:bg-grey-light"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>
  <button
    v-else-if="type === 'danger'"
    class="bg-danger text-white leading-14 px-16 py-13 rounded text-sm font-bold hover:bg-danger-dark active:bg-danger-light active:no-underline focus:outline-none focus:bg-black focus:no-underline disabled:text-grey disabled:bg-grey-light"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>
  <button
    v-else-if="type === 'inverted'"
    class="bg-white text-primary border border-primary leading-14 px-15 py-12 rounded text-sm font-bold hover:border-primary-dark hover:text-primary-dark hover:bg-primary-opaque active:bg-white active:text-primary-light active:border-primary-light active:no-underline focus:outline-none focus:bg-white focus:border-black focus:text-black focus:no-underline disabled:text-grey disabled:border-grey disabled:bg-white"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>

  <button
    v-else-if="type === 'inverted-black'"
    class="bg-white text-black border border-black leading-14 px-16 py-13 rounded text-sm font-bold focus:outline-none"
    :disabled="isDisabled"
    :class="inputStyle"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>

  <button
    v-else-if="type === 'inverted-transparent'"
    class="text-primary border border-primary leading-14 px-16 py-13 rounded text-sm font-bold hover:border-primary-dark hover:text-primary-dark hover:bg-primary-opaque active:bg-white active:text-primary-light active:border-primary-light active:no-underline focus:outline-none focus:bg-white focus:border-black focus:text-black focus:no-underline disabled:text-grey disabled:border-grey disabled:bg-white"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>

  <button
    v-else-if="type === 'transparent-noborder'"
    class="text-primary leading-14 px-16 py-13 text-sm font-bold hover:text-primary-dark active:text-primary-light active:no-underline focus:outline-none focus:text-black focus:no-underline disabled:text-grey"
    :disabled="isDisabled"
    :class="getInputClasses()"
    @click="!isLoading ? $emit('click') : ''"
  >
    <div class="relative">
      <div :class="{ 'opacity-0': isLoading }" class="static">
        <slot />
      </div>
      <div
        class="absolute inset-0 opacity-0"
        :class="{ 'opacity-100': isLoading }"
      >
        <i class="fas fa-spinner-third fa-spin"></i>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonSmall',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    getInputClasses() {
      const initClass = !this.isDisabled ? 'hover:underline' : 'cursor-default'

      return [...this.inputStyle, initClass]
    }
  }
}
</script>
