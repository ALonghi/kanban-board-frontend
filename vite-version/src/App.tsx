import React from "react";
import TaskColumn from "@/components/task/TaskColumn";
import "./App.css";

function App() {
    return (
        <main>
            <h1
                className={`text-5xl text-transparent font-bold flex justify-center mt-4 
                bg-clip-text 
                bg-gradient-to-r from-violet-500 to-fuchsia-500`}>
                Welcome to your Kanban Board
            </h1>
            <div className={`h-full w-full px-4 py-10`}>
                <div className={`flex h-full`}>
                    <TaskColumn column={"To Do"}/>
                    <TaskColumn column={"In Progress"}/>
                    <TaskColumn column={"Completed"}/>
                </div>
            </div>
        </main>
    );
}

export default App;