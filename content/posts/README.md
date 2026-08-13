# Bài viết MDX

Mỗi bài viết là một file `.mdx` có frontmatter do Decap CMS tạo. Không thêm bài trực tiếp vào dữ liệu UI cũ; sau khi hoàn tất migration, `content/posts/` sẽ là nguồn nội dung duy nhất cho trang chủ, trang bài viết, sitemap và structured data.

Ví dụ:

```mdx
---
title: "Tiêu đề bài viết"
slug: "tieu-de-bai-viet"
date: "2026-08-13"
description: "Mô tả ngắn dùng cho kết quả tìm kiếm và social preview."
tags: ["systems", "databases"]
featured: false
cover: "/uploads/cover.png"
---

Nội dung bài viết ở đây.
```
