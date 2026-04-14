<script setup lang="ts">
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Minus, Moon, Plus, Settings2, Sun, 
  List, Bookmark, ChevronLeft, ChevronRight, 
  Type, Palette, Maximize2, Minimize2, 
  BookOpen, BookmarkCheck
} from 'lucide-vue-next'
import { getMockData } from '@/lib/mock'
import bookText from '../../mock/book.txt?raw'

const route = useRoute()
const router = useRouter()
const bookId = computed(() => Number(route.params.id))
const currentChapterId = ref(Number(route.params.chapter) || 1)

const loading = ref(false)
const error = ref('')
const content = ref('')
const bookTitle = ref('')
const chapters = ref<any[]>([])
const bookmarks = ref<any[]>([])

const dark = ref(false)
const fontSize = ref(18)
const lineHeight = ref(1.8)
const contentWidth = ref(800)
const fontFamily = ref('sans') // sans, serif, mono
const showSettings = ref(false)
const showCatalog = ref(false)
const isBookmarked = computed(() => 
  bookmarks.value.some(b => b.chapterId === currentChapterId.value)
)

const readerClasses = computed(() => {
  const theme = dark.value ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-zinc-900'
  const font = {
    'sans': 'font-sans',
    'serif': 'font-serif',
    'mono': 'font-mono'
  }[fontFamily.value] || 'font-sans'
  return `${theme} ${font} transition-colors duration-300`
})

const contentStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: String(lineHeight.value),
  maxWidth: `${contentWidth.value}px`,
}))

const loadBookData = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(`/books/${bookId.value}`, 60, true)
    if (res.code === 0 && res.data) {
      const book = res.data as any
      bookTitle.value = book.title
      chapters.value = book.chapters || []
      loadChapter(currentChapterId.value)
    }
  } catch (_e) {
    error.value = '书籍信息加载失败'
  } finally {
    loading.value = false
  }
}

const loadChapter = (id: number) => {
  const chapter = chapters.value.find(c => c.id === id)
  if (chapter) {
    content.value = chapter.content + '\n\n' + bookText // 模拟长内容
    currentChapterId.value = id
    
    // 仅在 URL 不同时才更新路由
    if (Number(route.params.chapter) !== id) {
      router.replace(`/reader/${bookId.value}/${id}`)
    }
    
    // 滚动到顶部
    const mainEl = document.getElementById('reader-content')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const toggleBookmark = () => {
  if (isBookmarked.value) {
    bookmarks.value = bookmarks.value.filter(b => b.chapterId !== currentChapterId.value)
  } else {
    const chapter = chapters.value.find(c => c.id === currentChapterId.value)
    bookmarks.value.push({
      chapterId: currentChapterId.value,
      title: chapter?.title || `第 ${currentChapterId.value} 章`,
      time: new Date().toLocaleString()
    })
  }
  // 模拟持久化
  localStorage.setItem(`bookmarks_${bookId.value}`, JSON.stringify(bookmarks.value))
}

const prevChapter = () => {
  if (currentChapterId.value > 1) {
    loadChapter(currentChapterId.value - 1)
  }
}

const nextChapter = () => {
  if (currentChapterId.value < chapters.value.length) {
    loadChapter(currentChapterId.value + 1)
  }
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

onMounted(() => {
  loadBookData()
  const saved = localStorage.getItem(`bookmarks_${bookId.value}`)
  if (saved) bookmarks.value = JSON.parse(saved)
})

watch(
  () => route.params.chapter,
  (newChapter) => {
    if (newChapter) {
      const id = Number(newChapter)
      if (id !== currentChapterId.value) {
        loadChapter(id)
      }
    }
  }
)

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadBookData()
    }
  }
)
</script>

