/**
 * mockDataRaw
 * 原始数据池：包含书籍、作者、系列、书架、历史、分类等
 * 后续会基于此生成：评论、排行榜、用户信息
 */
const mockDataRaw = {
  books: [
    { id: 101, title: '姑获鸟之夏', authorId: 101, seriesId: null, date: "2010-10-10", length: "502314", award: [], dbRating: 7.9 },
    { id: 102, title: '魍魉之匣 上', authorId: 101, seriesId: 101, date: "2011-10-10", length: "534523", award: [
      { title: "日本推理作家协会奖", edtion: "第49届 获奖"},
      { title: "豆瓣推理小说 Top100", edtion: "No.18"},
    ], dbRating: 8.4 },
    { id: 103, title: '魍魉之匣 下', authorId: 101, seriesId: 101, date: "2012-10-10", length: "87858", award: [
      { title: "日本推理作家协会奖", edtion: "第49届 获奖"},
    ], dbRating: 8.6 },
    { id: 104, title: '付丧堂骨董店 卷一', authorId: 102, seriesId: 102, date: "2008-10-10", length: "57856", award: [], dbRating: 8.4 },
    { id: 105, title: '付丧堂骨董店 卷三', authorId: 102, seriesId: 102, date: "2008-10-10", length: "341177", award: [], dbRating: 8.7 },
    { id: 106, title: '付丧堂骨董店 卷五', authorId: 102, seriesId: 102, date: "2008-10-10", length: "272773", award: [], dbRating: 8.5 },
    { id: 107, title: '付丧堂骨董店 卷七', authorId: 102, seriesId: 102, date: "2008-10-10", length: "373737", award: [], dbRating: 9.4 },
    { id: 108, title: '糖果子弹', authorId: 103, seriesId: null, date: "2019-10-10", length: "373572", award: [], dbRating: 8.3 },
    { id: 109, title: '赤朽叶家的传说', authorId: 103, seriesId: null, date: "2019-10-10", length: "272787", award: [
      { title: "日本推理作家协会奖", edtion: "第60届 获奖" },
      { title: "直木奖", edtion: "第137届 入围" },
      { title: "吉川英治文学新人奖", edtion: "第28届 入围" },
    ], dbRating: 8.3 },
    { id: 110, title: '来自新世界', authorId: 104, seriesId: null, date: "2007-10-10", length: "42424", award: [
      { title: "豆瓣外国小说 Top100", edtion: "No.70" },
    ], dbRating: 8.3 },
    { id: 111, title: '动物凶猛', authorId: 105, seriesId: null, date: "2018-10-10", length: "78787", award: [], dbRating: 7.7 },
    { id: 112, title: '一半是火焰 一半是海水', authorId: 105, seriesId: null, date: "2011-10-10", length: "758733", award: [], dbRating: 7.8 },
    { id: 113, title: '性别麻烦', authorId: 106, seriesId: null, date: "2015-10-10", length: "47787", award: [
      { title: "豆瓣2024年度再版佳作", edtion: "No.10" },
    ], dbRating: 9.0 },
    { id: 114, title: '消解性别', authorId: 106, seriesId: null, date: "2016-10-10", length: "27287", award: [], dbRating: 8.7 },
  ],
  authorList: [{ name: "京极夏彦", id: 101 }, { name: "御堂彰彦", id: 102 }, { name: "樱庭一树", id: 103 }, { name: "贵志祐介", id: 104 }, { name: "王朔", id: 105 }, { name: "朱迪斯 巴特勒", id: 106 }],
  seriesList: [{ name: "魍魉之匣", id: 101 }, { name: "付丧堂骨董店", id: 102}],
  bookshelfList: [{ id: 101 }, { id: 102 }, { id: 103 }, { id: 111 }, { id: 112 }, { id: 113 }, { id: 114 }, { id: 109 }],
  historyList: [],
  //所有书都用这个desc
  desc: `
  日本推理小说“京极堂”系列第一部。

  以阴阳师中禅寺秋彦为主角的“京极堂”系列，开创结合推理和妖怪传说的独特书写新纪元。丰沛的妖怪知识、推理解谜的乐趣、鲜明的人物设定，是“京极堂”系列风靡全日本多年的原因。

  与古代阴阳师不同的是，斩奸除魔的京极堂，除的是栖息在现代社会中人心幽暗处的妖魔。在系列作品中，身兼解谜侦探和除魅阴阳师身份的京极堂，将揭开七种妖怪的真面目。

  妇产科医院久远寺家族的女儿怀胎20个月始终无法生产，更诡异的是，她的丈夫在一年半前居然在宛如密室的房间里，如烟一般地消失得无影无踪了……

  夏日的午后，作家关口巽行经倾斜的坡道，来到坡道尽头一家叫做“京极堂”的旧书店，造访他大学时期的朋友中禅寺秋彦——他的朋友都以店名“京极堂”来称呼他。关口为京极堂带来这么一个奇怪的故事，期望得到解答，两人却赫然发现在密室中消失的男人是他们的大学同学，京极堂和关口是否曾经在这无法生产的女人和消失的男人事件里，扮演了什么样关键的角色？

  传说中的姑获鸟这种妖怪的形象和传说，不时困惑侵扰着关口巽，白天是旧书店老板的京极堂，有需要时会以阴阳师装束出现除祆。尽管时序已进入到现代，妖魔仍在作祟。在这个号称理性时代却百鬼夜行的时空里，经常将“这个世界上没有什么不可思议的事情”挂在嘴上的京极堂，又该以何种方式解明这一桩不可思议的事件？

  姑获鸟：原为中国传统怪物，又名“夜行游女”、“天帝少女”或是“鬼鸟”，形象殊异，《齐东野语》中形容为“身圆如箕，十脰（脰：脖子）环簇，其头有九，其一独无，而鲜血点滴，如世所传每脰各生两翅，当飞时，十八翼霍霍竟进，不相为用，至有争拗折伤者”，《本草纲目》则说它是“鬼神类也。衣毛为飞鸟，脱毛为女人。云是产妇死后化作，故胸前有两乳，喜取人子养为己子。凡有小儿家，不可夜露衣物。此鸟夜飞，以血点之为志。儿辄病惊痫及疳疾，谓之无辜疳也。荆州多有之。亦谓之鬼鸟。……此鸟纯雌无雄，七八月夜飞，害人尤毒也。”

  `,
  // 分类下的书籍列表随机抽取放入
  catelogList: [
    { name: "悬疑推理", id: 101}, 
    { name: "奇幻悬疑", id: 102}, 
    { name: "纪实文学", id: 103}, 
    { name: "人文历史", id: 104}, 
    { name: "社会科学", id: 105}, 
    { name: "政治军事", id: 106}, 
    { name: "投资理财", id: 107}, 
    { name: "创业经营", id: 108}, 
    { name: "生活百科", id: 109}, 
    { name: "励志成长", id: 110}, 
  ],
  // 排行榜数据容器（在 ensureRawGenerated 中填充）
  rakingList: [],
  // 评论容器（在 ensureRawGenerated 中生成并分配至各书籍）
  commentList: [],
  // 用户信息（在 ensureRawGenerated 中生成）
  userInfo: {
    
  }
};

