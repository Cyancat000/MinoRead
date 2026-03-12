<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
}

const router = useRouter()
const loading = ref(false)
const error = ref('')
const books = ref<Book[]>([])

const size = ref<'small' | 'medium' | 'large'>('medium')
const cols = computed(() => (size.value === 'small' ? 4 : size.value === 'large' ? 2 : 3))
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
  columnGap: '12px',
  rowGap: '12px',
}))

const coverRatio = 1.4

const startRead = (book: Book) => {
  router.push(`/reader/${book.id}/1`)
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getMockData('/bookshelf', 80, true)
    books.value = Array.isArray(res?.data) ? (res.data as Book[]) : []
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">书架</h1>
        <div class="flex items-center gap-2">
          <label class="text-sm text-muted-foreground">封面大小</label>
          <select
            v-model="size"
            class="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-4">
      <div v-if="loading" class="text-sm text-muted-foreground">加载中…</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>

      <div v-else class="px-0.5" :style="gridStyle">
        <button
          v-for="b in books"
          :key="b.id"
          type="button"
          class="flex flex-col items-center text-left transition-transform active:scale-[0.98]"
          @click="startRead(b)"
        >
          <div class="relative w-full overflow-hidden rounded-md border border-border bg-muted">
            <div
              class="w-full"
              :style="{ paddingTop: (coverRatio * 100) + '%' }"
            ></div>
            <img
              :src="b.cover"
              :alt="b.title"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="mt-2 w-full px-0.5">
            <div class="title-2line text-center text-[12px] leading-snug text-foreground/90">
              {{ b.title }}
            </div>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.title-2line {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
