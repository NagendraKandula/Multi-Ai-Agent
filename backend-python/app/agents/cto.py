from langchain_openai import ChatOpenAI

def get_cto_agent():
    llm = ChatOpenAI(
        model="meta-llama/llama-3.1-70b-instruct",
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key="YOUR_OPENROUTER_API_KEY"
    )

    def cto_node(state):
        messages = state["messages"]
        context = state.get("onboarding_data", {})

        prompt = f"""
You are the CTO.

Business: {context.get("businessName")}
Problem: {context.get("problemSolving")}
Budget: {context.get("budgetRange")}

Previous discussion:
{messages}

Give technical advice (stack, architecture, feasibility).
"""

        response = llm.invoke(prompt)

        state["messages"].append(f"CTO: {response.content}")
        return state

    return cto_node