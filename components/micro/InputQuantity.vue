<template>
  <div class="flex flex-row items-center">
    <ButtonSmall
      type="inverted"
      :is-disabled="isDisabled || number - 1 <= min"
      @click="
        number--
        emit()
      "
    >
      <i class="fal fa-minus"></i>
    </ButtonSmall>
    <div class="font-bold px-16 w-42 text-center">
      {{ number }}
    </div>
    <ButtonSmall
      type="inverted"
      :is-disabled="isDisabled || number + 1 >= max"
      @click="
        number++
        emit()
      "
    >
      <i class="fal fa-plus"></i>
    </ButtonSmall>
  </div>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'
export default {
  name: 'InputQuantity',
  components: {
    ButtonSmall
  },
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    error: {
      type: [String, Boolean],
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 9999
    }
  },
  data() {
    return {
      number: 0
    }
  },
  watch: {
    value(newVal) {
      this.number = newVal
    }
  },
  mounted() {
    this.number = this.value
  },
  methods: {
    emit() {
      this.$emit('input', this.number)
    }
  }
}
</script>

<style scoped>
.bg-white::placeholder {
  color: #cbcbcb;
}

.disabled\:text-black-opaque:disabled::placeholder {
  color: rgba(57, 62, 70, 0.5);
}

.disabled\:text-white-opaque:disabled::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.border-danger::placeholder {
  color: #fc3c3c;
}

.border-danger {
  color: #fc3c3c;
}
</style>
