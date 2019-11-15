<template>
  <div class="percent">
    <div class="bg" :style="{ width: this.percent + '%' }"></div>
  </div>
</template>

<script>
export default {
  name: 'Percent',
  data () {
    return {
    }
  },
  props: {
    percent: { type: Number, default: 50 }
  }
}
</script>

<style>

</style>
