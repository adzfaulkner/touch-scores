<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

const hasSlot = (name: string): boolean => {
  return !!slots[name]
}

const emit = defineEmits(['close'])
const props = defineProps({
  id: { type: String, required: true },
  open: { type: Boolean, required: true }
})

const modalClasses = (): string[] => {
  let classes = ['modal', 'fade']

  if (props.open) {
    classes = [...classes, ...['show', 'd-block']]
  }

  return classes
}

const modalDialogClasses = (): string[] => {
  let classes = ['modal-dialog', 'modal-dialog-centered']

  if (hasSlot('header') && hasSlot('footer')) {
    classes = [...classes, ...['modal-dialog-scrollable', 'modal-fullscreen-sm-down']]
  }

  return classes
}

document.addEventListener('click', (event: Event) => {
  const id: string | undefined = (event.target as HTMLInputElement).id

  if (id === props.id) {
    emit('close')
  }
})
</script>

<template>
  <div :id="props.id" :class="modalClasses()">
    <div :class="modalDialogClasses()">
      <div class="modal-content">
        <div v-if="hasSlot('header')" class="modal-header">
          <slot name="header"></slot>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="hasSlot('footer')" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
