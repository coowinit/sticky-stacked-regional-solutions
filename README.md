# Regional Solutions — Sticky Stacked Cards

一个面向企业官网“区域市场解决方案（Regional Solutions）”场景设计的响应式前端组件。

项目采用 **Sticky Stacked Cards（粘性叠加卡片）** 的滚动交互：桌面端浏览时，后续区域卡片会随着页面滚动依次向上叠加；移动端则自动降级为普通纵向卡片，保证阅读与触控体验稳定。

当前 Demo 以建筑装饰 / WPC 产品网站为使用场景，重点展示不同区域市场的场景图片、标题、简介、解决方案入口，以及独立的 3D 预览与二维码入口。

---

## 项目特点

- **Sticky Stacked Cards**：桌面端卡片滚动叠加，形成具有层次感的区域展示效果。
- **单卡 / 多卡兼容**：只有 1 个 Region 时仍是一张完整的大卡片；增加到 2～6 个 Region 后自动进入叠卡模式。
- **1290px 内容宽度**：与目标网站主体内容宽度保持一致，方便直接嫁接到现有页面。
- **左右 1:1 大卡布局**：桌面端左侧场景图、右侧标题与描述，视觉稳定、信息完整。
- **900 × 600 场景图标准**：示例图片统一采用 3:2 比例，后期可独立替换为真实项目图片。
- **独立 3D 入口**：每个 Region 都可以配置自己的 3D Preview URL。
- **二维码 Hover 预览**：桌面端 Hover / Focus 3D 按钮时显示二维码，二维码固定为 **120 × 120px**。
- **移动端自动降级**：≤ 900px 时关闭 Sticky，改为自然纵向滚动；二维码隐藏，用户直接点击 3D 按钮进入预览页。
- **无第三方框架依赖**：不依赖 GSAP、ScrollTrigger、Swiper、jQuery 或前端构建工具。
- **轻量 JavaScript**：JS 只负责检测卡片数量、写入卡片序号和 CSS 索引，不承担复杂动画。
- **易于维护**：新增区域主要复制一段 `<article>`，替换图片、文字、链接和二维码即可。

---

## 效果名称

本项目的核心滚动效果通常称为：

**Sticky Stacked Cards**

也可以使用以下关键词搜索类似案例：

```text
sticky stacked cards
stacked cards on scroll
sticky card stack
scroll stacking cards
sticky overlapping cards
```

核心原理并不是复杂的 JavaScript 动画，而是浏览器原生的：

```css
position: sticky;
```

配合不同卡片的 `top`、`z-index` 和 CSS 自定义变量实现层层叠加。

---

## 目录结构

```text
sticky-stacked-regional-solutions/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
└─ images/
   ├─ region-north-america.svg
   ├─ region-europe.svg
   ├─ region-middle-east.svg
   ├─ region-southeast-asia.svg
   ├─ vr720.png
   └─ qr-fluted-wall-panel-veneer.png
```

### 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 项目主页面，包含 Regional Solutions 示例结构 |
| `css/style.css` | 页面布局、Sticky Stack、响应式、3D / QR 交互样式 |
| `js/app.js` | 自动识别多卡模式，并为每张卡片写入序号与索引 |
| `images/region-*.svg` | 900 × 600 SVG 场景占位图 |
| `images/vr720.png` | 3D 按钮图标 |
| `images/qr-*.png` | 3D 二维码图片 |

> `Previous Section` 和 `Next Section` 是为了测试上下模块衔接而加入的 Demo 区块，正式集成到网站时可以删除。

---

## 快速使用

项目没有安装步骤，也不需要 npm。

下载后直接打开：

```text
index.html
```

即可本地预览。

正式部署时只需要保持 HTML、CSS、JS 和 images 目录的相对路径一致。

---

# 核心布局设计

## 桌面端

页面最大内容宽度：

```css
--container: 1290px;
```

区域卡片采用左右两列：

```text
┌──────────────────────┬──────────────────────┐
│                      │                      │
│    Region Image      │   Region Content     │
│       50%            │       50%            │
│                      │                      │
│                [3D]  │   View Solution →    │
└──────────────────────┴──────────────────────┘
```

默认场景图建议：

```text
900 × 600 px
3 : 2
```

在 1290px 容器中，左右各约 645px，图片显示高度约 430px，与当前卡片高度能够自然匹配。

---

## Sticky Stacked Cards 原理

当 `.region-stack` 中存在两张及以上卡片时，JavaScript 会自动加入：

```html
has-multiple
```

