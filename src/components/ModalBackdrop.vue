<script setup lang="ts">
const props = defineProps({
  open: { type: Boolean, required: true }
})

const classes = (): string[] => {
  let classes: string[] = ['modal-backdrop', 'fade']

  if (props.open) {
    classes = [...classes, ...['show', 'd-block']]
  }

  return classes
}
</script>

<template>
  <div v-if="open" :class="classes()"></div>
</template>

<style></style>