/**
 * 工具函数
 * - randInt：整型随机数
 * - pickOne：从列表中取一个
 * - shuffle：洗牌
 * - safeClone：深克隆（用于返回数据时的隔离）
 */
const randInt = (min, max) => {
  const nMin = Number(min)
  const nMax = Number(max)
  if (!Number.isFinite(nMin) || !Number.isFinite(nMax)) return 0
  const low = Math.min(nMin, nMax)
  const high = Math.max(nMin, nMax)
  return Math.floor(low + Math.random() * (high - low + 1))
}

const pickOne = (list) => list[randInt(0, list.length - 1)]

const shuffle = (list) => {
  const arr = list.slice()
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

const safeClone = (value) => JSON.parse(JSON.stringify(value))

/**
 * ensureRawGenerated
 * 根据原始书籍列表生成：
 *  - userInfo（阅读统计等）
 *  - commentList（每本书随机数量的评论）
 *  - rakingList（热门/高分/畅销三类）
 */
const ensureRawGenerated = () => {
  if (mockDataRaw.userInfo && mockDataRaw.userInfo.id) return

  const userPool = [
    { id: 1, name: 'Mino', level: 12 },
    { id: 2, name: '阿树', level: 7 },
    { id: 3, name: '北山', level: 4 },
    { id: 4, name: '小圆', level: 9 },
    { id: 5, name: 'Rita', level: 6 },
    { id: 6, name: 'K', level: 3 },
    { id: 7, name: '风筝', level: 11 },
    { id: 8, name: '秋', level: 5 },
    { id: 9, name: '小鱼', level: 8 },
    { id: 10, name: '路人甲', level: 2 },
  ]

  mockDataRaw.userInfo = {
    id: 1,
    name: 'Mino',
    avatar: 'avatar.svg',
    level: 12,
    bio: '保持阅读，保持好奇。',
    stats: {
      yesterdayMinutes: randInt(0, 120),
      totalMinutes: randInt(300, 12000),
      streakDays: randInt(0, 30),
      bookshelfCount: mockDataRaw.bookshelfList.length,
      historyCount: mockDataRaw.historyList.length,
      favoriteCount: randInt(0, 120),
    },
  }

  const commentTemplates = [
    '读起来很顺，节奏稳。',
    '设定挺有意思，细节也足。',
    '越往后越好看，推荐。',
    '文字有劲，情绪很到位。',
    '中段有点慢，但结尾收得不错。',
    '人物塑造很立体，喜欢。',
    '氛围感强，适合一口气读完。',
    '反转不算多，但逻辑很扎实。',
    '读完回味很久。',
    '我更喜欢前半段的铺垫。',
  ]

  const books = mockDataRaw.books
  const comments = []
  let nextCommentId = 1

  for (const book of books) {
    const count = randInt(6, 18)
    for (let i = 0; i < count; i += 1) {
      const u = pickOne(userPool)
      const createdAt = Date.now() - randInt(0, 1000 * 60 * 60 * 24 * 120)
      comments.push({
        id: nextCommentId++,
        bookId: book.id,
        userId: u.id,
        userName: u.name,
        userAvatar: `https://picsum.photos/seed/user-${u.id}/64/64`,
        content: pickOne(commentTemplates),
        likeCount: randInt(0, 320),
        liked: false,
        createdAt,
      })
    }
  }

  mockDataRaw.commentList = comments

  const byRatingDesc = books
    .slice()
    .sort((a, b) => Number(b.dbRating) - Number(a.dbRating))
    .map((b, idx) => ({ id: b.id, rank: idx + 1, dbRating: b.dbRating }))

  const finished = shuffle(books.filter((b) => b.seriesId == null)).slice(0, 10)
  const finishedSorted = finished
    .slice()
    .sort((a, b) => Number(b.dbRating) - Number(a.dbRating))
    .map((b, idx) => ({ id: b.id, rank: idx + 1, dbRating: b.dbRating }))

  const potential = shuffle(books.filter((b) => Number(b.dbRating) < 8.6)).slice(0, 10)
  const potentialSorted = potential
    .slice()
    .sort((a, b) => Number(b.dbRating) - Number(a.dbRating))
    .map((b, idx) => ({ id: b.id, rank: idx + 1, dbRating: b.dbRating }))

  mockDataRaw.rakingList = {
    hot: byRatingDesc.slice(0, 10),
    finished: finishedSorted,
    potential: potentialSorted,
  }
}

ensureRawGenerated()

/**
 * mockData
 * 将 raw 数据处理为可直接用于前端渲染的结构
 */
const mockData = {
  meta: {
    generatedAt: Date.now(),
  },
}

const chapterTitlePool = [
  '雨夜来客',
  '不速之约',
  '旧书店的灯',
  '消失的房间',
  '暗处的回声',
  '纸上的名字',
  '街角的风',
  '线索与误差',
  '沉默的证言',
  '与影子同行',
  '落在窗台的雪',
  '真相的边缘',
]

const chapterContentPool = [
  '屋里安静得只剩下钟表的滴答声，像是在提醒你时间并不会因为犹豫而停下。',
  '他把话说得很轻，却像一枚钉子钉进木头里，让人无法忽视。',
  '雨水顺着屋檐落下，打碎在台阶上，溅起一阵细小的白雾。',
  '你以为看到的是答案，其实只是另一层遮掩。',
  '灯光一晃，纸页上的字仿佛也跟着动了起来。',
  '每个人都在叙述同一件事，却像在讲述不同的世界。',
]

/**
 * buildMockData
 * 完成字段映射与聚合：
 *  - 为书籍补充 authorName / seriesName / cover / desc 等
 *  - 生成书架、历史、分类、排行榜、按书籍聚合的评论
 */
const buildMockData = () => {
  const authorById = new Map(mockDataRaw.authorList.map((a) => [a.id, a]))
  const seriesById = new Map(mockDataRaw.seriesList.map((s) => [s.id, s]))
  const commentsByBookId = new Map()

  for (const c of mockDataRaw.commentList) {
    const arr = commentsByBookId.get(c.bookId) ?? []
    arr.push(c)
    commentsByBookId.set(c.bookId, arr)
  }

  const books = mockDataRaw.books.map((b) => {
    const author = authorById.get(b.authorId) ?? null
    const series = b.seriesId ? seriesById.get(b.seriesId) ?? null : null
    const chapterCount = randInt(12, 30)
    const chapters = Array.from({ length: chapterCount }, (_, idx) => ({
      id: idx + 1,
      title: `第${idx + 1}章 ${pickOne(chapterTitlePool)}`,
      content: pickOne(chapterContentPool),
    }))
    const mapped = {
      id: b.id,
      title: b.title,
      authorId: b.authorId,
      authorName: author?.name ?? '',
      seriesId: b.seriesId ?? null,
      seriesName: series?.name ?? '',
      date: b.date,
      length: Number(b.length),
      award: b.award ?? [],
      dbRating: Number(b.dbRating),
      desc: mockDataRaw.desc.trim(),
      // 使用相对路径以兼容打包后 file:// 双击打开
      cover: `cover/${b.id}.jpg`,
      chapters,
    }
    return mapped
  })

  const bookById = new Map(books.map((b) => [b.id, b]))
  let nextVirtualBookId = Math.max(0, ...books.map((b) => Number(b.id) || 0)) + 1

  const bookshelf = mockDataRaw.bookshelfList
    .map((x) => bookById.get(x.id))
    .filter(Boolean)

  const history = mockDataRaw.historyList
    .map((x) => bookById.get(x.id))
    .filter(Boolean)
  const historyExpanded = history.slice()
  const desiredHistoryCount = randInt(22, 30)
  while (historyExpanded.length < desiredHistoryCount && books.length > 0) {
    historyExpanded.push(pickOne(books))
  }

  const allIds = books.map((b) => b.id)
  const categories = mockDataRaw.catelogList.map((c) => {
    const desiredCount = randInt(15, 100)
    const picked = shuffle(allIds)
      .slice(0, Math.min(allIds.length, desiredCount))
      .map((id) => bookById.get(id))
      .filter(Boolean)

    const list = picked.slice()
    while (list.length < desiredCount && list.length > 0) {
      const src = list[list.length % picked.length]
      list.push({ ...src, id: nextVirtualBookId++ })
    }

    return { id: c.id, name: c.name, books: list }
  })

  const rankings = {
    hot: (mockDataRaw.rakingList.hot ?? [])
      .map((r) => {
        const b = bookById.get(r.id)
        if (!b) return null
        return { rank: r.rank, book: b }
      })
      .filter(Boolean),
    finished: (mockDataRaw.rakingList.finished ?? [])
      .map((r) => {
        const b = bookById.get(r.id)
        if (!b) return null
        return { rank: r.rank, book: b }
      })
      .filter(Boolean),
    potential: (mockDataRaw.rakingList.potential ?? [])
      .map((r) => {
        const b = bookById.get(r.id)
        if (!b) return null
        return { rank: r.rank, book: b }
      })
      .filter(Boolean),
  }

  const comments = {}
  for (const [bookId, list] of commentsByBookId.entries()) {
    comments[String(bookId)] = list
      .slice()
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 50)
  }

  mockData.books = books
  mockData.bookshelf = bookshelf
  mockData.history = historyExpanded
  mockData.categories = categories
  mockData.rankings = rankings
  mockData.comments = comments
  const baseUser = mockDataRaw.userInfo ?? {}
  mockData.user = {
    ...baseUser,
    stats: {
      ...(baseUser.stats ?? {}),
      bookshelfCount: bookshelf.length,
      historyCount: historyExpanded.length,
    },
  }
}

