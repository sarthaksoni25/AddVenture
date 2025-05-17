import { Form, Input, Button } from "antd";
import { useState } from "react";
import { useUser } from "./useUser";

export default function UserLogin() {
  const { login } = useUser();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    login(name.trim() || "Guest");
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      style={{
        width: 300,
        backgroundColor: "#1a1a1a",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
      }}
    >
      <Form.Item label={<span style={{ color: "white" }}>Enter name</span>}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            backgroundColor: "#2a2a2a",
            color: "white",
            borderColor: "#444",
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!name.trim()}
        >
          Login
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="default" block onClick={() => login("Guest")}>
          Continue as Guest
        </Button>
      </Form.Item>
    </Form>
  );
}
