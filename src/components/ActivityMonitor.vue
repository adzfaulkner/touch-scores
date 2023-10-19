<script setup lang="ts">
const props = defineProps({
  open: { type: Boolean, required: true }
})

const classes = (): string[] => {
  let classes: string[] = ['modal']

  if (props.open) {
    classes = [...classes, ...['show', 'd-block']]
  } else {
    classes = [...classes, ...['hide']]
  }

  return classes
}
</script>

<template>
  <div :class="classes()">
    <div class="position-absolute top-50 start-50 translate-middle">
      <div class="bg-white rounded p-3">
        <div class="spinner-border" style="width: 100px; height: 100px" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
