<template>
  <button :class="buttonClass" @click="handleClick">{{ buttonText }}</button>
</template>

<script>
export default {
  props: {
    styleType: {
      type: String,
      default: 'btn-style-1'
    },
    buttonText: {
      type: String,
      default: 'Call to Action'
    },
    clickHandler: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    buttonClass() {
      return this.styleType
    }
  },
  methods: {
    handleClick() {
      this.clickHandler()
    }
  }
}
</script>

<style scoped>
button {
  @apply p-10;
  width: 155px;
  border-radius: 4px;
}

.btn-style-1 {
  background-color: theme(colors.landingYellow.default);
}

.btn-style-2 {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #ffffff;
}
</style>
