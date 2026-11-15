# dachengad.cn · 大成广告装饰官网

兰陵县本地广告制作安装商的官方网站：户外广告灯牌、室内锦旗定制、图像喷绘、展会特装搭建。

纯静态站点，零构建、零依赖，推送到 `main` 即自动部署。

- 仓库：<https://github.com/dachengad/dachengad.cn>
- 正式域名：<https://dachengad.cn/>（已绑定）
- 默认地址：<https://dachengad.github.io/dachengad.cn/>

---

## 1. 业务信息

| 项 | 内容 |
| --- | --- |
| 品牌名 | 大成广告装饰 |
| 主营 | 户外广告灯牌 / 门头招牌、室内锦旗定制、图像喷绘、展会特装 |
| 服务范围 | 兰陵县全域（含各乡镇） |
| 主电话 | 137 9390 0959（微信同号，红色头像） |
| 备用电话 | 1346 821 9876（微信同号，蓝色头像） |
| 邮箱 | 13793900959@163.com |
| 门店地址 | 山东省临沂市兰陵县卞庄街道中兴路北段 44 号 |
| 营业时间 | 周一至周日 08:00–19:00 |
| 成立时间 | 2012-02-27 |

> 以上信息在页面上出现在：联系区、页脚、以及 `index.html` 里的 JSON-LD 结构化数据。改信息时三处要一起改。

---

## 2. 页面结构

单页站点，锚点导航：

| 区块 | 锚点 | 内容 |
| --- | --- | --- |
| 首屏 | `#top` | 品牌、主标题、电话 CTA、业务标签 |
| 业务 | `#services` | 三项主业务（灯牌 / 锦旗 / 喷绘）+ 其他承接说明 |
| 案例 | `#cases` | 9 张现场实拍 + 3 个预留展示位 |
| 流程 | `#process` | 沟通 → 测量 → 打样 → 安装 |
| 关于 | `#studio` | 公司介绍、成立时间、服务范围、工商信息外链 |
| 联系 | `#contact` | 电话、备用电话、微信（双头像）、邮箱、地址、地图导航 |

移动端（≤900px）隐藏顶部横向导航，改为右上角菜单按钮，展开全屏目录（业务 / 案例 / 流程 / 关于 / 联系 + 电话）；
≤680px 时底部常驻「电话 + 号码」拨打条。

页脚含「友情链接」：邮箱系统（mail.bomod.cn）、游戏展示（zhcool.xyz，新站建设中）、新站（bomod.cn）、老站（zhcool520.xyz）。

---

## 3. 目录结构

```
dachengad/                     ← 仓库根目录
├─ index.html                  整站页面（含 SEO meta 与 JSON-LD）
├─ assets/
│   ├─ css/styles.css          全部样式，主题色集中在 :root
│   ├─ js/main.js              导航、滚动进场、系统地图唤起、案例大图
│   └─ img/
│       ├─ brand/              品牌资产：logo、图标、微信头像、分享封面
│       └─ cases/              案例图（960 / 480 两档，jpg + webp）
│           └─ full/           点击后加载的 1280 宽大图（仅 webp）
├─ favicon.ico                 浏览器标签图标（蓝色微信头像）
├─ site.webmanifest            PWA / 添加到桌面图标配置
├─ robots.txt
├─ sitemap.xml
├─ README.md
└─ .github/workflows/pages.yml GitHub Pages 自动部署
```

素材原图放在仓库外的 `../素材/`（即 `E:\GitHub\网站\dachengad.cn\素材\`），按业务分类建子目录；仓库里只放压缩后的成品图。

---

## 4. 设计规范

### 配色（取自门头招牌）

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--accent` | `#c8171f` | 招牌红：按钮、色块、强调 |
| `--accent-strong` | `#a31118` | 按钮 hover |
| `--accent-soft` | `#ff6a6d` | 深色底上的强调文字 |
| `--ink` | `#101012` | 深色区背景 |
| `--paper` | `#f7f5f0` | 浅色区背景 |
| `--text` / `--text-soft` | `#17171a` / `#5d5b56` | 正文 / 次要文字 |

改主题只动 `assets/css/styles.css` 顶部的 `:root`。

### 排版与动效

- 无外链字体，走系统中文字体栈，弱网也能即时渲染
- 字重靠 800/900 建立层级，标题使用负字距
- 进场动画：`[data-reveal]` + `IntersectionObserver`，逐个上浮
- 全站遵从 `prefers-reduced-motion`，开启后关闭动画

---

## 5. 图片规范

线上图片按用途分目录：品牌资产在 `assets/img/brand/`，案例图在 `assets/img/cases/`（大图在其 `full/` 子目录）。

