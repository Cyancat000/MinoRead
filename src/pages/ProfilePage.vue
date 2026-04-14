<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Home } from 'lucide-vue-next'
import { Bell, BookOpen, Download, Heart, Settings, Shield, UserRound } from 'lucide-vue-next'
import { getMockData } from '@/lib/mock'

type User = {
  id: number
  name: string
  avatar: string
  level: number
  bio?: string
  joinedDate?: string
  membership?: string
  stats?: {
    yesterdayMinutes?: number
    totalMinutes?: number
    streakDays?: number
    bookshelfCount?: number
    historyCount?: number
    favoriteCount?: number
  }
}

const loading = ref(false)
const error = ref('')
const user = ref<User | null>(null)

// 最近阅读数据
const recentBooks = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // 并行获取用户信息和最近阅读
    const [userRes, recentRes] = await Promise.all([
      getMockData('/user', 80, true),
      getMockData('/user/recent', 120, true),
    ])

    user.value = (userRes?.data as User) ?? null
    recentBooks.value = (recentRes?.data as any[]) ?? []
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-full w-full bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-foreground">个人中心</h1>
          <div class="h-4 w-px bg-border"></div>
          <p class="text-sm text-muted-foreground">管理您的阅读生活</p>
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

    <main class="mx-auto max-w-[1200px] px-6 py-8">
      <div v-if="loading" class="flex h-64 items-center justify-center text-sm text-muted-foreground">
        <div class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          加载中...
        </div>
      </div>
      <div v-else-if="error" class="flex h-64 items-center justify-center text-sm text-destructive">{{ error }}</div>
      <div v-else class="flex flex-col gap-8 md:flex-row">
        <!-- Sidebar -->
        <aside class="w-full space-y-6 md:w-[320px]">
          <!-- Profile Card -->
          <div class="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div class="h-24 bg-gradient-to-br from-primary/20 to-primary/5"></div>
            <div class="px-6 pb-6">
              <div class="relative -mt-12 mb-4">
                <div class="h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md">
                  <img
                    :src="user?.avatar"
                    :alt="user?.name ?? 'avatar'"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="absolute -bottom-1 -right-1 flex h-8 items-center rounded-full border border-border bg-background px-3 text-xs font-bold text-primary shadow-sm">
                  Lv.{{ user?.level ?? 0 }}
                </div>
              </div>
              
              <div class="space-y-1">
                <h2 class="text-2xl font-bold text-foreground">{{ user?.name ?? '游客' }}</h2>
                <p v-if="user?.bio" class="text-sm text-muted-foreground">{{ user.bio }}</p>
              </div>

              <div class="mt-6 space-y-3 pt-6 border-t border-border">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">会员状态</span>
                  <span class="font-medium text-primary">{{ user?.membership }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">加入时间</span>
                  <span class="font-medium">{{ user?.joinedDate }}</span>
                </div>
              </div>

              <button class="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                编辑个人资料
              </button>
            </div>
          </div>

          <!-- Settings Grid -->
          <div class="grid grid-cols-2 gap-3">
            <button class="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-accent hover:text-accent-foreground">
              <Bell class="h-5 w-5 text-muted-foreground" />
              <span class="text-xs font-medium">消息</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-accent hover:text-accent-foreground">
              <Download class="h-5 w-5 text-muted-foreground" />
              <span class="text-xs font-medium">下载</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-accent hover:text-accent-foreground">
              <Shield class="h-5 w-5 text-muted-foreground" />
              <span class="text-xs font-medium">安全</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:bg-accent hover:text-accent-foreground">
              <Settings class="h-5 w-5 text-muted-foreground" />
              <span class="text-xs font-medium">设置</span>
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 space-y-8">
          <!-- Stats Grid -->
          <section>
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-foreground">阅读统计</h3>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="group rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-md">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookOpen class="h-5 w-5" />
                </div>
                <div class="text-3xl font-bold tabular-nums text-foreground">{{ user?.stats?.yesterdayMinutes ?? 0 }}</div>
                <div class="mt-1 text-sm text-muted-foreground">昨日阅读 (分钟)</div>
              </div>
              <div class="group rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-md">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <div class="h-5 w-5 font-bold flex items-center justify-center">🔥</div>
                </div>
                <div class="text-3xl font-bold tabular-nums text-foreground">{{ user?.stats?.streakDays ?? 0 }}</div>
                <div class="mt-1 text-sm text-muted-foreground">连续阅读 (天)</div>
              </div>
              <div class="group rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-md">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <div class="h-5 w-5 font-bold flex items-center justify-center">⏱️</div>
                </div>
                <div class="text-3xl font-bold tabular-nums text-foreground">{{ user?.stats?.totalMinutes ?? 0 }}</div>
                <div class="mt-1 text-sm text-muted-foreground">累计阅读 (分钟)</div>
              </div>
            </div>
          </section>

          <!-- Quick Access -->
          <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <RouterLink
              to="/"
              class="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:bg-accent active:scale-[0.98]"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
                <BookOpen class="h-6 w-6" />
              </div>
              <div>
                <div class="text-sm font-bold">书架</div>
                <div class="text-xs text-muted-foreground">{{ user?.stats?.bookshelfCount ?? 0 }} 本书</div>
              </div>
            </RouterLink>
            <RouterLink
              to="/history"
              class="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:bg-accent active:scale-[0.98]"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
                <UserRound class="h-6 w-6" />
              </div>
              <div>
                <div class="text-sm font-bold">历史记录</div>
                <div class="text-xs text-muted-foreground">{{ user?.stats?.historyCount ?? 0 }} 条</div>
              </div>
            </RouterLink>
            <button
              class="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:bg-accent active:scale-[0.98]"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
                <Heart class="h-6 w-6" />
              </div>
              <div>
                <div class="text-sm font-bold">我的收藏</div>
                <div class="text-xs text-muted-foreground">{{ user?.stats?.favoriteCount ?? 0 }} 个</div>
              </div>
            </button>
          </section>

          <!-- Recent Reading -->
          <section>
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-foreground">最近阅读</h3>
              <button class="text-sm font-medium text-primary hover:underline">查看全部</button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <RouterLink 
                v-for="book in recentBooks" 
                :key="book.id" 
                :to="'/book/' + book.id"
                class="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
              >
                <div class="flex gap-3">
                  <div class="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-sm">
                    <img :src="book.cover" :alt="book.title" class="h-full w-full object-cover" />
                  </div>
                  <div class="flex flex-1 flex-col justify-center min-w-0 py-0.5">
                    <h4 class="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{{ book.title }}</h4>
                    <p class="text-[11px] text-muted-foreground truncate">{{ book.authorName }}</p>
                  </div>
                </div>
                <div class="space-y-1.5 mt-auto">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-muted-foreground">已读 {{ book.progress }}%</span>
                    <span class="font-medium text-primary">继续阅读</span>
                  </div>
                  <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div class="h-full bg-primary transition-all" :style="{ width: book.progress + '%' }"></div>
                  </div>
                </div>
              </RouterLink>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

