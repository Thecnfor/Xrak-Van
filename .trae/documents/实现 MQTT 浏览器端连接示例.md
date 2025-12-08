# Next.js 全栈 MQTT 示例方案

我们将利用 Next.js 的全栈特性，同时实现**服务端发布**（使用 TCP 1883）和**客户端实时订阅**（使用 WebSocket 8083），并将核心逻辑封装在 `lib/utils` 中。

## 实现架构
1.  **通用工具 (`lib/utils/mqtt.ts`)**: 
    - 封装 MQTT 客户端创建逻辑。
    - **智能环境切换**: 
        - **服务端 (Node.js)**: 使用 `mqtt://emqx.van.xrak.xyz:1883` (TCP)。
        - **客户端 (Browser)**: 自动切换为 `ws://emqx.van.xrak.xyz:8083/mqtt` (WebSocket)，因为浏览器不支持 TCP。

2.  **服务端能力 (`app/dev/example/actions.ts`)**:
    - 创建一个 Server Action。
    - 在服务端通过 TCP 1883 端口连接 MQTT 并发布消息。
    - 演示 Next.js 后端与 MQTT 的交互。

3.  **前端页面 (`app/dev/example/page.tsx`)**:
    - 使用 `"use client"`。
    - 调用 `lib/utils/mqtt.ts` 建立长连接，实时订阅并显示主题消息。
    - 提供两个发布按钮：
        1.  **客户端发布**: 直接通过浏览器连接发送。
        2.  **服务端发布**: 调用 Server Action 发送（模拟后端业务触发通知）。

## 步骤
1.  创建 `lib/utils/mqtt.ts`，实现跨端兼容的连接器。
2.  创建 `app/dev/example/actions.ts`，实现服务端发布逻辑。
3.  创建 `app/dev/example/page.tsx`，实现 UI、实时订阅逻辑及两种发布方式的调用。

这样既满足了您“在 lib/utils 写方法”和“使用 1883 端口（后端）”的要求，也实现了“前端实时更新（通过 WS 订阅）”的效果。