| 文件 | 内容 | 尺寸 |
| --- | --- | --- |
| `case-luosifen` | 螺小转门头喷绘 | 960×720（+ 480 宽小图） |
| `case-pingpong` | 谦望乒乓门头灯箱 | 960×720（+ 480 宽小图） |
| `case-pennant` | 烫金锦旗 | 960×1280（+ 480 宽小图） |
| `case-board` | 校园宣传栏 | 960×720（+ 480 宽小图） |
| `case-culture` | 医院文化墙 | 960×720（+ 480 宽小图） |
| `case-kids` | 幼儿园立体标识 | 960×720（+ 480 宽小图） |
| `case-expo-1/2/3` | 展会特装 | 960×720（+ 480 宽小图） |
| `wechat-main` / `wechat-second` | 微信头像 | 96×96 |
| `og-cover` | 社交分享封面 | 1200×630 |

处理规则：

1. **不裁剪构图**，只做等比缩放；需要适配版式时用 CSS `object-fit` 处理
2. 手机号、门头 TEL、水印面板（工程记录 / 今日水印）一律**高斯模糊**，不裁掉
3. 每张出两档宽度（960 / 480），各自导出 `jpg`（q76）与 `webp`（q68），页面用 `<picture>` + `srcset` 按视口取用
4. 案例图统一 4:3，`loading="lazy"` + 显式 `width/height` 防止布局抖动
5. 微信头像只用于 36px 展示，出 96px（2x）即可；带 `preload` + `fetchpriority="high"` 优先加载

### 案例大图（点击后加载）

- 列表里是 960 / 480 两档缩略图，滚到才请求，首屏不背这个包袱
- 点击案例 → 灯箱先把**已缓存的缩略图**铺满并轻微模糊，再从 `assets/img/full/` 拉 1280 宽 webp，加载完淡入覆盖
- `full/` 目录只在点击时才被访问，命名与列表图一致（`case-xxx.webp`，约 30–230KB/张，合计约 1MB）
- 支持 ESC、点遮罩、关闭按钮退出；案例卡可 Tab 聚焦、回车/空格打开

### 替换预留展示位

案例区最后三个 `.tile--empty` 是留给「广告设计成品图」的。补图时先按上面规则导出两档缩略图 + `full/` 大图，再把整块替换成：

```html
<figure class="tile">
  <picture>
    <source type="image/webp" sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw"
      srcset="assets/img/cases/case-design-1-480.webp 480w, assets/img/cases/case-design-1.webp 960w" />
    <img src="assets/img/cases/case-design-1.jpg" width="960" height="720" loading="lazy" decoding="async"
      sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw"
      srcset="assets/img/cases/case-design-1-480.jpg 480w, assets/img/cases/case-design-1.jpg 960w"
      alt="图片说明" />
  </picture>
  <figcaption><span>广告设计</span>项目名称</figcaption>
</figure>
```

大图按 `assets/img/cases/full/case-design-1.webp` 放一张 1280 宽同名文件，点击灯箱会自动取用。

---

## 6. 本地预览

任选一种，无需安装依赖：

```bash
# Python（推荐，项目里已有环境）
python -m http.server 8899

# 或 Node
npx serve .
```

然后打开 <http://127.0.0.1:8899/>。直接双击 `index.html` 也能看，但 `site.webmanifest`、`robots.txt` 这类文件需要 HTTP 环境才生效。

---

## 7. 部署

已配置 GitHub Pages + Actions：**push 到 `main` 自动发布**，也可在 Actions 页手动触发 `Deploy to GitHub Pages`。

首次部署需在仓库 `Settings → Pages → Source` 选择 `GitHub Actions`（已启用）。

### 自有域名

`dachengad.cn` 已绑定并开启 HTTPS，`canonical` / `og:url` / `sitemap.xml` 均指向该域名。DNS 备查：

- `A` → `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
- `www` → `CNAME` → `dachengad.github.io`

---

## 8. SEO 现状

已做：

- 独立 `<title>`、`description`、`keywords`、`canonical`
- Open Graph / Twitter 分享卡（`og-cover.jpg`）
- `LocalBusiness` 结构化数据：名称、logo、电话、两个 `contactPoint`、邮箱、成立日期、地址、`areaServed`、`hasMap`、`makesOffer`
- `robots.txt` 放行全部 + 指向 sitemap
- `sitemap.xml`（单页）
- `favicon.ico` / `apple-touch-icon` / PWA manifest

> 搜索引擎提交暂不做。百度结果里的「站点多子链」需要多个可抓取页面 + 站点权重积累，单页站点一般不会出现；后续要争取这个位置，需先拆多页再提交站点。

---

## 9. 上线待办

- [ ] 补 ICP 备案号并写入页脚
- [ ] 替换 3 个预留展示位为真实广告设计成品图
- [ ] 视情况把单页拆成多页

---

## 10. 开发约定

- 文件命名：小写中划线；图片 `case-{项目}.jpg`
- 类名：简化 BEM（`section__title`、`tile--empty`）
- 语义标签：`header / nav / main / section / footer`，一键回到主内容有 `.skip`
- 改颜色只改 CSS 变量；改联系方式同步 HTML、页脚、JSON-LD 三处
- 提交前本地过一遍：手机视口（375px）无横向滚动、图片无 404