<template>
  <div class="flex h-screen w-full flex-col overflow-hidden" :class="readerClasses">
    <!-- Desktop Header -->
    <header
      class="flex h-16 shrink-0 items-center justify-between border-b px-6 transition-colors duration-300"
      :class="dark ? 'border-zinc-800 bg-zinc-950/80 backdrop-blur' : 'border-stone-200 bg-stone-50/80 backdrop-blur'"
    >
      <div class="flex items-center gap-6">
        <RouterLink
          :to="`/book/${bookId}`"
          class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>返回书籍详情</span>
        </RouterLink>
        <div class="h-4 w-[1px] bg-border/50"></div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold">{{ bookTitle }}</span>
          <span class="text-[11px] opacity-60">第 {{ currentChapterId }} 章</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showCatalog = !showCatalog"
          class="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-all hover:bg-accent"
          :class="dark ? 'border-zinc-800' : 'border-stone-200'"
          title="目录"
        >
          <List class="h-4 w-4" />
          <span class="hidden sm:inline">目录</span>
        </button>
        
        <button
          @click="toggleBookmark"
          class="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-all hover:bg-accent"
          :class="[
            dark ? 'border-zinc-800' : 'border-stone-200',
            isBookmarked ? 'text-primary' : ''
          ]"
          title="书签"
        >
          <BookmarkCheck v-if="isBookmarked" class="h-4 w-4 fill-current" />
          <Bookmark v-else class="h-4 w-4" />
          <span class="hidden sm:inline">{{ isBookmarked ? '已书签' : '书签' }}</span>
        </button>

        <button
          @click="showSettings = true"
          class="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-all hover:bg-accent"
          :class="dark ? 'border-zinc-800' : 'border-stone-200'"
          title="阅读设置"
        >
          <Settings2 class="h-4 w-4" />
          <span class="hidden sm:inline">设置</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Left Sidebar (Catalog) -->
      <aside
        v-if="showCatalog"
        class="absolute left-0 top-0 z-30 h-full w-72 border-r shadow-xl transition-all duration-300 ease-in-out"
        :class="dark ? 'border-zinc-800 bg-zinc-950' : 'border-stone-200 bg-stone-50'"
      >
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between border-b p-4" :class="dark ? 'border-zinc-800' : 'border-stone-200'">
            <h2 class="text-sm font-bold">目录</h2>
            <button @click="showCatalog = false" class="rounded-md p-1 hover:bg-accent">
              <ChevronLeft class="h-4 w-4" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-2">
            <div
              v-for="item in chapters"
              :key="item.id"
              @click="loadChapter(item.id)"
              class="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors"
              :class="[
                currentChapterId === item.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-accent'
              ]"
            >
              {{ item.title }}
            </div>
          </div>
          <!-- Bookmarks section in catalog -->
          <div v-if="bookmarks.length > 0" class="border-t p-4" :class="dark ? 'border-zinc-800' : 'border-stone-200'">
            <h3 class="mb-2 text-[11px] font-bold uppercase tracking-wider opacity-50">我的书签</h3>
            <div class="space-y-1">
              <div
                v-for="bm in bookmarks"
                :key="bm.chapterId"
                @click="loadChapter(bm.chapterId)"
                class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-accent"
              >
                <Bookmark class="h-3 w-3 shrink-0" />
                <span class="truncate">{{ bm.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Reading Area -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth" id="reader-content">
        <div class="mx-auto px-6 py-12" :style="contentStyle">
          <!-- Loading/Error -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-20 opacity-50">
            <BookOpen class="mb-4 h-12 w-12 animate-pulse" />
            <p>正在载入内容...</p>
          </div>
          <div v-else-if="error" class="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center text-destructive">
            {{ error }}
          </div>
          
          <article v-else class="space-y-8">
            <h1 class="text-3xl font-bold tracking-tight mb-12">
              {{ chapters.find(c => c.id === currentChapterId)?.title }}
            </h1>
            
            <div
              class="whitespace-pre-wrap break-words selection:bg-primary/30"
              :style="{ fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'mono' ? 'monospace' : 'inherit' }"
            >
              {{ content }}
            </div>

            <!-- Chapter Navigation -->
            <div class="mt-20 flex items-center justify-between border-t pt-10" :class="dark ? 'border-zinc-800' : 'border-stone-200'">
              <button
                @click="prevChapter"
                :disabled="currentChapterId <= 1"
                class="inline-flex items-center gap-2 rounded-lg border px-6 py-3 transition-all hover:bg-accent disabled:opacity-30 disabled:pointer-events-none"
                :class="dark ? 'border-zinc-800' : 'border-stone-200'"
              >
                <ChevronLeft class="h-5 w-5" />
                <span>上一章</span>
              </button>
              
              <div class="text-sm opacity-50">
                第 {{ currentChapterId }} / {{ chapters.length }} 章
              </div>

              <button
                @click="nextChapter"
                :disabled="currentChapterId >= chapters.length"
                class="inline-flex items-center gap-2 rounded-lg border px-6 py-3 transition-all hover:bg-accent disabled:opacity-30 disabled:pointer-events-none"
                :class="dark ? 'border-zinc-800' : 'border-stone-200'"
              >
                <span>下一章</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>
          </article>
        </div>
      </main>

      <!-- Right Quick Controls (Desktop Only) -->
      <aside class="hidden xl:flex w-20 shrink-0 flex-col items-center gap-6 border-l py-8" :class="dark ? 'border-zinc-800' : 'border-stone-200'">
        <button
          @click="fontSize = clamp(fontSize + 1, 14, 32)"
          class="flex h-10 w-10 flex-col items-center justify-center rounded-full hover:bg-accent"
          title="增大字号"
        >
          <Plus class="h-5 w-5" />
          <span class="text-[10px]">A+</span>
        </button>
        <button
          @click="fontSize = clamp(fontSize - 1, 14, 32)"
          class="flex h-10 w-10 flex-col items-center justify-center rounded-full hover:bg-accent"
          title="减小字号"
        >
          <Minus class="h-5 w-5" />
          <span class="text-[10px]">A-</span>
        </button>
        <div class="h-[1px] w-8 bg-border"></div>
        <button
          @click="dark = !dark"
          class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
          :title="dark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <Sun v-if="dark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>
        <button
          @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
          class="mt-auto flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent border border-border"
          title="回到顶部"
        >
          <ChevronLeft class="h-5 w-5 rotate-90" />
        </button>
      </aside>
    </div>

    <!-- Settings Drawer -->
    <div
      v-if="showSettings"
      class="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all"
      @click.self="showSettings = false"
    >
      <div
        class="h-full w-80 shadow-2xl transition-transform duration-300"
        :class="dark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between border-b p-6" :class="dark ? 'border-zinc-800' : 'border-stone-100'">
            <h2 class="text-lg font-bold">阅读设置</h2>
            <button @click="showSettings = false" class="rounded-md p-2 hover:bg-accent">
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Font Family -->
            <section class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-medium opacity-70">
                <Type class="h-4 w-4" />
                <span>字体家族</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="f in ['sans', 'serif', 'mono']"
                  :key="f"
                  @click="fontFamily = f"
                  class="rounded-md border py-2 text-xs transition-all"
                  :class="[
                    fontFamily === f 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : (dark ? 'border-zinc-800 hover:bg-zinc-900' : 'border-stone-200 hover:bg-stone-50')
                  ]"
                >
                  {{ f === 'sans' ? '黑体' : f === 'serif' ? '宋体' : '等宽' }}
                </button>
              </div>
            </section>

            <!-- Themes -->
            <section class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-medium opacity-70">
                <Palette class="h-4 w-4" />
                <span>配色方案</span>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="dark = false"
                  class="flex items-center justify-center gap-2 rounded-md border p-3 text-sm transition-all border-stone-200 bg-stone-50 text-stone-900"
                  :class="!dark ? 'ring-2 ring-primary' : ''"
                >
                  <Sun class="h-4 w-4" />
                  <span>浅色模式</span>
                </button>
                <button
                  @click="dark = true"
                  class="flex items-center justify-center gap-2 rounded-md border p-3 text-sm transition-all border-zinc-800 bg-zinc-950 text-zinc-100"
                  :class="dark ? 'ring-2 ring-primary' : ''"
                >
                  <Moon class="h-4 w-4" />
                  <span>深色模式</span>
                </button>
              </div>
            </section>

            <!-- Layout Settings -->
            <section class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="opacity-70">字号</span>
                  <span class="font-mono">{{ fontSize }}px</span>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="fontSize = clamp(fontSize - 1, 14, 32)" class="p-2 rounded-md border hover:bg-accent"><Minus class="h-4 w-4"/></button>
                  <input type="range" v-model.number="fontSize" min="14" max="32" class="flex-1 accent-primary" />
                  <button @click="fontSize = clamp(fontSize + 1, 14, 32)" class="p-2 rounded-md border hover:bg-accent"><Plus class="h-4 w-4"/></button>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="opacity-70">内容宽度</span>
                  <span class="font-mono">{{ contentWidth }}px</span>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="contentWidth = clamp(contentWidth - 50, 400, 1200)" class="p-2 rounded-md border hover:bg-accent"><Minimize2 class="h-4 w-4"/></button>
                  <input type="range" v-model.number="contentWidth" min="400" max="1200" step="50" class="flex-1 accent-primary" />
                  <button @click="contentWidth = clamp(contentWidth + 50, 400, 1200)" class="p-2 rounded-md border hover:bg-accent"><Maximize2 class="h-4 w-4"/></button>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="opacity-70">行高倍数</span>
                  <span class="font-mono">{{ lineHeight.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="lineHeight = Number(clamp(lineHeight - 0.1, 1.2, 2.5).toFixed(1))" class="p-2 rounded-md border hover:bg-accent"><Minus class="h-4 w-4"/></button>
                  <input type="range" v-model.number="lineHeight" min="1.2" max="2.5" step="0.1" class="flex-1 accent-primary" />
                  <button @click="lineHeight = Number(clamp(lineHeight + 0.1, 1.2, 2.5).toFixed(1))" class="p-2 rounded-md border hover:bg-accent"><Plus class="h-4 w-4"/></button>
                </div>
              </div>
            </section>
          </div>

          <div class="p-6 border-t" :class="dark ? 'border-zinc-800' : 'border-stone-100'">
            <button
              @click="showSettings = false"
              class="w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              完成设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
