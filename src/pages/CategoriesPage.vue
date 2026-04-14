<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { 
  Home, 
  Search, 
  Sparkles, 
  FileText, 
  Landmark, 
  Globe, 
  Swords, 
  Coins, 
  Rocket, 
  Leaf, 
  Flame, 
  Book 
} from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
import { getMockData } from '@/lib/mock'

type Category = {
  id: number
  name: string
  books: { id: number; cover: string }[]
  description?: string
  icon?: any
  bookCount: number
}

const loading = ref(false)
const error = ref('')
const categories = ref<Category[]>([])

// 模拟分类描述和图标映射
const categoryMeta: Record<string, { desc: string; icon: any }> = {
  '悬疑推理': { desc: '逻辑与真相的博弈，揭开层层迷雾。', icon: Search },
  '奇幻悬疑': { desc: '超自然力量与未知的交织，探索奇幻之境。', icon: Sparkles },
  '纪实文学': { desc: '真实的力量，记录时代与生命的印记。', icon: FileText },
  '人文历史': { desc: '穿越时空，对话古今，洞察人类文明。', icon: Landmark },
  '社会科学': { desc: '解析社会运行逻辑，理解复杂的世界。', icon: Globe },
  '政治军事': { desc: '权力的游戏与硝烟的记忆。', icon: Swords },
  '投资理财': { desc: '智慧理财，掌控财富，规划未来。', icon: Coins },
  '创业经营': { desc: '商业智慧，实战经验，成就梦想。', icon: Rocket },
  '生活百科': { desc: '发现生活之美，掌握实用技能。', icon: Leaf },
  '励志成长': { desc: '点燃热情，超越自我，追求卓越。', icon: Flame },
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/categories', 80, true)
    const data = Array.isArray(res?.data) ? (res.data as Category[]) : []
    categories.value = data.map(c => ({
      ...c,
      ...categoryMeta[c.name],
      bookCount: c.books?.length || 0,
      // 仅用于预览展示封面
      books: c.books?.slice(0, 3) || []
    }))
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex h-full w-full flex-col bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-foreground">全部分类</h1>
          <div class="h-4 w-px bg-border"></div>
          <p class="text-sm text-muted-foreground">探索不同领域的精彩内容</p>
        </div>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
        >
          <Home class="h-4 w-4" />
          返回首页
        </RouterLink>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <div class="mb-8 flex items-center justify-between gap-6">
          <SearchBar class="w-full max-w-md shadow-sm" />
          <div class="hidden text-sm text-muted-foreground md:block">
            共找到 <span class="font-bold text-foreground">{{ categories.length }}</span> 个分类
          </div>
        </div>

        <div v-if="loading" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            加载中...
          </div>
        </div>
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">
          {{ error }}
        </div>
        
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RouterLink
            v-for="c in categories"
            :key="c.id"
            :to="`/categories/${c.id}`"
            class="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.99]"
          >
            <!-- Category Header -->
            <div class="mb-4 flex items-start justify-between">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <component :is="c.icon || Book" class="h-6 w-6" />
              </div>
              <div class="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {{ c.bookCount }} 本
              </div>
            </div>

            <!-- Category Title & Desc -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {{ c.name }}
              </h3>
              <p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {{ c.desc || '探索更多精彩内容...' }}
              </p>
            </div>

            <!-- Book Preview (Covers) -->
            <div class="mt-auto flex items-center -space-x-3 overflow-hidden">
              <div
                v-for="(book, idx) in c.books"
                :key="idx"
                class="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-md border-2 border-background bg-muted shadow-sm transition-transform group-hover:translate-y-[-4px]"
                :style="{ transitionDelay: idx * 50 + 'ms' }"
              >
                <img :src="book.cover" class="h-full w-full object-cover" />
              </div>
              <div v-if="c.books && c.books.length > 0" class="flex h-14 w-10 items-center justify-center rounded-md border-2 border-background bg-muted/50 text-[10px] font-bold text-muted-foreground shadow-sm">
                +
              </div>
            </div>

            <!-- Hover Effect Background Icon -->
            <div class="pointer-events-none absolute -bottom-4 -right-4 text-primary opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-[0.05]">
              <component :is="c.icon || Book" class="h-24 w-24" />
            </div>
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
