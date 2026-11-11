# 基于扩散模型的夜间图像去雾方法

这是可直接部署到 GitHub Pages 的静态项目主页。解压后双击 `index.html` 即可在浏览器本地预览。网站默认显示中文，顶部可切换 English。部署后也可以通过 `?lang=en` 直接分享英文版链接。

## 填写项目信息

打开 `site-config.js`，在 `githubUrl` 填写代码仓库完整网址，例如 `https://github.com/你的用户名/代码仓库名`。保存后，顶部 GitHub 按钮就会跳转到该仓库。仓库为空时，该按钮显示为禁用。

同一文件也可填写论文链接 `paperUrl`、作者 `authors`、单位 `affiliation`、会议信息 `venue`、摘要 `abstract` 和 `bibtex`。有 `zh`、`en` 两项的字段可分别填写中文版和英文版。标题下方预留一行填写作者。摘要为空时保留章节标题。网页英文标题是当前中文标题的直译，可修改 `index.html` 中 `id="paper-title"` 的 `data-en`。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个公开仓库，例如 `night-dehazing`。这是项目主页仓库，代码仓库也可以用另一个仓库。
2. 解压后，把 `night-dehazing` 文件夹**里面的内容**上传到主页仓库的 `main` 分支，确保 `index.html` 和 `.nojekyll` 直接位于仓库根目录，`assets` 目录完整保留。使用网页时，在仓库的 **Add file → Upload files** 中拖入这些内容，再提交更改。
3. 打开主页仓库的 **Settings → Pages**。在 **Build and deployment** 中将 **Source** 设为 **Deploy from a branch**，分支选 **main**，目录选 **/(root)**，然后点击 **Save**。
4. 发布完成后，回到 **Settings → Pages** 点击 **Visit site**。对于上述仓库名，地址是 `https://你的用户名.github.io/night-dehazing/`。发布英文版时可以分享 `https://你的用户名.github.io/night-dehazing/?lang=en`。
5. 日后修改图片或文案时，把改动提交到同一个分支，GitHub Pages 会重新部署。

发布后，访客可以直接访问随站上传的图片。

[GitHub Pages 官方部署说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 维护对比图

- `scenes.js` 控制场景顺序和对外显示的原始文件名。首个场景会默认显示。页尾使用论文中的 `01_3✖8.pdf`，网页以 WebP 显示原图。
- 每个场景的图像位于 `assets/realnighthaze/<场景 ID>/`，含 `hazy.webp`、八种基线的输出和 `ours.webp`，以无损 WebP 打包。对比时所有输出映射到原始有雾图的画布比例，以便叠加比较对应位置。NightHaze 的 512×512 文件保留原始尺寸。
- 方法概览使用论文中的原始中文框架图，英文版提供英文图注和模块说明。
- `metrics.js` 存储论文中 RealNightHaze 和 NHRW 的定量表，两张表在页面底部直接展开。视觉对比区仅展示 RealNightHaze。
