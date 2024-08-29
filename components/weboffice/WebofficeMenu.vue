<template>
  <div class="mb-56 pb-56 flex-shrink-0">
    <ul class="border-r border-l border-b border-grey-light rounded">
      <div v-for="(item, index) in menuItems" :key="index">
        <WebofficeMenuItem
          :key="index"
          :item="item"
          :active-menus="activeMenus"
          @changeActiveMenu="changeActiveMenu"
        />
      </div>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLanguageName } from '@/includes/utils'
import WebofficeMenuItem from '@/components/weboffice/WebofficeMenuItem'
export default {
  name: 'WebofficeMenu',
  components: { WebofficeMenuItem },
  async fetch() {
    let res = []
    res = await this.$store.dispatch('user/getWebOfficeMenu')

    this.powerlineEnabled = false
    if (this.getPowerline.error === undefined) {
      if (this.getPowerline.userHasDemoForceLine === false) {
        if (this.getPowerline.forceLineEndDate !== undefined) {
          if (this.getPowerline.forceLineEndDate !== 'n.a.') {
            this.powerlineEnabled = true
          }
        }
      } else {
        this.powerlineEnabled = true
      }
    }

    res.forEach((item) => {
      if (item.name === 'ExclusiveOffers' && !this.isExclusiveEnabled) {
        // console.log('Exclusive offers disabled')
      } else if (item.name === 'Powerline' && !this.powerlineEnabled) {
        // console.log('Powerline disabled')
      } else if (item.name === 'LoyaltyCycleBonus' && !this.isLoyaltyAllowed) {
        // console.log('GEO loyalty block')
      } else {
        if (item.children !== undefined) {
          const children = []
          item.children.forEach((child) => {
            if (
              (child.name === 'VipLeaderBonusMedium' ||
                child.name === 'VIPPurchaseMedium') &&
              !this.getAllowedGeo
            ) {
              // console.log('GEO block ' + child.name)
            } else if (
              child.name === 'LoyaltyPhasicPurchase' &&
              !this.isLoyaltyAllowed
            ) {
              // console.log('GEO loyalty block')
            } else {
              children.push(child)
            }
          })
          item.children = children
        }
        this.menuItems.push(item)
      }
    })

    const activeMenuTMP = this.findMenuParents(
      this.menuItems,
      this.$route.path.replace(this.$i18n.locale + '/', '')
    )
    if (activeMenuTMP === undefined) {
      this.activeMenus = []
    } else {
      this.activeMenus = activeMenuTMP
    }
  },
  data() {
    return {
      activeMenus: [],
      menuItems: [],
      powerlineEnabled: false,
      onLoad: false
    }
  },
  computed: {
    ...mapGetters('user', [
      'getWebOfficeMenu',
      'isExclusiveEnabled',
      'getAllowedGeo',
      'getPowerline',
      'isLoyaltyAllowed'
    ])
  },
  watch: {
    $route() {
      this.reloadMenu()
    }
  },
  methods: {
    getLanguageName,
    /* A fenti fetch másolata, mert innen nem tudom hívni ugyan azt a függvényt */
    async reloadMenu() {
      if (!this.onLoad) {
        this.onLoad = true
        let res = []
        res = await this.$store.dispatch('user/getWebOfficeMenu')
        const buffer = [] // Ne tűnjön el a menü ameddig feldolgozza

        this.powerlineEnabled = false
        if (this.getPowerline.error === undefined) {
          if (this.getPowerline.userHasDemoForceLine === false) {
            if (this.getPowerline.forceLineEndDate !== undefined) {
              if (this.getPowerline.forceLineEndDate !== 'n.a.') {
                this.powerlineEnabled = true
              }
            }
          } else {
            this.powerlineEnabled = true
          }
        }

        res.forEach((item) => {
          if (item.name === 'ExclusiveOffers' && !this.isExclusiveEnabled) {
            // console.log('Exclusive offers disabled')
          } else if (item.name === 'Powerline' && !this.powerlineEnabled) {
            // console.log('Powerline disabled')
          } else if (
            item.name === 'LoyaltyCycleBonus' &&
            !this.isLoyaltyAllowed
          ) {
            // console.log('GEO loyalty block')
          } else {
            if (item.children !== undefined) {
              const children = []
              item.children.forEach((child) => {
                if (
                  (child.name === 'VipLeaderBonusMedium' ||
                    child.name === 'VIPPurchaseMedium') &&
                  !this.getAllowedGeo
                ) {
                  // console.log('GEO block ' + child.name)
                } else if (
                  child.name === 'LoyaltyPhasicPurchase' &&
                  !this.isLoyaltyAllowed
                ) {
                  // console.log('GEO loyalty block')
                } else {
                  children.push(child)
                }
              })
              item.children = children
            }
            buffer.push(item)
          }
        })

        this.menuItems = buffer
        this.onLoad = false
      }
    },
    changeActiveMenu(prop) {
      let tmp = JSON.parse(JSON.stringify(this.activeMenus))
      if (tmp[prop.level - 1] !== undefined) {
        if (tmp[prop.level - 1] !== prop.menu) {
          tmp = tmp.slice(0, prop.level - 1)
          tmp[prop.level - 1] = prop.menu
        } else {
          tmp = tmp.slice(0, prop.level - 1)
        }
      } else {
        tmp[prop.level - 1] = prop.menu
      }
      this.activeMenus = tmp
    },
    findMenuParents(menu, link) {
      if (menu.link !== undefined && menu.link === link) {
        return [menu.name]
      }
      if (Array.isArray(menu)) {
        for (const menuItem of menu) {
          if (menuItem.link !== undefined && menuItem.link === link) {
            return [menuItem.name]
          }
          if (menuItem.children !== undefined) {
            const childResult = this.findMenuParents(menuItem.children, link)
            if (Array.isArray(childResult)) {
              return [menuItem.name].concat(childResult)
            }
          }
        }
      }
    }
  }
}
</script>