每张卡片同时获得一个 CSS 变量：

```css
--index: 0;
--index: 1;
--index: 2;
...
```

然后通过：

```css
.region-stack.has-multiple .region-card {
  position: sticky;
  top: calc(var(--stack-top) + (var(--index) * var(--stack-step)));
  z-index: calc(10 + var(--index));
}
```

形成叠加效果。

当前核心参数：

```css
--stack-top: 70px;
--stack-step: 11px;
--stack-end-hold: clamp(220px, 28vh, 300px);
```

### 参数含义

- `--stack-top`：第一张卡片吸附到浏览器顶部后的距离。
- `--stack-step`：后续卡片相对于上一张卡片额外向下错开的距离，决定叠层露出的统一间距。
- `--stack-end-hold`：最后一张卡片到达目标 Sticky 位置后，继续保持完整叠层状态的滚动距离。
- `z-index`：保证后面的卡片叠加到前面的卡片上方。

### 为什么需要 `--stack-end-hold`

Sticky 卡片在进入目标位置之前仍处于正常滚动阶段，因此最后一张卡片刚进入叠层区域时，视觉间距会逐步收拢。真正完成叠加后，每张卡片之间的露出距离统一由 `--stack-step` 控制。

如果父容器底部预留距离太短，最后一张卡片刚到达正确位置就会马上受到父容器底部约束并开始离场，于是用户很难看到稳定、等距的最终叠层状态。

本版本增加 `--stack-end-hold`，为最后一张卡片保留更充足的“收尾停留区”，使 01～04 完成叠加后能够稳定保持统一层间距，再自然离开当前模块。

### 为什么需要 `--stack-end-hold`

Sticky 卡片在进入目标位置之前仍处于正常滚动阶段，因此最后一张卡片刚进入叠层区域时，视觉间距会逐步收拢。真正完成叠加后，每张卡片之间的露出距离统一由 `--stack-step` 控制。

需要注意：**不能只通过 `padding-bottom` 延长最后一张卡片的 Sticky 停留时间。** 实测中，padding 虽然增加了父容器视觉高度，但不会稳定延长 Sticky 元素用于计算底部边界的有效内容区域，因此第四张到位后，前几张卡片仍可能提前被父容器底部推走。

当前版本改为在 `.region-stack` 末尾使用真实的 CSS 伪元素占位：

```css
.region-stack.has-multiple::after {
  content: "";
  display: block;
  height: var(--stack-end-hold);
}
```

这样 04 到达 `top: 103px` 后，01～04 可以稳定保持 `70 / 81 / 92 / 103px` 的统一叠层位置一段距离，然后整组卡片再一起离开当前模块。

> 不建议把 `--stack-step` 设为 `0`。虽然可以完全隐藏层间距，但会削弱 Sticky Stacked Cards 最重要的“层叠”视觉提示。当前保留小而统一的间距更符合这个组件的设计目标。

如果未来网站顶部有固定 Header，可以适当增加 `--stack-top`。

例如：

```css
--stack-top: 100px;
```

---

## 为什么不使用 GSAP / ScrollTrigger

这个项目的目标不是制作复杂的滚动动画实验，而是一个可以长期用于企业网站的稳定组件。

因此优先使用浏览器原生 `position: sticky`，优势包括：

- 代码量更少；
- 没有第三方库依赖；
- 页面加载成本更低；
- 后期维护更简单；
- WordPress / 普通 HTML 页面都容易集成；
- 不容易因为插件或库版本变化导致效果失效。

JavaScript 只承担结构辅助工作，而不控制滚动动画本身。

---

# 新增一个 Region

后期新增区域时，不需要修改 JavaScript。

只需要复制一个完整的：

```html
<article class="region-card">
  ...
</article>
```

然后修改以下内容：

1. 区域场景图片；
2. 图片 `alt`；
3. Region 名称；
4. 标题；
5. 描述；
6. `View Solution` 链接；
7. 3D Preview URL；
8. 二维码图片。

卡片序号会由 `app.js` 自动生成，无需手动维护。

---

## 推荐的 Region 数量

这个交互最适合：

```text
1 ～ 6 个 Region
```

例如：

```text
North America
Europe
Middle East
Southeast Asia
Australia & New Zealand
Latin America
```

如果未来区域数量明显超过 6～8 个，建议重新评估信息架构，例如增加区域筛选或独立的 Region Listing 页面，而不是无限延长 Sticky Stack。

---

# 场景图片维护

当前项目使用 SVG 占位图：

```text
900 × 600
```

