<template>
  <header>
    <div class="logo-wrapper"></div>
    <div class="operation-wrapper">
      <button class="btn btn-setting" @click="handleOpenSetting">Setting</button>
    </div>
  </header>
</template>

<script>
export default {
  setup (props, { emit }) {
    return {
      handleOpenSetting () {
        emit('open-setting')
      }
    }
  }
}
</script>

<style scoped lang="scss">
header {
  width: 100%;
  height: 48px;
  background: #33353b;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: nowrap;
  .logo-wrapper {
    width: 100%;
    flex: 1;
  }
  .operation-wrapper {
    display: flex;
    align-items: center;
    padding: 0 20px;
    .btn-setting {
      padding: 8px 12px;
      color: #fff;
      background: rgb(82, 85, 84);
      &:hover {
        background: rgba(82, 85, 84, .85);
      }
    }
  }
}
</style>
