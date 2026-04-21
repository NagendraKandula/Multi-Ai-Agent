from langgraph.graph import StateGraph

def cto_node(state):
    state["messages"].append("CTO: Tech suggestion")
    return state

def cfo_node(state):
    state["messages"].append("CFO: Cost concern")
    return state

def supervisor_node(state):
    state["final"] = "Final decision made"
    return state

graph = StateGraph(dict)

graph.add_node("cto", cto_node)
graph.add_node("cfo", cfo_node)
graph.add_node("supervisor", supervisor_node)

# 👇 IMPORTANT FLOW
graph.set_entry_point("cto")
graph.add_edge("cto", "cfo")
graph.add_edge("cfo", "supervisor")

app_graph = graph.compile()