正式上线时可以替换为 JPG、WebP、AVIF 或其他真实场景图片。

推荐保持：

```text
宽度：900px 左右
高度：600px 左右
比例：3:2
```

HTML 无需变化，例如：

```html
<img
  src="images/region-north-america.jpg"
  alt="North America market application scene"
>
```

CSS 已使用：

```css
object-fit: cover;
```

因此图片会自动填满媒体区域。

### 图片选择建议

Regional Solutions 更适合使用完整应用场景，而不是单独的产品白底图，例如：

- 室内墙面；
- Villa / Residential；
- Commercial Space；
- Resort；
- Decking；
- Exterior Wall；
- Outdoor Living；
- Hospitality Project。

这样更容易体现“区域解决方案”而不仅仅是“区域产品列表”。

---

# 3D Preview 与二维码

3D 按钮固定在左侧场景图的右下角。

桌面端：

```text
Hover / Focus 3D
      ↓
显示 QR Code
      ↓
点击 3D
      ↓
进入对应 3D Preview URL
```

二维码显示尺寸固定为：

```css
width: 120px;
height: 120px;
```

这样既能保证扫描体验，又不会遮挡过多场景图片。

---

## 为每个 Region 设置独立 3D URL

例如：

```html
<a
  class="media-3d__button"
  href="https://example.com/north-america-3d/"
  target="_blank"
  rel="noopener"
>
  ...
</a>
```

每个区域都可以使用不同地址。

---

## 为每个 Region 设置独立二维码

例如 North America：

```html
<img
  src="images/qr-north-america.png"
  alt="QR code for North America 3D preview"
>
```

Europe：

```html
<img
  src="images/qr-europe.png"
  alt="QR code for Europe 3D preview"
>
```

因此 HTML 结构不需要变化，只需要替换图片路径。

---

# 移动端策略

在宽度小于等于 `900px` 时，项目会自动关闭 Sticky Stack：

```css
@media (max-width: 900px) {
  .region-stack.has-multiple .region-card {
    position: relative;
    top: auto;
  }
}
```

布局从：

```text
图片 | 文字
```

变为：

```text
图片
────
文字
```

## 为什么移动端不继续 Sticky Stacked Cards

桌面端 Sticky Stack 很适合大屏滚动展示，但手机屏幕高度有限，一张完整卡片往往接近一屏高度。

如果继续强制 Sticky：

- 容易产生明显的“卡住”感；
- 后一张卡片可能过早覆盖前一张文字；
- 不同手机屏幕高度差异会放大交互问题；
- 触控滚动体验不如自然纵向浏览稳定。

因此当前策略是：

| 设备 | 卡片布局 | Sticky | QR |
|---|---|---|---|
| Desktop | 左图右文 | 开启 | Hover / Focus 显示 |
| Tablet / ≤900px | 图上文下 | 关闭 | 隐藏 |
| Mobile | 图上文下 | 关闭 | 隐藏 |

移动端用户直接点击 3D 按钮进入 3D 页面，不需要扫描自己屏幕上的二维码。

---

# 响应式断点

项目主要使用两个断点：

```css
@media (max-width: 900px) { ... }
@media (max-width: 560px) { ... }
```

### ≤ 900px

- 关闭 Sticky；
- 卡片变为单列；
- 图片维持 3:2；
- QR Popover 隐藏；
- 缩小卡片内边距。

### ≤ 560px

进一步缩小：

- 页面左右边距；
- 标题字号；
- 正文字号；
- 3D 按钮尺寸。

---

# 可访问性与用户体验

项目已经考虑以下基础细节：

### 1. 图片 `alt`

每张区域图片都应填写有意义的 `alt`。

### 2. 3D 链接 `aria-label`

示例：

```html
aria-label="Open North America 3D preview"
```

### 3. Keyboard Focus

二维码不仅支持鼠标 Hover，也支持：

```css
:focus-within
```

因此桌面端键盘用户 Focus 到 3D 链接时，同样可以显示二维码。

### 4. Reduced Motion

项目支持：

```css
@media (prefers-reduced-motion: reduce)
```

当用户系统设置为减少动画时，会自动缩短或关闭大部分过渡效果。

---

# 与现有网站集成

如果只是把 Regional Solutions 加到现有页面中，建议不要直接复制整个 Demo 页面。

正式集成时主要迁移三部分：

### 1. HTML

复制：

```html
<section class="regions" id="regional-solutions">
  ...
</section>
```

不要复制 Demo 专用的：

```html
<section class="demo-spacer">...</section>
```

