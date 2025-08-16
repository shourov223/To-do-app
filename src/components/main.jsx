"use client"
import { useState } from "react"
import { Plus, X, Check, Edit2, Save, Calendar, Filter } from "lucide-react"

const TodoApp = () => {
    const [inputValue, setInputValue] = useState("")
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState("all") // all, active, completed
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState("")

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const addTask = () => {
        const trimmedValue = inputValue.trim()
        if (!trimmedValue) {
            alert("Please enter a task!")
            return
        }
        
        if (tasks.some(task => task.text.toLowerCase() === trimmedValue.toLowerCase())) {
            alert("This task already exists!")
            return
        }

        const newTask = {
            id: Date.now(),
            text: trimmedValue,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        }

        setTasks([...tasks, newTask])
        setInputValue("")
    }

    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const startEdit = (id, text) => {
        setEditingId(id)
        setEditValue(text)
    }

    const saveEdit = () => {
        const trimmedValue = editValue.trim()
        if (!trimmedValue) {
            alert("Task cannot be empty!")
            return
        }

        setTasks(tasks.map(task => 
            task.id === editingId ? { ...task, text: trimmedValue } : task
        ))
        setEditingId(null)
        setEditValue("")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValue("")
    }

    const clearCompleted = () => {
        setTasks(tasks.filter(task => !task.completed))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask()
        }
    }

    const handleEditKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveEdit()
        } else if (e.key === 'Escape') {
            cancelEdit()
        }
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === "active") return !task.completed
        if (filter === "completed") return task.completed
        return true
    })

    const completedCount = tasks.filter(task => task.completed).length
    const activeCount = tasks.length - completedCount

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ✨ Todo App
                    </h1>
                    <p className="text-gray-600 mt-2">Stay organized, stay productive</p>
                </div>

                {/* Input Section */}
                <div className="mb-6">
                    <div className="flex gap-2">
                        <input
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-400"
                            type="text"
                            placeholder="What needs to be done?"
                            maxLength={100}
                        />
                        <button
                            onClick={addTask}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {tasks.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>📋 Total: {tasks.length}</span>
                            <span>⚡ Active: {activeCount}</span>
                            <span>✅ Done: {completedCount}</span>
                        </div>
                    </div>
                )}

                {/* Filter Buttons */}
                {tasks.length > 0 && (
                    <div className="flex gap-2 mb-6">
                        {["all", "active", "completed"].map(filterType => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filter === filterType
                                        ? "bg-purple-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Task List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-6xl mb-4">📝</div>
                            <p>
                                {tasks.length === 0 
                                    ? "No tasks yet. Add one above!" 
                                    : `No ${filter} tasks`
                                }
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    task.completed
                                        ? "bg-green-50 border-green-200"
                                        : "bg-white border-gray-200 hover:border-purple-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Complete Button */}
                                    <button
                                        onClick={() => toggleComplete(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                            task.completed
                                                ? "bg-green-500 border-green-500 text-white"
                                                : "border-gray-300 hover:border-purple-500"
                                        }`}
                                    >
                                        {task.completed && <Check size={14} />}
                                    </button>

                                    {/* Task Content */}
                                    <div className="flex-1">
                                        {editingId === task.id ? (
                                            <input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyPress={handleEditKeyPress}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:border-purple-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <div>
                                                <p className={`font-medium ${
                                                    task.completed 
                                                        ? "line-through text-gray-500" 
                                                        : "text-gray-800"
                                                }`}>
                                                    {task.text}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <Calendar size={12} />
                                                    {task.createdAt}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-1">
                                        {editingId === task.id ? (
                                            <>
                                                <button
                                                    onClick={saveEdit}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(task.id, task.text)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeTask(task.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Clear Completed Button */}
                {completedCount > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={clearCompleted}
                            className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        >
                            Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TodoApp