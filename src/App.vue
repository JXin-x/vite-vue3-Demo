<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()
</script>

<template>
  <h1>App2</h1>
  <router-view />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
