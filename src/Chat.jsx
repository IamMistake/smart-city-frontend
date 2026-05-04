import { useState } from "react";

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const sendMessage = async () => {
		if (!input) return;

		setMessages([...messages, { role: "user", text: input }]);

		setMessages((prev) => [
			...prev,
			{ role: "bot", text: "This is a demo reply" },
		]);

		setInput("");
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Chatbot</h2>

			<div style={{ minHeight: 200 }}>
				{messages.map((m, i) => (
					<div key={i}>
						<b>{m.role}:</b> {m.text}
					</div>
				))}
			</div>

			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>

			<button onClick={sendMessage}>Send</button>
		</div>
	);
}