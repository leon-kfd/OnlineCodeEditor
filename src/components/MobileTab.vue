<template>
  <div class="mobile-tab">
    <div class="mobile-tab-item" :class="{active: index === active}" v-for="(text,index) in tabList" :key="text" @click="handleClick(index)">{{text}}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'MobileTab',
  props: {
    codeList: {
      type: Array,
      default: () => [],
      required: true
    },
    active: {
      type: Number,
      default: 0,
      required: true
    }
  },
  setup(props, { emit }) {
    const tabList = computed(() => {
      const codeTextList = props.codeList.map((item: any) => item.title)
      return [...codeTextList, 'Result']
    })
    const handleClick = (index: number) => {
      emit('update:active', index)
    }
    return {
      tabList,
      handleClick
    }
  }
})
</script>
<style lang="scss" scoped>
.mobile-tab {
  display: flex;
  align-items: center;
  background: $dark;
  position:relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom: 2px solid #f4aa66;
  }
  .mobile-tab-item {
    line-height: 30px;
    font-size: 14px;
    color: #c8c8ce;
    padding: 0 12px;
    z-index: 999;
    cursor: pointer;
    &.active {
      background: $deepDark;
      border: 2px solid #f4aa66;
      border-bottom: 2px solid $deepDark;
      color: #fff;
    }
  }
}
</style>
