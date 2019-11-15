<template>
  <div id="app" class="resizable">
    <div class="head">
      <div>
        <span>宝の灵砂时钟</span>
        <span class="time">ET {{ rtEpoch.hour }}:{{ rtEpoch.min }}:{{ rtEpoch.sec }}</span>
        <span class="time">LT {{ rtEpoch.Rhour }}:{{ rtEpoch.Rmin }}:{{ rtEpoch.Rsec }}</span>
      </div>
    </div>
    <div class="content">
      <div class="items">
        <div class="item" :class="it.cur ? 'active' : 'next'" v-for="(it, key) in works" :key="key">
          <item :item="it" :hour="rtEpoch.hour" :sec="rtEpoch.Rsec" :aethersand="aethersands[it.aethersand]" />
          <percent :percent="it.percent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 12am--4am  暴风岩    闪光  水
// 4am---8am    甜墨角兰 黑暗 风
// 8am---12pm  光耀石 黑暗 雷
// 12pm---4pm  沼泽鼠尾草 古树 冰
// 4pm---8pm    暗影石英 险山 火
// 8pm---12am   白玉土 闪光 土
//
import { calcTime, getNextTime, outTime } from './lib/dtEorzea'
import item from './components/item.vue'
import percent from './components/percent.vue'

export default {
  name: 'App',
  components: { item, percent },
  data () {
    return {
      rtEpoch: { hour: 0, min: 0, sec: 0, Rhour: 0, Rmin: 0, Rsec: 0, time: 0 },
      aethersands: {
        27811: { icon: 21235, ilv: 409, lang: ['閃光の霊砂', 'Chiaroglow Aethersand', '闪光灵砂'] },
        27812: { icon: 21233, ilv: 409, lang: ['暗闇の霊砂', 'Scuroglow Aethersand', '黑暗灵砂'] },
        27813: { icon: 21234, ilv: 420, lang: ['険山の霊砂', 'Agedeep Aethersand', '险山灵砂'] },
        27814: { icon: 21236, ilv: 420, lang: ['古樹の霊砂', 'Agewood Aethersand', '古树灵砂'] }
      },
      items: {
        27805: { icon: 21473, ilv: 409, lang: ['嵐性岩', 'Gale Rock', '暴风岩'], ls: '大森林(26, 29)', aethersand: 27811, start: '00:00', end: '04:00' },
        27809: { icon: 25015, ilv: 409, lang: ['スイートマジョラム', 'Sweet Marjoram', '甜墨角兰'], ls: '大森林(27, 24)', aethersand: 27812, start: '04:00', end: '08:00' },
        27806: { icon: 21467, ilv: 409, lang: ['光曜石', 'Solarite', '光耀石'], ls: '雷克兰德(37, 15)', aethersand: 27812, start: '08:00', end: '12:00' },
        27810: { icon: 25009, ilv: 420, lang: ['ボッグセージ', 'Bog Sage', '沼泽鼠尾草'], ls: '雷克兰德(25, 30)', aethersand: 27814, start: '12:00', end: '16:00' },
        27807: { icon: 21462, ilv: 420, lang: ['シャドウクォーツ', 'Shade Quartz', '暗影石英'], ls: '柯露西亚岛(22, 19)', aethersand: 27813, start: '16:00', end: '20:00' },
        27808: { icon: 22610, ilv: 420, lang: ['白玉土', 'White Clay', '白玉土'], ls: '柯露西亚岛(14, 14)', aethersand: 27811, start: '20:00', end: '00:00' }
      },
      works: []
    }
  },
  watch: {
    'rtEpoch.sec' () {
      const curTime = this.rtEpoch.time / 1000
      // console.log('rtEpoch.min', this.rtEpoch.hour, this.rtEpoch.min)
      const items = Object.assign({}, this.items)
      const out = []
      for (var id in items) {
        const item = items[id]
        const startTime = getNextTime(item.start, this.rtEpoch)
        const endTime = getNextTime(item.end, this.rtEpoch)
        // console.log('item', item.lang[2], startTime, endTime)
        item.endTimeStr = outTime(endTime)
        item.startTimeStr = outTime(startTime)
        item.st = startTime.getTime() / 1000
        item.et = endTime.getTime() / 1000
        item.endTimeLimit = item.et - curTime //  LimitTime(endTime, this.rtEpoch)
        item.startTimeLimit = item.st - curTime // LimitTime(startTime, this.rtEpoch)
        item.percent = 0
        // console.log('curTime', curTime, item.et, curTime < item.et, item.et - curTime)

        const ft = 12 * 60
        if (item.et - curTime <= ft && item.et - curTime > 12) {
          item.cur = true
          out.push(item)
          const p = ((ft - item.endTimeLimit) / ft) * 100
          item.percent = Math.abs(p) > 100 ? 100 : Math.abs(p)
        } else if (item.startTimeLimit <= 24 * 60) {
          out.push(item)
        }
      }
      // console.log('out', out)
      out.sort((it1, it2) => {
        return it1.et > it2.et
      })
      this.works = out
    },
    deep: true
  },
  methods: {
    getTime () {
      const time = calcTime()
      this.$set(this.rtEpoch, 'hour', time.hour)
      this.$set(this.rtEpoch, 'min', time.min)
      this.$set(this.rtEpoch, 'sec', time.sec)
      this.$set(this.rtEpoch, 'Rhour', time.Rhour)
      this.$set(this.rtEpoch, 'Rmin', time.Rmin)
      this.$set(this.rtEpoch, 'Rsec', time.Rsec)
      this.$set(this.rtEpoch, 'time', time.time)
    }
  },
  created () {
    this.getTime()
    setInterval(() => { this.getTime() }, 1000)
  }
}
</script>

<style lang="less">
html,
body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  background-color: transparent;
  background-image: url(./assets/handle.png);
  background-position: bottom right;
  background-repeat: no-repeat;
  overflow: hidden;
}
#app {
  font-family: "方正准圆", "微软雅黑", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .head {
    display: block;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: white;
    text-align: left;
    padding: 0 28px;
    div {
      background-color: rgba(244, 67, 54, 0.5);
      padding-left: 16px;
      width: 100%;
      transform: skewX(-30deg);
      span {
        display: inline-block;
        margin-right: 8px;
        transform: skewX(30deg);
      }
      .time {
        width: 90px;
      }
    }
  }
  .content {
    display: block;
    font-size: 14px;
    min-height: 100px;
    color: white;
    text-align: left;
    padding: 12px 22px 0 38px;
    .items {
      width: 100%;
      height: 100%;
    }
    .item {
      margin-bottom: 8px;
      .item-list {
        padding: 2px 4px;
        display: flex;
        img {
          height: 24px;
          width: 24px;
        }
        span {
          display: block;
          height: 24px;
          line-height: 24px;
          margin: 0 4px;
          font-size: 12px;
        }
        .name {
          width: 70px;
          font-size: 14px;
        }
        .ls {
          width: 130px;
        }
      }
    }
    .percent {
      height: 2px;
      width: 100%;
      margin-top: 1px;
      background-color: rgba(139, 195, 74, 0.3);
      .bg {
        height: 2px;
      }
    }
    .active {
      .item-list {
        background-color: rgba(139, 195, 74, 0.8);
      }
      .percent .bg {
        background-color: rgba(139, 195, 74, 0.8);
      }
    }
    .next {
      .item-list {
        background-color: rgba(32, 149, 243, 0.6);
      }
      .percent {
        height: 0;
        // background-color: rgba(32, 149, 243, 0.6);
      }
    }
  }
}
</style>
