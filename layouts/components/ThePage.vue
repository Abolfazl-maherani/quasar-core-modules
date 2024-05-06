<script setup></script>
<template>
  <QPageContainer>
    <QPage>
      <slot>
        <slot name="before-router-view"></slot>
        <RouterView />
        <slot name="after-router-view"></slot>
      </slot>
    </QPage>
  </QPageContainer>
</template>
