<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  LayoutGrid, 
  List, 
  RefreshCw, 
  BookOpen, 
  Clock, 
  Bell, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-vue-next'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  progress?: number
  hasUpdate?: boolean
  lastUpdateChapter?: string
  lastUpdateTime?: string
}

const router = useRouter()
const loading = ref(false)
const error = ref('')
const bookshelf = ref<Book[]>([])
const searchQuery = ref('')
const currentFilter = ref('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: '正在读', value: 'reading' },
  { label: '有更新', value: 'updating' },
  { label: '已读完', value: 'finished' },
]

const filteredBooks = computed(() => {
  let list = bookshelf.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.authorName?.toLowerCase().includes(q))
  }
  
  if (currentFilter.value === 'reading') {
    list = list.filter(b => (b.progress ?? 0) > 0 && (b.progress ?? 0) < 100)
  } else if (currentFilter.value === 'updating') {
    list = list.filter(b => b.hasUpdate)
  } else if (currentFilter.value === 'finished') {
    list = list.filter(b => b.progress === 100)
  }
  
  return list
})

const viewMode = ref<'grid' | 'list'>('grid')

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const startRead = (bookId: number) => {
  router.push(`/reader/${bookId}/1`)
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/bookshelf', 80, true)
    bookshelf.value = Array.isArray(res?.data) ? (res.data as Book[]) : []
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex h-full w-full flex-col bg-muted/30">
    <!-- Header -->
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-foreground">我的书架</h1>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-1 text-sm text-muted-foreground">
            共 <span class="font-bold text-foreground">{{ bookshelf.length }}</span> 本书
          </div>
        </div>

        <!-- Search & Actions -->
        <div class="flex flex-1 items-center justify-end gap-4">
          <div class="relative max-w-sm flex-1">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索书架内的书籍..."
              class="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm transition-colors focus:border-primary focus:outline-none"
            />
          </div>
          
          <div class="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <button
              class="rounded-md p-1.5 transition-colors"
              :class="viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
              @click="viewMode = 'grid'"
            >
              <LayoutGrid class="h-4 w-4" />
            </button>
            <button
              class="rounded-md p-1.5 transition-colors"
              :class="viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
              @click="viewMode = 'list'"
            >
              <List class="h-4 w-4" />
            </button>
          </div>

          <button
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent active:scale-[0.98]"
            @click="load"
          >
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            刷新
          </button>
        </div>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <!-- Filter Tabs -->
        <div class="mb-8 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              v-for="f in filters"
              :key="f.value"
              class="rounded-full px-5 py-2 text-sm font-medium transition-all"
              :class="[
                currentFilter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
              ]"
              @click="currentFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Loading / Error States -->
        <div v-if="loading && bookshelf.length === 0" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            正在同步书架...
          </div>
        </div>
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">{{ error }}</div>
        <div v-else-if="filteredBooks.length === 0" class="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <BookOpen class="h-12 w-12 opacity-20" />
          <p>暂无匹配书籍</p>
        </div>

        <!-- Books Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <div
            v-for="b in filteredBooks"
            :key="b.id"
            class="group flex flex-col overflow-hidden transition-all"
          >
            <!-- Cover with Badge -->
            <div class="relative aspect-[3/4.2] cursor-pointer overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-all group-hover:shadow-md" @click="startRead(b.id)">
              <img
                :src="b.cover"
                :alt="b.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              <!-- Update Badge -->
              <div v-if="b.hasUpdate" class="absolute left-0 top-0 flex items-center gap-1 rounded-br-xl bg-primary px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                <Bell class="h-2.5 w-2.5 animate-bounce" />
                有更新
              </div>

              <!-- Progress Bar Overlay -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div class="h-full bg-primary transition-all duration-500" :style="{ width: (b.progress ?? 0) + '%' }"></div>
              </div>

              <!-- Hover Actions -->
              <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button class="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-xl transition-transform active:scale-95">
                  立即阅读
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="mt-3 flex flex-1 flex-col">
              <div class="mb-1">
                <h3 class="line-clamp-1 cursor-pointer text-sm font-bold text-foreground transition-colors hover:text-primary" @click="startRead(b.id)">
                  {{ b.title }}
                </h3>
              </div>
              <div class="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span class="truncate">{{ b.authorName }}</span>
                <span v-if="b.progress" class="font-medium text-primary">{{ b.progress }}%</span>
              </div>
              
              <!-- Update Text -->
              <div v-if="b.hasUpdate" class="mt-auto space-y-1">
                <div class="flex items-center gap-1.5 rounded-lg bg-primary/5 p-1.5 text-primary">
                  <RefreshCw class="h-3 w-3" />
                  <span class="line-clamp-1 text-[10px] font-medium">{{ b.lastUpdateChapter }}</span>
                </div>
                <div class="text-[9px] text-muted-foreground pl-1">
                  更新于 {{ b.lastUpdateTime }}
                </div>
              </div>
              <div v-else class="mt-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock class="h-3 w-3" />
                <span>读到第 {{ randInt(1, 10) }} 章</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Books List View -->
        <div v-else class="space-y-4">
          <div
            v-for="b in filteredBooks"
            :key="b.id"
            class="group flex items-center gap-6 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div class="h-24 w-18 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border shadow-sm" @click="startRead(b.id)">
              <img :src="b.cover" :alt="b.title" class="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            
            <div class="flex flex-1 flex-col min-w-0">
              <div class="mb-1 flex items-center justify-between">
                <h3 class="cursor-pointer text-lg font-bold text-foreground hover:text-primary transition-colors" @click="startRead(b.id)">
                  {{ b.title }}
                </h3>
                <div class="flex items-center gap-3">
                  <div v-if="b.hasUpdate" class="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <Bell class="h-3 w-3" />
                    更新
                  </div>
                  <button class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <MoreHorizontal class="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div class="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{{ b.authorName }}</span>
                <span class="h-1 w-1 rounded-full bg-border"></span>
                <span v-if="b.progress" class="text-primary font-medium">已读 {{ b.progress }}%</span>
                <span v-if="b.hasUpdate" class="text-primary font-medium">最新：{{ b.lastUpdateChapter }}</span>
              </div>

              <div class="mt-auto flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock class="h-3.5 w-3.5" />
                  <span>上次阅读：{{ b.lastUpdateTime }}</span>
                </div>
                <button
                  class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                  @click="startRead(b.id)"
                >
                  继续阅读
                  <ChevronRight class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 针对列表视图的封面比例 */
.w-18 {
  width: 4.5rem;
}
</style>
