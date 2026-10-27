# 视频源文件说明

`video-source/` 存放**压缩前的原片**，2026-10-27 从
`backups/2026-10-26-video-precompress/`（已删）迁入，是高质量剪辑/重压缩的唯一源头。

| 文件 | 大小 | md5 前 8 位 | 线上压缩版 |
|---|---|---|---|
| `main.mp4` | 7,810,527 B | `73cbc27f` | `public/assets/scrolly/main.mp4`（3,525,864 B） |
| `intro.mp4` | 3,312,249 B | `c4cb8d96` | `public/assets/scrolly/intro.mp4`（2,144,899 B） |

- 线上版是 2026-10-26 用 ffmpeg 压缩后直接提交的（seek 延迟与画质经 ego 浏览器 8 轮实测）。
- **不要把这里的原片拷进 `public/`**：体积翻倍，首屏加载实测会慢数倍。
- 需要重新压缩时，参考 HANDOVER 第一百零二次前后的压缩参数记录。
- `video-covers/` 是视频封面图，与源片无关，另行保留。
