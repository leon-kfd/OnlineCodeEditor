<template>
  <header>
    <div class="logo-wrapper">
      <div class="temp-title">
        🚀 Code Editor
      </div>
    </div>
    <div class="operation-wrapper">
      <button class="btn btn-refresh" @click="handleRefresh" title="Force Refresh">
        <svg viewBox="0 0 1024 1024" width="20" height="20">
          <path d="M1013.274531 617.561191l-157.495039-157.495039c-9.031974-9.031974-24.837927-9.031974-33.869901 0l-157.495039 157.495039c-9.031974 9.031974-7.338479 33.305402 14.112459 33.305402l116.851158 0c-47.982359 109.512679-157.495039 185.719956-283.942668 185.719956-120.802646 0-226.363837-71.126792-277.168688-173.865491L137.173098 662.721058C193.058434 816.264609 338.699008 925.777288 512 925.777288c176.687982 0 326.280044-114.593164 377.649394-274.910695l112.899669 0C1024 650.866593 1022.306505 626.028666 1013.274531 617.561191z" p-id="1151"></path><path d="M512 191.364939c121.367144 0 227.492834 71.126792 278.297685 173.865491l97.093716 0C832.635061 211.122381 685.865491 101.609702 513.693495 101.609702c-176.687982 0-326.280044 114.593164-377.649394 274.910695L21.450937 376.520397c-21.450937 0-19.192944 24.837927-10.725469 33.305402l157.495039 157.495039c9.031974 9.031974 24.837927 9.031974 33.305402 0l157.495039-157.495039c9.031974-9.031974 7.338479-33.305402-14.112459-33.305402L228.057332 376.520397C276.039691 267.572216 384.987872 191.364939 512 191.364939z"></path>
        </svg>
      </button>
      <button class="btn" @click="handleOpenSetting">Setting</button>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  setup (props, { emit }) {
    return {
      handleOpenSetting () {
        emit('open-setting')
      },
      handleRefresh () {
        emit('refresh')
      }
    }
  }
}
</script>

<style scoped lang="scss">
header {
  width: 100%;
  height: 48px;
  background: $dark;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .logo-wrapper {
    width: 100%;
    flex: 1;
    .temp-title {
      padding-left: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #ccc;
    }
  }
  .operation-wrapper {
    display: flex;
    align-items: center;
    padding: 0 20px;
    .btn {
      height: 32px;
      padding: 0 12px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: rgb(82, 85, 84);
      &:hover {
        background: rgba(82, 85, 84, .85);
      }
    }
    .btn-refresh {
      svg path {
        fill: #fff;
      }
      margin-right: 8px;
    }
  }
}
</style>
