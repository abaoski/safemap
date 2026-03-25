import { BubbleChat } from "flowise-embed-react"

function ChatWidget() {
    return (
        <BubbleChat
            chatflowid="a465361c-a91f-46a3-9771-81e0caf1472f"
            apiHost="https://cloud.flowiseai.com"
            theme={{
                button: {
                    backgroundColor: "#1e3a5f",
                    right: 20,
                    bottom: 20,
                    size: 52,
                    dragAndDrop: false,
                    iconColor: "#ffffff",
                    autoWindowOpen: {
                        autoOpen: false,
                        openDelay: 2,
                        autoOpenOnMobile: false,
                    },
                },
                tooltip: {
                    showTooltip: true,
                    tooltipMessage: "Ask SafeMap Assistant 👋",
                    tooltipBackgroundColor: "#1e3a5f",
                    tooltipTextColor: "#ffffff",
                    tooltipFontSize: 14,
                },
                chatWindow: {
                    showTitle: true,
                    showAgentMessages: true,
                    title: "SafeMap Assistant",
                    titleAvatarSrc:
                        "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
                    welcomeMessage:
                        "Hi! I'm the SafeMap Assistant 🛡️\n\nHow can I help you today?",
                    errorMessage: "Something went wrong. Please try again.",
                    backgroundColor: "#ffffff",
                    height: 620,
                    width: 400,
                    fontSize: 15,
                    starterPrompts: [
                        "Report Incident",
                        "Track Report",
                        "Hotspot Colors",
                        "PNP Contact",
                        "VAWC Hotline",
                        "Emergency Help",
                        "Safety Tips",
                        "Map Filters",
                    ],
                    starterPromptFontSize: 13,
                    clearChatOnReload: false,
                    renderHTML: true,
                    botMessage: {
                        backgroundColor: "#f1f5f9",
                        textColor: "#0f172a",
                        showAvatar: true,
                        avatarSrc:
                            "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
                    },
                    userMessage: {
                        backgroundColor: "#3b82f6",
                        textColor: "#ffffff",
                        showAvatar: false,
                    },
                    textInput: {
                        placeholder: "Ask me anything about SafeMap…",
                        backgroundColor: "#ffffff",
                        textColor: "#0f172a",
                        sendButtonColor: "#3b82f6",
                        maxChars: 300,
                        autoFocus: false,
                        sendMessageSound: false,
                        receiveMessageSound: false,
                    },
                    feedback: {
                        color: "#64748b",
                    },
                    dateTimeToggle: {
                        date: true,
                        time: false,
                    },
                    footer: {
                        textColor: "#303235",
                        text: "Powered by",
                        company: "SafeMap",
                        companyLink: "#",
                    },
                },
                customCSS: `
          /* Match DM Sans font from SafeMap design system */
          #flowise-chatbot * {
            font-family: 'DM Sans', sans-serif !important;
          }

          /* Starter prompts into a horizontal floating carousel */
          .starter-prompts-container {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 8px !important;
            padding: 12px 16px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            margin-top: auto !important;
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(4px) !important;
            border-top: 1px solid #f1f5f9 !important;
            z-index: 10 !important;
          }

          .starter-prompts-container::-webkit-scrollbar {
            display: none !important;
          }

          .starter-prompt-button {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 9999px !important;
            background: #ffffff !important;
            color: #1e3a5f !important;
            font-weight: 500 !important;
            font-size: 13px !important;
            padding: 8px 16px !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }

          .starter-prompt-button:hover {
            background: #eff6ff !important;
            border-color: #3b82f6 !important;
            color: #3b82f6 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.08) !important;
          }

          /* Chat header styling */
          .chat-header {
            background: #1e3a5f !important;
            border-radius: 12px 12px 0 0 !important;
          }
        `,
            }}
        />
    )
}

export default ChatWidget
