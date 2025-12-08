import mqtt from "mqtt";

// ============================================================================
// 1. 配置信息
// ============================================================================
// 这里定义连接 MQTT 服务器需要的基本信息
export const MQTT_CONFIG = {
  host: "emqx.van.xrak.xyz", // MQTT 服务器地址
  tcpPort: 1883,             // TCP 端口（给 Node.js 后端代码用的）
  wsPort: 8083,              // WebSocket 端口（给浏览器前端代码用的）
  path: "/mqtt",             // WebSocket 路径，通常是 /mqtt
  topic: "test/nextjs/demo", // 我们要订阅和发布的主题（相当于频道）
};

/**
 * 获取连接地址
 * 
 * 知识点：
 * - 浏览器（前端）只能用 WebSocket 协议 (ws:// 或 wss://) 连接 MQTT。
 * - 服务器（后端）通常用 TCP 协议 (mqtt://) 连接，效率更高。
 */
export function getBrokerUrl() {
  // 判断当前代码是否运行在服务器端
  const isServer = typeof window === "undefined";

  if (isServer) {
    // 后端：使用 TCP 协议
    // 格式：mqtt://emqx.van.xrak.xyz:1883
    return `mqtt://${MQTT_CONFIG.host}:${MQTT_CONFIG.tcpPort}`;
  } else {
    // 前端：使用 WebSocket 协议
    // 格式：ws://emqx.van.xrak.xyz:8083/mqtt
    return `ws://${MQTT_CONFIG.host}:${MQTT_CONFIG.wsPort}${MQTT_CONFIG.path}`;
  }
}

/**
 * 创建 MQTT 客户端
 * 这是一个辅助函数，帮我们快速创建一个连接好的客户端对象
 */
export function createMqttClient() {
  const url = getBrokerUrl();
  
  console.log(`[MQTT] 正在连接到: ${url}`);

  // mqtt.connect 会自动根据 URL 建立连接
  // 这里的配置项是为了保证连接更稳定
  return mqtt.connect(url, {
    // 每次连接都生成一个新的 ID，避免冲突
    clientId: `client_${Math.random().toString(16).slice(2)}`,
    
    // clean: true 表示不保留旧的会话信息，每次都是新的开始
    clean: true,
    
    // 连接超时时间（毫秒）
    connectTimeout: 4000,
  });
}
