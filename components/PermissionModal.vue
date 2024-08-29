<template>
  <InformativeModal
    v-show="show"
    :accept-button="getAcceptButtonText"
    :link-button="$t('general.Cancel')"
    @accept="$emit('accept')"
    @cancel="$emit('cancel')"
  >
    <div slot="body" class="mb-16">
      {{ getDescription }}
    </div>
  </InformativeModal>
</template>

<script>
import InformativeModal from '@/components/modal/InformativeModal'
export default {
  name: 'PermissionModal',
  components: { InformativeModal },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    permissionNeeded: {
      type: [Boolean, String],
      required: true
    }
  },
  computed: {
    getAcceptButtonText() {
      if (this.permissionNeeded === 'package') {
        return this.$t('general.BuyPackage')
      } else if (
        this.permissionNeeded === 'bpo' ||
        this.permissionNeeded === 'voucher' ||
        this.permissionNeeded === 'voucher_premium' ||
        this.permissionNeeded === 'not_free'
      ) {
        return this.$t('general.Buy')
      }
      return ''
    },
    getDescription() {
      if (this.permissionNeeded === 'package') {
        return this.$t('general.PermissionPackageRequired')
      } else if (this.permissionNeeded === 'bpo') {
        return this.$t('general.PermissionBPORequired')
      } else if (this.permissionNeeded === 'voucher') {
        return this.$t('general.PermissionVoucherRequired')
      } else if (this.permissionNeeded === 'voucher_premium') {
        return this.$t('general.PermissionPremiumVoucherRequired')
      } else if (this.permissionNeeded === 'not_free') {
        return this.$t('program.PermissionNotFree')
      }
      return ''
    }
  }
}
</script>

<style scoped></style>
