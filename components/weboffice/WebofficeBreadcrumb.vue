<template>
  <div class="flex flex-wrap text-sm leading-14">
    <div v-for="(link, key) in links" :key="key">
      <div v-if="link.link !== undefined" class="mr-4">
        <nuxt-link :to="localePath(link.link)" class="link">{{
          link.name
        }}</nuxt-link>
        <span class="text-primary">/</span>
      </div>
      <div v-else>{{ link.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebofficeBreadcrumb',
  props: {
    links: {
      type: Array,
      required: true
    }
  }
}
</script>
