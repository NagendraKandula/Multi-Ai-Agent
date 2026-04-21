from langchain_openai import ChatOpenAI

def get_cfo_agent():
    llm = ChatOpenAI(
        model="meta-llama/llama-3.1-70b-instruct",
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key="YOUR_OPENROUTER_API_KEY"
    )

    def cfo_node(state):
        messages = state["messages"]
        context = state.get("onboarding_data", {})

        prompt = f"""
You are the CFO.

Business: {context.get("businessName")}
Revenue Model: {context.get("revenueModel")}
Budget: {context.get("budgetRange")}

Previous discussion:
{messages}

Give financial advice (cost, ROI, risks).
"""

        response = llm.invoke(prompt)

        state["messages"].append(f"CFO: {response.content}")
        return state

    return cfo_node