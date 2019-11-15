<template>
  <span>
    {{ str }}
  </span>
</template>

<script>
export default {
  name: 'EndTime',
  data () {
    return {
      str: '',
      totalTime: 600
    }
  },
  methods: {
    countDown () {
      window.setInterval(() => {

      }, 1000)
    }
  }
}
</script>

<style>

</style>
