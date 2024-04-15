<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-2" v-for="i in 8" :key="i">
      <QSkeleton type="rect" height="20"></QSkeleton>
    </div>
  </div>
</template>
