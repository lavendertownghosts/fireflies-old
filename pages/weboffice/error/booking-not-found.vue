<template>
  <main>
    {{ 'Foglalás nem található' }}
  </main>
</template>
<script>
export default {
  name: 'BookingNotFound',
  middleware: 'auth_needed'
}
</script>
