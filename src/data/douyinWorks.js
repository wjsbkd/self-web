// 抖音账号运营作品数据 —— 用于 AccountOperations 板块展示
// 每条对应一张手机端作品详情截图（已压缩至 public/assets/douyin/）
// title / caption 取自截图实测文案；截图中被「展开」截断的句子以 …… 原样保留，不要补全
// 互动数取自截图右侧统计列（点赞 / 评论 / 收藏 / 分享），id N 与 douyin-0N.jpg 一一对应

export const douyinWorks = [
  {
    id: 1,
    title: '北伐失败，怎么不找找自己问题',
    category: '历史人物解读',
    views: '266.8万播放',
    caption:
      '「北伐失败，怎么不找找自己问题」——用虎扑评分卡的形式给三国人物打分，画面里诸葛亮（唐国强饰）7.6 分、一句「悠悠苍天，何薄于我」。详情页带出的评论是「张角那期真的是 疑似张角魂穿现世」。这批截图里唯一露出播放量数字的一条：266.8 万播放 · 点赞 2.7 万 · 评论 300 · 收藏 1764。',
    image: '/assets/douyin/douyin-01.jpg',
    featured: true,
    tags: ['历史', '三国', '虎扑评分'],
  },
  {
    id: 2,
    title: '老法拉利怎么啦？依旧霸气外露',
    category: '娱乐热点',
    views: '3.1万赞',
    caption:
      '「老法拉利怎么啦？依旧霸气外露 #周润发 #mama颁奖典礼 #2025m……」——2025-11-30 发布。点赞 3.1 万 · 评论 356 · 收藏 1462 · 分享 4138。',
    image: '/assets/douyin/douyin-02.jpg',
    featured: false,
    tags: ['周润发', 'MAMA颁奖典礼', '娱乐热点'],
  },
  {
    id: 3,
    title: '「网红」黑神话悟空',
    category: '游戏文化',
    views: '1.4万赞',
    caption:
      '「你觉得自己像他吗？像，我也像他一样视恶如仇，一样愤世嫉俗，更希望像他一样光芒万丈……」——配图像卡写「当过刺客，当过牛仔，但我还是想当齐天大圣」，2024-08-11 发布，踩在《黑神话：悟空》上线当周。点赞 1.4 万 · 评论 310 · 收藏 559 · 分享 906。',
    image: '/assets/douyin/douyin-03.jpg',
    featured: false,
    tags: ['黑神话悟空', '游戏', '图文'],
  },
  {
    id: 4,
    title: 'Passion!',
    category: '情绪表达',
    views: '1.2万赞',
    caption:
      '「Passion! 人生就算天崩地裂也要 pass……」——2024-09-02 发布，把当时的「Passion」热梗接成一句态度话。点赞 1.2 万 · 评论 257 · 收藏 1020 · 分享 1040。',
    image: '/assets/douyin/douyin-04.jpg',
    featured: false,
    tags: ['Passion', '热梗', '态度'],
  },
  {
    id: 5,
    title: '诶！我不是天才吗？',
    category: '青春励志',
    views: '1.4万赞',
    caption:
      '「鲜衣怒马少年时，不负韶华行且知 #……」——2025-07-08 发布，配乐《少年长跑进行曲》。收藏 3582 是评论 103 的三十多倍，是这批作品里收藏/评论比最高的一条。点赞 1.4 万 · 评论 103 · 收藏 3582 · 分享 1259。',
    image: '/assets/douyin/douyin-05.jpg',
    featured: false,
    tags: ['励志', '语录', '少年感'],
  },
  {
    id: 6,
    title: '为什么《强风吹拂》没有第二季？',
    category: '动漫解读',
    views: '7880赞',
    caption:
      '「因为等你看完穿上跑鞋的那一刻，第……」——配图像卡写「跑步中的精神氮泵，纵有疾风起，人生不言弃」，2025-07-10 发布，配乐《起风了》。用反问标题把一部番推给正在跑步的人。点赞 7880 · 评论 56 · 收藏 1747 · 分享 448。',
    image: '/assets/douyin/douyin-06.jpg',
    featured: false,
    tags: ['强风吹拂', '动漫', '跑步'],
  },
  {
    id: 7,
    title: '黑田朝日！牛X！',
    category: '体育',
    views: '5944赞',
    caption:
      '「纵有疾风起，#箱根驿传 在等你！#强风吹拂 #马拉松 #中长跑 #……」——2025-01-01 发布，正逢箱根驿传档口，把番名和真实赛事写进同一串话题里。点赞 5944 · 评论 123 · 收藏 571 · 分享 505。',
    image: '/assets/douyin/douyin-07.jpg',
    featured: false,
    tags: ['箱根驿传', '强风吹拂', '马拉松'],
  },
  {
    id: 8,
    title: '真正的超级英雄',
    category: '影视解读',
    views: '1712赞',
    caption:
      '「他们冒着断送职业生涯的风险勇敢 为……」——2024-10-18 发布，配乐 Ferrari。点赞 1712 · 评论 34 · 收藏 62 · 分享 66。',
    image: '/assets/douyin/douyin-08.jpg',
    featured: false,
    tags: ['超级英雄', '混剪', '观点'],
  },
  {
    id: 9,
    title: '朋友，「我们总是要再见 为了再见」',
    category: '旅行记录',
    views: '2073赞',
    caption:
      '「分别是为了更好的相见 Let\'s go #小……」——配图像卡标注「探索美国第七期」，2024-11-21 发布，配乐 How to Love，是一个旅行图文系列的其中一期。点赞 2073 · 评论 25 · 收藏 153 · 分享 185。',
    image: '/assets/douyin/douyin-09.jpg',
    featured: false,
    tags: ['旅行', '系列', '记录'],
  },
  {
    id: 10,
    title: '所以是时势造英雄还是英雄造时势',
    category: '历史评论',
    views: '2390赞',
    caption:
      '「一介布衣到九五之尊只用了七年……」——2024-10-07 发布，配乐《我不让》（DJ77 版伴奏），把结论留成一句开放式提问。点赞 2390 · 评论 145 · 收藏 383 · 分享 190。',
    image: '/assets/douyin/douyin-10.jpg',
    featured: false,
    tags: ['历史', '朱元璋', '观点'],
  },
  {
    id: 11,
    title: '金珠玛米亚布都！',
    category: '致敬',
    views: '4343赞',
    caption:
      '「每当灾难来临，金珠玛米总是第一时……」——2025-01-13 发布的四图图文，配图像卡「人民说他万岁，他说人民万岁」「唤起工农千百万，同心干」「不周山下红旗乱」，配乐 Episode 33（纯音乐）。点赞 4343 · 评论 184 · 收藏 412 · 分享 117。',
    image: '/assets/douyin/douyin-11.jpg',
    featured: false,
    tags: ['解放军', '致敬', '图文'],
  },
  {
    id: 12,
    title: '3A「网红」——黑神话悟空',
    category: '游戏评论',
    views: '7033赞',
    caption:
      '「是黑魂不够经典吗？不是。是只狼不够好玩吗？……」——配图像卡「是什么让我狂玩半个多月，200 小时结束游戏」，画面把《巫师 3：狂猎》的 9.4 分（5313 JRs 评分）和「为了女巫跑遍了整个交界地」放在一起调侃，2024-08-14 发布。这是账号互动结构最特殊的一条：评论 1977、分享 1159 都远高于收藏 323。点赞 7033 · 评论 1977 · 收藏 323 · 分享 1159。',
    image: '/assets/douyin/douyin-12.jpg',
    featured: false,
    tags: ['黑神话悟空', '巫师3', '虎扑评分'],
  },
  {
    id: 13,
    title: '你告诉我！谁才是真正的「网红」！',
    category: '社会观点',
    views: '3067赞',
    caption:
      '「想学 马思唯 但是没有思唯和马，说唱不应该是用来展现优越的工具，劝你说唱之前 先去学学做人……」——配图像卡「是人民的儿子，以前是，现在也是，未来还是。」，画面给「农民」打出 9.7 分（5.4 万 JRs 评分），2024-08-12 发布。和 3A「网红」那条是同一选题的两半。点赞 3067 · 评论 133 · 收藏 141 · 分享 280。',
    image: '/assets/douyin/douyin-13.jpg',
    featured: false,
    tags: ['虎扑评分', '说唱', '观点'],
  },
  {
    id: 14,
    title: '近期最具影响力的虎扑男神评分 TOP10',
    category: '榜单盘点',
    views: '3061赞',
    caption:
      '「谁又是你心目中的男神 TOP1 呢 #虎扑男神……」——2024-09-13 发布的视频，画面标题「虎扑 2024 年度评分 最受欢迎的虎扑男神 TOP10」，配乐 Nightcore Edit。盘点式结构，靠一句提问把选边站留给评论区。点赞 3061 · 评论 148 · 收藏 202 · 分享 286。',
    image: '/assets/douyin/douyin-14.jpg',
    featured: false,
    tags: ['虎扑男神', 'TOP10', '盘点'],
  },
  {
    id: 15,
    title: '纵走疾风谁人拦，不破驿传终不还！',
    category: '体育',
    views: '1557赞',
    caption:
      '「这世界每一份相遇都很奇妙！一群不……」——配图像卡「王牌中的王牌」，画面是太田苍生「超级王牌 · 四区区间赏」的 10.0 分（28 JRs 评分），2025-01-05 发布，配乐《心之所动》，箱根驿传选题的收尾。点赞 1557 · 评论 31 · 收藏 155 · 分享 63。',
    image: '/assets/douyin/douyin-15.jpg',
    featured: false,
    tags: ['箱根驿传', '太田苍生', '田径'],
  },
]

export const accountIdentity = {
  platform: '抖音',
  name: '我将势不可挡',
  url: 'https://v.douyin.com/k8afilJ0GOk/',
  stats: [
    { value: '280W+', label: '单条最高播放' },
    { value: '1000W+', label: '累计播放' },
    { value: '50+', label: '直播切片产出' },
  ],
}
