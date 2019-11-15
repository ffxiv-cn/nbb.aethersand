<template>
  <div class="item-list" >
    <img :src="itimg" :alt="italt" />
    <span class="name">{{ item.lang[2] }}</span>
    <img :src="asimg" :alt="asalt" />
    <span class="name">{{ aethersand.lang[2] }}</span>
    <span class="ls">{{ item.ls }}</span>
    <span>
      ET.{{ item.start }}
      ET.{{ item.end }}
    </span>
    <span v-if="cur">
      余{{ str }}
    </span>
    <span v-else>
      ( {{ item.startTimeStr }} )
    </span>
    <span>
    </span>
  </div>
</template>

<script>

export const cdn = 'http://cal.ffxiv.xin/'
export const langHsh = { 'en-US': 1, 'ja-JP': 0, 'zh-CN': 2 }
export const getImg = function (_iconID, isHq) {
  const hq = isHq ? 'hq/' : ''
  let iconID = _iconID + ''
  if (iconID.length === 5) iconID = '0' + iconID
  if (iconID.length === 4) iconID = '00' + iconID
  if (iconID.length === 3) iconID = '000' + iconID
  if (iconID.length === 2) iconID = '0000' + iconID
  if (iconID.length === 1) iconID = '00000' + iconID
  return `${cdn}${iconID.substring(0, 3)}000/${hq}${iconID}.png`
}

export default {
  name: 'Item',
  props: {
    item: { type: Object, default: () => { } },
    hour: { type: Number, default: 0 },
    sec: { type: Number, default: 0 },
    aethersand: { type: Object, default: () => { } }
  },
  data () {
    return {
      cur: false,
      itimg: '',
      italt: '',
      asimg: '',
      asalt: '',
      time: 0,
      str: ''
    }
  },
  watch: {
    sec (val) {
      this.ready()
    }
  },
  mounted () {
    this.ready()
  },
  methods: {
    ready () {
      this.itimg = getImg(this.item.icon)
      this.asimg = getImg(this.aethersand.icon, true)
      this.asalt = this.item.lang.join('/n')
      this.asalt = this.aethersand.lang.join('/n')
      this.cur = this.item.cur
      if (this.cur) {
        const t = this.item.endTimeLimit
        this.str = t <= 59 ? Math.floor(t) + '秒' : Math.floor(t / 60) + '分' + Math.floor(t % 60) + '秒'
      } else {
        // const t2 = this.item.startTimeLimit
        // this.str = t2 <= 59 ? Math.floor(t2) + '秒' : Math.floor(t2 / 60) + '分' + Math.floor(t2 % 60) + '秒'
      }
    }
  }
}
</script>

<style>
</style>
