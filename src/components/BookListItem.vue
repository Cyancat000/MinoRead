<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  seriesName?: string
  dbRating?: number
  length?: number
}

const props = defineProps<{
  book: Book
  rank?: number
}>()

const router = useRouter()

const subline = computed(() => {
  const parts: string[] = []
  if (props.book.authorName) parts.push(props.book.authorName)
  if (props.book.seriesName) parts.push(props.book.seriesName)
  return parts.join(' · ')
})

const metaLine = computed(() => {
  const parts: string[] = []
  if (typeof props.book.dbRating === 'number') parts.push(`豆瓣 ${props.book.dbRating.toFixed(1)}`)
  if (typeof props.book.length === 'number' && Number.isFinite(props.book.length)) parts.push(`${props.book.length} 字`)
  return parts.join(' · ')
})

const open = () => {
  router.push(`/book/${props.book.id}`)
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-stretch gap-3 rounded-lg border border-border bg-background p-3 text-left transition-transform active:scale-[0.98]"
    @click="open"
  >
    <div v-if="typeof rank === 'number'" class="flex w-8 flex-none items-center justify-center">
      <div class="text-2xl font-semibold tabular-nums text-foreground">{{ rank }}</div>
    </div>

    <div class="relative h-20 w-14 flex-none overflow-hidden rounded-md border border-border bg-muted">
      <img :src="book.cover" :alt="book.title" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    </div>

    <div class="min-w-0 flex-1">
      <div class="truncate text-sm font-medium text-foreground">{{ book.title }}</div>
      <div v-if="subline" class="mt-0.5 truncate text-xs text-muted-foreground">{{ subline }}</div>
      <div v-if="metaLine" class="mt-1 truncate text-xs text-muted-foreground">{{ metaLine }}</div>
    </div>
  </button>
</template>
