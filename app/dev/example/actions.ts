"use server"; // 声明：这是一个只在服务端运行的文件

import { createMqttClient, MQTT_CONFIG } from "@/lib/utils/mqtt";

/**
 * 服务端 Action：从后端发布消息
 * 
 * 这里的代码会在 Node.js 环境执行，而不是在浏览器里。
 * 我们可以直接用 TCP 协议连接 MQTT，速度快且稳定。
 */
export async function publishMessageServer(message: string) {
  console.log("[服务端] 准备发送消息:", message);

  // 1. 创建客户端（连接到 TCP 端口）
  const client = createMqttClient();

  return new Promise<void>((resolve, reject) => {
    
    // 2. 监听连接成功事件
    client.on("connect", () => {
      console.log("[服务端] 连接成功，开始发布...");
      
      // 3. 发布消息
      // publish(主题, 内容, 回调函数)
      client.publish(MQTT_CONFIG.topic, message, (err) => {
        if (err) {
          console.error("[服务端] 发送失败:", err);
          reject(err);
        } else {
          console.log("[服务端] 发送成功!");
          resolve();
        }
        
        // 4. 发完消息后，记得断开连接，释放资源
        client.end();
      });
    });

    // 5. 监听错误
    client.on("error", (err) => {
      console.error("[服务端] 连接出错:", err);
      client.end();
      reject(err);
    });
  });
}
