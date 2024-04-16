<script setup></script>
<template>
  <QPageContainer>
    <div>
      <slot>
        <slot name="before-router-view"></slot>
        <RouterView />
        <slot name="after-router-view"></slot>
      </slot>
    </div>
  </QPageContainer>
</template>