buildMockData()

export { mockDataRaw, mockData }

/**
 * resolveByPath
 * 通过 path 解析并返回 mockData 中的子数据
 * 支持：
 *  - /books, /books/:id
 *  - /bookshelf, /history, /categories, /rankings, /user
 *  - /comments/:bookId
 *  - 任意对象链路径，如：/meta
 */
const resolveByPath = (path) => {
  const normalized = String(path ?? '').trim()
  if (!normalized || normalized === '/') return mockData

  const clean = normalized.startsWith('/') ? normalized : `/${normalized}`
  const [pathname, queryString] = clean.split('?')
  const query = Object.fromEntries(new URLSearchParams(queryString ?? ''))
  const parts = String(pathname ?? '').split('/').filter(Boolean)

  if (parts[0] === 'books') {
    if (parts.length === 1) return mockData.books
    const id = Number(parts[1])
    return mockData.books.find((b) => b.id === id) ?? null
  }

  if (parts[0] === 'bookshelf') return mockData.bookshelf
  if (parts[0] === 'history') return mockData.history
  if (parts[0] === 'categories') {
    if (parts.length === 1) return mockData.categories
    const id = Number(parts[1])
    return mockData.categories.find((c) => c.id === id) ?? null
  }
  if (parts[0] === 'authors') {
    if (parts.length === 1) return mockDataRaw.authorList ?? []
    const id = Number(parts[1])
    if (!Number.isFinite(id)) return null
    const author = (mockDataRaw.authorList ?? []).find((a) => Number(a.id) === id) ?? null
    const books = (mockData.books ?? []).filter((b) => Number(b.authorId) === id)
    return { id, name: author?.name ?? '', books }
  }
  if (parts[0] === 'series') {
    if (parts.length === 1) return mockDataRaw.seriesList ?? []
    const id = Number(parts[1])
    if (!Number.isFinite(id)) return null
    const series = (mockDataRaw.seriesList ?? []).find((s) => Number(s.id) === id) ?? null
    const books = (mockData.books ?? []).filter((b) => Number(b.seriesId) === id)
    return { id, name: series?.name ?? '', books }
  }
  if (parts[0] === 'rankings') return mockData.rankings
  if (parts[0] === 'user') return mockData.user
  if (parts[0] === 'search') {
    const q = String(query.q ?? '').trim().toLowerCase()
    if (!q) return []
    return mockData.books.filter((b) => {
      const title = String(b.title ?? '').toLowerCase()
      const authorName = String(b.authorName ?? '').toLowerCase()
      return title.includes(q) || authorName.includes(q)
    })
  }

  if (parts[0] === 'comments') {
    const id = Number(parts[1])
    if (!Number.isFinite(id)) return []
    return mockData.comments[String(id)] ?? []
  }

  let cur = mockData
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
    else return null
  }
  return cur
}

/**
 *  @desc 模拟接口调用, 可传入延迟
 */
export const getMockData = (path, lag = 0, sucsess = true) =>{
  const delay = Math.max(0, Number(lag) || 0)
  const ok = Boolean(sucsess)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!ok) {
        reject({
          code: 500,
          message: 'mock request failed',
          path,
        })
        return
      }

      try {
        const data = resolveByPath(path)
        resolve({
          code: 0,
          data: safeClone(data),
        })
      } catch (e) {
        reject({
          code: 500,
          message: 'mock resolve failed',
          path,
        })
      }
    }, delay)
  })
}
