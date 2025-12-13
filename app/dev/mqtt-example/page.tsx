"use client"; // 声明：这是一个在浏览器运行的组件

import { useEffect, useState } from "react";
import { createMqttClient, MQTT_CONFIG } from "@/lib/utils/mqtt";
import { publishMessageServer } from "./actions";
import { MqttClient } from "mqtt";

export default function MqttExamplePage() {
  // 状态 1: MQTT 客户端实例，用来发送消息
  const [client, setClient] = useState<MqttClient | null>(null);
  
  // 状态 2: 连接状态 (连接中 / 已连接 / 断开)
  const [status, setStatus] = useState("正在连接...");
  
  // 状态 3: 收到的消息列表
  const [messages, setMessages] = useState<string[]>([]);

  // 状态 4: 输入框的内容
  const [inputValue, setInputValue] = useState("");

  // ==========================================================================
  // 核心逻辑：页面加载时，连接 MQTT
  // ==========================================================================
  useEffect(() => {
    // 1. 创建客户端（会自动连到 WebSocket 8083）
    const mqttClient = createMqttClient();

    // 2. 监听 "connect" 事件：连接成功了！
    mqttClient.on("connect", () => {
      setStatus("已连接");
      console.log("前端已连接 MQTT！");

      // 3. 连接成功后，马上订阅主题
      // 只有订阅了，别人发的消息我们才能收到
      mqttClient.subscribe(MQTT_CONFIG.topic, (err) => {
        if (!err) {
          console.log(`订阅成功: ${MQTT_CONFIG.topic}`);
        }
      });
    });

    // 4. 监听 "message" 事件：收到消息了！
    mqttClient.on("message", (topic, message) => {
      // message 是二进制数据，需要 toString() 转成字符串
      const text = message.toString();
      console.log("收到新消息:", text);

      // 把新消息加到列表里
      setMessages((prev) => [...prev, text]);
    });

    // 5. 监听错误和断开
    mqttClient.on("error", (err) => setStatus("出错: " + err.message));
    mqttClient.on("close", () => setStatus("已断开连接"));

    // 保存客户端实例，后面发送消息要用
    setClient(mqttClient);

    // 6. 页面关闭时，断开连接（清理工作）
    return () => {
      console.log("页面关闭，断开 MQTT");
      mqttClient.end();
    };
  }, []);

  // ==========================================================================
  // 功能 A: 前端直接发送（通过 WebSocket）
  // ==========================================================================
  const sendFromBrowser = () => {
    if (client && client.connected) {
      // publish(主题, 内容)
      client.publish(MQTT_CONFIG.topic, inputValue || "前端测试消息");
      setInputValue(""); // 清空输入框
    } else {
      alert("还没有连接上 MQTT 服务器！");
    }
  };

  // ==========================================================================
  // 功能 B: 让服务端发送（通过 TCP）
  // ==========================================================================
  const sendFromServer = async () => {
    // 调用我们在 actions.ts 里写的服务端函数
    await publishMessageServer(inputValue || "后端测试消息");
    setInputValue("");
  };

  // ==========================================================================
  // 页面 UI
  // ==========================================================================
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>MQTT 极简示例</h1>
      
      {/* 1. 显示当前状态 */}
      <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0" }}>
        <strong>状态：</strong> {status} <br/>
        <strong>当前订阅主题：</strong> {MQTT_CONFIG.topic}
      </div>

      {/* 2. 消息列表 */}
      <div style={{ border: "1px solid #ccc", height: "300px", overflow: "auto", padding: "10px", marginBottom: "20px" }}>
        <h3>消息记录：</h3>
        {messages.length === 0 && <p style={{ color: "#999" }}>等待接收消息...</p>}
        
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
            {msg}
          </div>
        ))}
      </div>

      {/* 3. 操作区域 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入要发送的内容..."
          style={{ padding: "8px", flex: 1 }}
        />
        
        <button onClick={sendFromBrowser} style={{ padding: "8px 16px", background: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
          前端发送 (WebSocket)
        </button>
        
        <button onClick={sendFromServer} style={{ padding: "8px 16px", background: "#7928ca", color: "white", border: "none", cursor: "pointer" }}>
          后端发送 (TCP)
        </button>
      </div>

      <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        说明：无论你点哪个按钮，消息都会发到同一个主题。因为我们订阅了这个主题，所以上面的列表会马上显示出来。
      </p>
    </div>
  );
}
