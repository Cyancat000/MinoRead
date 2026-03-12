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

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/user', 80, true)
    user.value = (res?.data as User) ?? null
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
        <h1 class="text-lg font-semibold tracking-tight">个人主页</h1>
        <RouterLink
          to="/"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="返回首页"
          title="返回首页"
        >
          <Home class="h-5 w-5" />
        </RouterLink>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-4">
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="grid gap-4">
        <div class="rounded-xl border border-border bg-background p-4">
          <div class="flex items-center gap-3">
            <div class="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
              <img
                :src="user?.avatar"
                :alt="user?.name ?? 'avatar'"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <div class="truncate text-base font-semibold text-foreground">{{ user?.name ?? '游客' }}</div>
                <div
                  class="inline-flex h-6 items-center rounded-full border border-border bg-muted px-2 text-xs text-muted-foreground"
                >
                  Lv.{{ user?.level ?? 0 }}
                </div>
              </div>
              <div v-if="user?.bio" class="mt-1 truncate text-xs text-muted-foreground">{{ user.bio }}</div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-2">
            <div class="rounded-lg border border-border bg-background p-2 text-center">
              <div class="text-base font-semibold tabular-nums text-foreground">
                {{ user?.stats?.yesterdayMinutes ?? 0 }}
              </div>
              <div class="text-[11px] text-muted-foreground">昨日分钟</div>
            </div>
            <div class="rounded-lg border border-border bg-background p-2 text-center">
              <div class="text-base font-semibold tabular-nums text-foreground">{{ user?.stats?.streakDays ?? 0 }}</div>
              <div class="text-[11px] text-muted-foreground">连续天数</div>
            </div>
            <div class="rounded-lg border border-border bg-background p-2 text-center">
              <div class="text-base font-semibold tabular-nums text-foreground">{{ user?.stats?.totalMinutes ?? 0 }}</div>
              <div class="text-[11px] text-muted-foreground">累计分钟</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <RouterLink
            to="/"
            class="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background py-3 transition-transform active:scale-[0.98]"
          >
            <BookOpen class="h-5 w-5 text-foreground" />
            <div class="text-xs text-foreground">书架</div>
            <div class="text-[11px] tabular-nums text-muted-foreground">{{ user?.stats?.bookshelfCount ?? 0 }}</div>
          </RouterLink>
          <RouterLink
            to="/history"
            class="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background py-3 transition-transform active:scale-[0.98]"
          >
            <UserRound class="h-5 w-5 text-foreground" />
            <div class="text-xs text-foreground">历史</div>
            <div class="text-[11px] tabular-nums text-muted-foreground">{{ user?.stats?.historyCount ?? 0 }}</div>
          </RouterLink>
          <button
            type="button"
            class="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background py-3 transition-transform active:scale-[0.98]"
          >
            <Heart class="h-5 w-5 text-foreground" />
            <div class="text-xs text-foreground">收藏</div>
            <div class="text-[11px] tabular-nums text-muted-foreground">{{ user?.stats?.favoriteCount ?? 0 }}</div>
          </button>
        </div>

        <div class="grid gap-2">
          <button
            type="button"
            class="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 transition-transform active:scale-[0.98]"
          >
            <Bell class="h-5 w-5 text-muted-foreground" />
            <div class="text-sm text-foreground">消息通知</div>
          </button>
          <button
            type="button"
            class="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 transition-transform active:scale-[0.98]"
          >
            <Download class="h-5 w-5 text-muted-foreground" />
            <div class="text-sm text-foreground">离线下载</div>
          </button>
          <button
            type="button"
            class="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 transition-transform active:scale-[0.98]"
          >
            <Shield class="h-5 w-5 text-muted-foreground" />
            <div class="text-sm text-foreground">账号与安全</div>
          </button>
          <button
            type="button"
            class="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 transition-transform active:scale-[0.98]"
          >
            <Settings class="h-5 w-5 text-muted-foreground" />
            <div class="text-sm text-foreground">设置</div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
