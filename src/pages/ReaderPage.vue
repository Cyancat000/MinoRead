<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Minus, Moon, Plus, Settings2, Sun } from 'lucide-vue-next'

const route = useRoute()
const bookId = computed(() => String(route.params.id ?? '').trim())
const chapterId = computed(() => String(route.params.chapter ?? '').trim())

const loading = ref(false)
const error = ref('')
const content = ref('')

const dark = ref(false)
const fontSize = ref(17)
const lineHeight = ref(1.9)
const showSettings = ref(false)

const readerClasses = computed(() => {
  if (!dark.value) return 'bg-background text-foreground'
  return 'bg-zinc-950 text-zinc-100'
})

const contentStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: String(lineHeight.value),
}))

const loadText = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('mock/book.txt', { cache: 'no-cache' })
    if (!res.ok) throw new Error('load failed')
    content.value = await res.text()
  } catch (_e) {
    error.value = '内容加载失败'
    content.value = ''
  } finally {
    loading.value = false
  }
}

const clampFontSize = (v: number) => Math.max(14, Math.min(26, v))

const decFont = () => {
  fontSize.value = clampFontSize(fontSize.value - 1)
}

const incFont = () => {
  fontSize.value = clampFontSize(fontSize.value + 1)
}

const toggleDark = () => {
  dark.value = !dark.value
}

const cycleLineHeight = () => {
  const cur = Number(lineHeight.value.toFixed(1))
  if (cur <= 1.7) lineHeight.value = 1.9
  else if (cur <= 1.9) lineHeight.value = 2.1
  else lineHeight.value = 1.7
}

onMounted(loadText)
</script>

<template>
  <div class="flex h-full w-full flex-col" :class="readerClasses">
    <header
      class="sticky top-0 z-10 border-b px-4 py-3 backdrop-blur"
      :class="dark ? 'border-zinc-800 bg-zinc-950/90 supports-[backdrop-filter]:bg-zinc-950/70' : 'border-border bg-background/95 supports-[backdrop-filter]:bg-background/80'"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <RouterLink
            :to="`/book/${bookId}`"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
            aria-label="返回上一级"
            title="返回上一级"
          >
            <ArrowLeft class="h-5 w-5" />
          </RouterLink>
          <div class="grid">
            <h1 class="text-base font-semibold tracking-tight">阅读器</h1>
            <div v-if="chapterId" class="text-[11px] text-muted-foreground">第 {{ chapterId }} 章</div>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-transform active:scale-[0.98]"
          :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
          aria-label="阅读设置"
          title="阅读设置"
          @click="showSettings = true"
        >
          <Settings2 class="h-5 w-5" />
        </button>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-4">
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="mx-auto max-w-2xl">
        <div
          class="whitespace-pre-wrap break-words"
          :class="dark ? 'text-zinc-100' : 'text-foreground'"
          :style="contentStyle"
        >
          {{ content }}
        </div>
      </div>
    </main>

    <div
      v-if="showSettings"
      class="fixed inset-0 z-20 flex items-end"
      @click.self="showSettings = false"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full rounded-t-2xl border border-border bg-background p-4"
        :class="dark ? 'border-zinc-800 bg-zinc-950 text-zinc-100' : ''"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm font-medium">阅读设置</div>
          <button
            type="button"
            class="text-xs text-muted-foreground transition-transform active:scale-[0.98]"
            :class="dark ? 'text-zinc-400' : ''"
            @click="showSettings = false"
          >
            关闭
          </button>
        </div>

        <div class="mt-4 grid gap-3">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm">深色模式</div>
            <button
              type="button"
              class="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-transform active:scale-[0.98]"
              :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
              @click="toggleDark"
            >
              <Moon v-if="dark" class="h-4 w-4" />
              <Sun v-else class="h-4 w-4" />
              <span>{{ dark ? '已开启' : '已关闭' }}</span>
            </button>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div class="text-sm">字号</div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-transform active:scale-[0.98]"
                :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
                aria-label="减小字号"
                title="减小字号"
                @click="decFont"
              >
                <Minus class="h-4 w-4" />
              </button>
              <div class="min-w-12 text-center text-sm tabular-nums">{{ fontSize }}</div>
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-transform active:scale-[0.98]"
                :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
                aria-label="增大字号"
                title="增大字号"
                @click="incFont"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div class="text-sm">行距</div>
            <button
              type="button"
              class="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm transition-transform active:scale-[0.98]"
              :class="dark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900' : 'border-input bg-background active:bg-accent active:text-accent-foreground'"
              @click="cycleLineHeight"
            >
              {{ lineHeight.toFixed(1) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