### 2. CSS

可以把与以下类名相关的样式合并到网站现有 CSS：

```text
.regions
.section-head
.region-stack
.region-card
.region-card__media
.region-card__body
.media-3d
```

### 3. JavaScript

保留 `app.js` 中 Region Stack 初始化代码即可。

代码非常轻量，可以合并到网站现有 JS 文件中。

---

# 主要可配置参数

项目把最值得维护的参数放在 `:root`：

```css
:root {
  --container: 1290px;
  --stack-top: 70px;
  --stack-step: 11px;
  --brand: #7448d8;
  --radius-lg: 24px;
}
```

### 常用调整

#### 修改最大宽度

```css
--container: 1290px;
```

#### 修改 Sticky 顶部位置

```css
--stack-top: 70px;
```

#### 修改卡片叠层露出距离

```css
--stack-step: 11px;
```

#### 修改品牌色

```css
--brand: #7448d8;
```

#### 修改卡片圆角

```css
--radius-lg: 24px;
```

建议优先修改变量，不要在多个选择器中重复覆盖相同值。

---

# 技术栈

项目 intentionally 保持轻量：

```text
HTML5
CSS3
Vanilla JavaScript
SVG / PNG
```

重点涉及的前端知识包括：

- CSS Grid；
- `position: sticky`；
- CSS Custom Properties；
- `calc()`；
- `clamp()`；
- `aspect-ratio`；
- `object-fit`；
- `z-index` / stacking context；
- `:focus-within`；
- `@media (hover: hover)`；
- Responsive Design；
- `prefers-reduced-motion`；
- 渐进增强（Progressive Enhancement）。

---

# 设计原则

这个项目不是为了堆叠更多动画，而是围绕以下原则设计：

### 1. 一个 Region 也要完整

当前只有一个市场时，页面仍然应该像一个正式设计，而不是“缺少其他卡片”。

### 2. 增加 Region 不重新设计

从 1 个扩展到 2～6 个时，只增加内容，不重构布局。

### 3. 桌面端强调体验，移动端强调阅读

不是要求所有设备保持完全相同的动画，而是让不同设备使用更适合自己的交互方式。

### 4. 优先原生 CSS

能用浏览器原生能力完成，就不为了一个视觉效果额外引入大型动画库。

### 5. 内容与交互解耦

每张 Region Card 都是独立单元，图片、文案、二维码和链接可以分别维护。

---

# 后期扩展方向

在保持现有架构简洁的前提下，未来可以考虑：

- 增加真实区域市场图片；
- 每个 Region 使用独立二维码；
- 接入真实 3D Viewer URL；
- `View Solution` 链接到独立区域详情页；
- 增加 Region 对应的推荐产品；
- 增加项目案例 / 应用场景；
- 优化图片为 WebP / AVIF；
- 配合 WordPress 后台字段动态生成 Region Card；
- 在不改变 HTML 结构的前提下增加轻量进入动画。

不建议为了增加功能而加入复杂的卡片状态管理、前端框架或不必要的滚动动画库。

---

# 维护建议

日常维护主要集中在 `index.html`：

```text
新增 Region  → 复制 <article class="region-card">
修改图片     → 修改 img src
修改二维码   → 修改 QR img src
修改 3D      → 修改 media-3d__button href
修改详情链接 → 修改 region-card__cta href
修改文案     → 修改对应标题和描述
```

正常情况下：

```text
css/style.css  → 长期稳定
js/app.js      → 长期稳定
```

这也是本项目最重要的维护目标：**后期主要维护内容，而不是反复修改交互逻辑。**

---

## 总结

`Regional Solutions — Sticky Stacked Cards` 是一个针对企业官网区域市场展示场景设计的轻量前端组件。

它利用原生 CSS Sticky 将普通的区域卡片列表转化为更有层次感的滚动叙事，同时通过响应式降级保证手机端体验稳定。

对于需要展示 **1～6 个区域市场、建筑应用、项目场景或解决方案** 的网站，这种结构能够在视觉表现、信息承载、扩展性和长期维护之间取得较好的平衡。


---

## v1.0.2

- 优化最后一张卡片完成叠加后的停留距离；
- 将末尾停留区从 `padding-bottom` 改为真实 `::after` 流式占位，修复第四张到位后叠层间距仍不稳定的问题；
- 保持 01～04 完成叠加后的层间距统一由 `--stack-step` 控制；
- 保留移动端原有自然卡片流，不改变手机端交互；
- 修正 README 中主页面文件名与当前项目目录结构不一致的问题。
