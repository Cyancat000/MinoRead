<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const kw = ref('')

const onSubmit = () => {
  const q = kw.value.trim()
  if (!q) return
  router.push({ path: '/search', query: { q, from: route.fullPath } })
}
</script>

<template>
  <div class="flex items-center gap-2">
    <input
      v-model="kw"
      class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      placeholder="输入书名 / 作者 / 关键词"
      @keyup.enter="onSubmit"
    />
    <button
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
      @click="onSubmit"
      aria-label="搜索"
      title="搜索"
    >
      <Search class="h-4 w-4" />
    </button>
  </div>
</template>
